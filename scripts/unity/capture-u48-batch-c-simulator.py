#!/usr/bin/env python3
"""Capture U48 Batch C candidates through isolated, resumable live runtime runs."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import shutil
import subprocess
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[2]
EVIDENCE = ROOT / "docs/design-targets/generated/unity-u48/batch-c"
CAPTURE_ROOT = EVIDENCE / "live-captures"
QUARANTINE_ROOT = EVIDENCE / "quarantine"
MATRIX_PATH = EVIDENCE / "capture-matrix.json"
MANIFEST_PATH = EVIDENCE / "capture-manifest.json"
PROGRESS_PATH = EVIDENCE / "capture-progress.json"
PILOT_PATH = EVIDENCE / "pilot-verification.json"
APP = ROOT / "unity/VampPonUnity/Builds/U48BatchCDerivedData/Build/Products/Release-iphonesimulator/VampPonUnitySpike.app"
BUNDLE_ID = "com.mshogo.vamppon.u1"


def run(*args: str, env: dict[str, str] | None = None, check: bool = True) -> str:
    result = subprocess.run(args, check=check, text=True, capture_output=True, env=env)
    return result.stdout.strip()


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def crop_box(group: str, width: int, height: int) -> tuple[int, int, int, int]:
    if group.startswith("hud-"):
        return (0, 0, width, max(180, int(height * .28)))
    if group.startswith("levelup-"):
        return (int(width * .08), int(height * .08), int(width * .92), int(height * .82))
    if group.startswith("replacement-"):
        return (int(width * .08), int(height * .08), int(width * .92), int(height * .84))
    return (int(width * .04), int(height * .04), int(width * .96), int(height * .96))


def simulator() -> str:
    data = json.loads(run("xcrun", "simctl", "list", "devices", "booted", "-j"))
    devices = [device for values in data["devices"].values() for device in values if device.get("state") == "Booted"]
    if len(devices) != 1:
        raise RuntimeError(f"Expected exactly one booted Simulator, found {len(devices)}")
    return devices[0]["udid"]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--resume", action="store_true", help="skip only fully validated candidate sentinels")
    parser.add_argument("--candidate-ids", help="comma-separated candidate IDs")
    parser.add_argument("--screen", choices=["hud", "levelUp", "levelup", "replacement", "result", "stageSelect", "stage-select"])
    parser.add_argument("--pilot", action="store_true", help="capture one runtime-baseline candidate per screen")
    parser.add_argument("--timeout", type=int, default=120)
    parser.add_argument("--max-retries", type=int, default=2)
    argv = sys.argv[1:]
    if argv and argv[0] == "--":
        argv = argv[1:]
    return parser.parse_args(argv)


def load_plan(args: argparse.Namespace) -> tuple[list[dict], dict, dict]:
    matrix = json.loads(MATRIX_PATH.read_text())
    contracts = json.loads((EVIDENCE / "generation-contracts.json").read_text())["contracts"]
    by_id = {contract["candidateId"]: contract for contract in contracts}
    groups = {group["assetGroup"]: group for group in matrix["groups"]}
    selected = set(filter(None, (args.candidate_ids or "").split(",")))
    if selected - by_id.keys():
        raise RuntimeError(f"Unknown candidate IDs: {sorted(selected - by_id.keys())}")
    screen = {"levelup": "levelUp", "stage-select": "stageSelect"}.get(args.screen, args.screen)
    plan = []
    for group in matrix["groups"]:
        if screen and group["screen"] != screen:
            continue
        for candidate_id in group["candidateIds"]:
            if selected and candidate_id not in selected:
                continue
            plan.append({"contract": by_id[candidate_id], "matrix": group})
    if args.pilot:
        pilot = []
        for wanted in ["hud", "levelUp", "replacement", "result", "stageSelect"]:
            matches = [item for item in plan if item["matrix"]["screen"] == wanted and item["contract"]["candidateRole"] == "runtime-baseline"]
            if matches:
                pilot.append(matches[0])
        plan = pilot
    if not plan:
        raise RuntimeError("No Batch C candidates matched the requested filters")
    return plan, matrix, by_id


def expected_files(group: dict) -> int:
    return group["expectedCaptureCountPerCandidate"]


def validate_destination(destination: Path, contract: dict, group: dict) -> tuple[bool, str]:
    summary_path = destination / "sentinel.json"
    if not summary_path.is_file():
        return False, "missing-sentinel"
    try:
        summary = json.loads(summary_path.read_text())
    except (OSError, json.JSONDecodeError):
        return False, "invalid-sentinel"
    expected = expected_files(group)
    if not (summary.get("candidateId") == contract["candidateId"] and summary.get("assetGroup") == contract["assetGroup"]):
        return False, "sentinel-identity"
    if not (summary.get("captureStarted") and summary.get("captureCompleted") and summary.get("cleanupCompleted") and summary.get("runtimeContractUnchanged")):
        return False, "incomplete-sentinel"
    if summary.get("expectedCaptureCount") != expected or summary.get("actualCaptureCount") != expected:
        return False, "capture-count"
    if set(summary.get("reachedStates", [])) != set(group["screenRequiredStates"]):
        return False, "required-state-coverage"
    if summary.get("unhandledExceptionCount") != 0 or summary.get("assertionFailureCount") != 0:
        return False, "runtime-failure"
    screenshots = sorted((destination / "screenshots").glob("*.png"))
    results = sorted((destination / "results").glob("*.json"))
    if len(screenshots) != expected or len(results) != expected:
        return False, "evidence-count"
    if any(not path.is_file() or path.stat().st_size == 0 for path in screenshots + results):
        return False, "empty-evidence"
    if not (ROOT / contract["outputPath"]).is_file() or sha(ROOT / contract["outputPath"]) != contract["outputSha256"]:
        return False, "source-sha"
    return True, "complete"


def quarantine(destination: Path, reason: str, quarantined: list[dict]) -> None:
    if not destination.exists():
        return
    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S%fZ")
    target = QUARANTINE_ROOT / stamp / destination.parent.name / destination.name
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.move(str(destination), str(target))
    quarantined.append({"candidateId": destination.name, "reason": reason, "path": str(target.relative_to(ROOT))})


def capture_candidate(device: str, container: Path, contract: dict, group: dict, timeout: int) -> dict:
    candidate = contract["candidateId"]
    asset_group = contract["assetGroup"]
    simulator_candidate = container / "Documents/u48-batch-c-captures" / asset_group / candidate
    if simulator_candidate.exists():
        shutil.rmtree(simulator_candidate)
    env = os.environ.copy()
    env.update({
        "SIMCTL_CHILD_VAMPPON_U48_PREVIEW_ENABLED": "1",
        "SIMCTL_CHILD_VAMPPON_U48_ASSET_GROUP": asset_group,
        "SIMCTL_CHILD_VAMPPON_U48_CANDIDATE_ID": candidate,
        "SIMCTL_CHILD_VAMPPON_U48_BATCH_C_CAPTURE": "1",
        "SIMCTL_CHILD_VAMPPON_U48_CAPTURE_CANONICAL_STATE": group["canonicalComparisonState"],
        "SIMCTL_CHILD_VAMPPON_U48_CAPTURE_STANDARD_STATES": ",".join(group["requiredStandardStates"]),
        "SIMCTL_CHILD_VAMPPON_U48_CAPTURE_EXPECTED_COUNT": str(group["expectedCaptureCountPerCandidate"]),
    })
    run("xcrun", "simctl", "terminate", device, BUNDLE_ID, check=False)
    run("xcrun", "simctl", "launch", device, BUNDLE_ID, env=env)
    sentinel = simulator_candidate / "sentinel.json"
    deadline = time.monotonic() + timeout
    while not sentinel.exists() and time.monotonic() < deadline:
        time.sleep(.25)
    run("xcrun", "simctl", "terminate", device, BUNDLE_ID, check=False)
    if not sentinel.exists():
        logs = run("xcrun", "simctl", "spawn", device, "log", "show", "--last", "2m", "--style", "compact", "--predicate", 'process == "VampPonUnitySpike"', check=False)
        raise RuntimeError(f"timeout:{candidate}:{logs[-3000:]}")
    summary = json.loads(sentinel.read_text())
    if not summary.get("captureCompleted") or not summary.get("passed"):
        raise RuntimeError(f"sentinel-failed:{candidate}:{json.dumps(summary, ensure_ascii=False, sort_keys=True)}")
    if summary.get("actualCaptureCount") != group["expectedCaptureCountPerCandidate"]:
        raise RuntimeError(f"capture-count:{candidate}:{summary.get('actualCaptureCount')}")
    return {"source": simulator_candidate, "summary": summary}


def import_candidate(source: Path, destination: Path, contract: dict, group: dict) -> None:
    if destination.exists():
        shutil.rmtree(destination)
    screenshots = destination / "screenshots"
    crops = destination / "component-crops"
    results = destination / "results"
    screenshots.mkdir(parents=True)
    crops.mkdir(parents=True)
    results.mkdir(parents=True)
    source_asset = ROOT / contract["outputPath"]
    shutil.copy2(source_asset, destination / "raw-preview.png")
    for result_path in sorted((source / "results").glob("*.json")):
        result = json.loads(result_path.read_text())
        ppm = source / "screenshots" / f"{result_path.stem}.ppm"
        if not ppm.is_file():
            raise RuntimeError(f"missing-screenshot:{contract['candidateId']}:{ppm.name}")
        png = screenshots / f"{result_path.stem}.png"
        with Image.open(ppm) as image:
            rendered = image.convert("RGB")
            if rendered.size != (result["width"], result["height"]):
                raise RuntimeError(f"viewport-size:{contract['candidateId']}:{rendered.size}")
            rendered.save(png, format="PNG", optimize=True)
            rendered.crop(crop_box(contract["assetGroup"], *rendered.size)).save(crops / f"{result_path.stem}--component.png", format="PNG", optimize=True)
        shutil.copy2(result_path, results / result_path.name)
    shutil.copy2(source / "sentinel.json", destination / "sentinel.json")


def collect_complete(matrix: dict, contracts: dict[str, dict]) -> tuple[list[dict], list[dict]]:
    entries: list[dict] = []
    runs: list[dict] = []
    qa = {entry["candidateId"]: entry["status"] for entry in json.loads((EVIDENCE / "automatic-qa.json").read_text())["entries"]}
    for group in matrix["groups"]:
        for candidate_id in group["candidateIds"]:
            contract = contracts[candidate_id]
            destination = CAPTURE_ROOT / contract["assetGroup"] / candidate_id
            valid, _ = validate_destination(destination, contract, group)
            if not valid:
                continue
            sentinel_path = destination / "sentinel.json"
            sentinel = json.loads(sentinel_path.read_text())
            runs.append({
                **{key: sentinel[key] for key in ["candidateId", "assetGroup", "captureStarted", "captureCompleted", "expectedCaptureCount", "actualCaptureCount", "cleanupCompleted", "runtimeContractUnchanged", "finalFlowState", "unhandledExceptionCount", "assertionFailureCount"]},
                "screen": group["screen"], "sentinelPath": str(sentinel_path.relative_to(ROOT)), "sentinelSha256": sha(sentinel_path),
            })
            for result_path in sorted((destination / "results").glob("*.json")):
                result = json.loads(result_path.read_text())
                screenshot = destination / "screenshots" / f"{result_path.stem}.png"
                crop = destination / "component-crops" / f"{result_path.stem}--component.png"
                entries.append({
                    "assetGroup": contract["assetGroup"], "candidateId": candidate_id, "viewport": result["viewport"],
                    "width": result["width"], "height": result["height"], "captureKind": result["captureKind"],
                    "evidenceType": "candidate-specific-live-runtime", "liveRuntime": True, "layoutFixture": False,
                    "runtimeRoute": result["runtimeRoute"], "uiState": result["uiState"], "requiredStates": result["requiredStates"],
                    "screenshotPath": str(screenshot.relative_to(ROOT)), "screenshotSha256": sha(screenshot),
                    "componentCropPath": str(crop.relative_to(ROOT)), "componentCropSha256": sha(crop),
                    "runtimeResultPath": str(result_path.relative_to(ROOT)), "runtimeResultSha256": sha(result_path),
                    "sourceAssetPath": contract["outputPath"], "sourceAssetSha256": sha(ROOT / contract["outputPath"]),
                    "rawPreviewPath": str((destination / "raw-preview.png").relative_to(ROOT)), "rawPreviewSha256": sha(destination / "raw-preview.png"),
                    "lineageStatus": contract["lineageStatus"], "automaticQaStatus": qa[candidate_id], "liveQaStatus": "PASS",
                    "uiContractUnchanged": result["uiContractUnchanged"], "textSafeAreaPassed": result["textSafeAreaPassed"],
                    "nineSlicePassed": result["nineSlicePassed"], "tapTargetPassed": result["tapTargetPassed"], "safeAreaPassed": result["safeAreaPassed"],
                    "liveRender": result["liveRender"], "standardFileResizeReuse": result["standardFileResizeReuse"],
                    "previewCleanupPassed": sentinel["cleanupCompleted"], "unhandledExceptionCount": sentinel["unhandledExceptionCount"],
                    "assertionFailureCount": sentinel["assertionFailureCount"], "stale": False,
                })
    return entries, runs


def write_progress(matrix: dict, contracts: dict[str, dict], quarantined: list[dict]) -> tuple[list[dict], list[dict]]:
    entries, runs = collect_complete(matrix, contracts)
    payload = {
        "schemaVersion": 1, "batch": "C", "generatedAtUtc": utc_now(),
        "completedCandidateCount": len(runs), "captureCount": len(entries),
        "screenCandidateCounts": {screen: sum(run["screen"] == screen for run in runs) for screen in ["hud", "levelUp", "replacement", "result", "stageSelect"]},
        "quarantineCount": len(quarantined), "quarantined": quarantined,
    }
    PROGRESS_PATH.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")
    QUARANTINE_ROOT.mkdir(parents=True, exist_ok=True)
    (QUARANTINE_ROOT / "manifest.json").write_text(json.dumps({"schemaVersion": 1, "entries": quarantined}, ensure_ascii=False, indent=2) + "\n")
    return entries, runs


def write_manifest(matrix: dict, entries: list[dict], runs: list[dict]) -> None:
    screenshot_hashes = [entry["screenshotSha256"] for entry in entries]
    viewport_counts = {viewport: sum(entry["viewport"] == viewport for entry in entries) for viewport in ["compact", "standard", "large"]}
    manifest = {
        "schemaVersion": 1, "sourceHead": run("git", "rev-parse", "HEAD"), "batch": "C", "generatedAtUtc": utc_now(),
        "assetGroupCount": len({entry["assetGroup"] for entry in entries}), "candidateCount": len(runs),
        "minimumViewportCaptureCount": matrix["minimumViewportCaptureCount"], "expectedCaptureCount": matrix["expectedCaptureCount"],
        "actualCaptureCount": len(entries), "completeCandidateCount": len(runs), "viewportCounts": viewport_counts,
        "requiredStateEvidenceCount": sum(entry["viewport"] == "standard" for entry in entries),
        "duplicateScreenshotHashCount": len(screenshot_hashes) - len(set(screenshot_hashes)),
        "duplicateEntryCount": len(entries) - len({(entry["candidateId"], entry["viewport"], entry["uiState"]) for entry in entries}),
        "staleCount": sum(entry["stale"] for entry in entries), "standardFileResizeReuseCount": sum(entry["standardFileResizeReuse"] for entry in entries),
        "uiContractChangedCount": sum(not entry["uiContractUnchanged"] for entry in entries),
        "textSafeAreaFailureCount": sum(not entry["textSafeAreaPassed"] for entry in entries), "nineSliceFailureCount": sum(not entry["nineSlicePassed"] for entry in entries),
        "tapTargetFailureCount": sum(not entry["tapTargetPassed"] for entry in entries), "safeAreaFailureCount": sum(not entry["safeAreaPassed"] for entry in entries),
        "cleanupFailureCount": sum(not run_entry["cleanupCompleted"] for run_entry in runs),
        "unhandledExceptionCount": sum(run_entry["unhandledExceptionCount"] for run_entry in runs), "assertionFailureCount": sum(run_entry["assertionFailureCount"] for run_entry in runs),
        "productionProviderChanged": False, "previewBuildOnly": True, "candidateRuns": runs, "entries": entries,
    }
    MANIFEST_PATH.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")


def main() -> None:
    args = parse_args()
    if not APP.is_dir():
        raise RuntimeError(f"Simulator app is missing: {APP}")
    plan, matrix, contracts_by_id = load_plan(args)
    device = simulator()
    run("xcrun", "simctl", "install", device, str(APP))
    container = Path(run("xcrun", "simctl", "get_app_container", device, BUNDLE_ID, "data"))
    CAPTURE_ROOT.mkdir(parents=True, exist_ok=True)
    quarantine_manifest = QUARANTINE_ROOT / "manifest.json"
    quarantined: list[dict] = json.loads(quarantine_manifest.read_text()).get("entries", []) if quarantine_manifest.is_file() else []
    for group in matrix["groups"]:
        for candidate_id in group["candidateIds"]:
            destination = CAPTURE_ROOT / group["assetGroup"] / candidate_id
            if not destination.exists():
                continue
            valid, reason = validate_destination(destination, contracts_by_id[candidate_id], group)
            if not valid:
                quarantine(destination, reason, quarantined)
    last_failure = None
    consecutive_same_failure = 0
    pilot_results = []

    for index, item in enumerate(plan, 1):
        contract, group = item["contract"], item["matrix"]
        destination = CAPTURE_ROOT / contract["assetGroup"] / contract["candidateId"]
        valid, reason = validate_destination(destination, contract, group)
        if args.resume and valid:
            print(f"[{index:03d}/{len(plan):03d}] {contract['candidateId']}: RESUME complete", flush=True)
            if args.pilot:
                sentinel = json.loads((destination / "sentinel.json").read_text())
                pilot_results.append({
                    "screen": group["screen"], "candidateId": contract["candidateId"], "passed": True, "resumed": True,
                    "expectedCaptureCount": sentinel["expectedCaptureCount"], "actualCaptureCount": sentinel["actualCaptureCount"],
                    "cleanupCompleted": sentinel["cleanupCompleted"], "runtimeContractUnchanged": sentinel["runtimeContractUnchanged"],
                    "unhandledExceptionCount": sentinel["unhandledExceptionCount"], "assertionFailureCount": sentinel["assertionFailureCount"],
                })
            continue
        if destination.exists():
            quarantine(destination, reason, quarantined)
        success = False
        for attempt in range(1, args.max_retries + 1):
            try:
                result = capture_candidate(device, container, contract, group, args.timeout)
                import_candidate(result["source"], destination, contract, group)
                valid, reason = validate_destination(destination, contract, group)
                if not valid:
                    raise RuntimeError(f"import-validation:{contract['candidateId']}:{reason}")
                success = True
                last_failure = None
                consecutive_same_failure = 0
                break
            except Exception as error:
                failure = str(error).split(":", 1)[0]
                consecutive_same_failure = consecutive_same_failure + 1 if failure == last_failure else 1
                last_failure = failure
                if destination.exists():
                    quarantine(destination, failure, quarantined)
                if consecutive_same_failure >= 2:
                    raise RuntimeError(f"Stopped after two consecutive failures with cause {failure}") from error
                if attempt == args.max_retries:
                    raise
        if not success:
            raise RuntimeError(f"Capture did not complete: {contract['candidateId']}")
        sentinel = json.loads((destination / "sentinel.json").read_text())
        print(f"[{index:03d}/{len(plan):03d}] {contract['candidateId']}: {sentinel['actualCaptureCount']} live captures PASS", flush=True)
        if args.pilot:
            pilot_results.append({
                "screen": group["screen"], "candidateId": contract["candidateId"], "passed": True, "resumed": False,
                "expectedCaptureCount": sentinel["expectedCaptureCount"], "actualCaptureCount": sentinel["actualCaptureCount"],
                "cleanupCompleted": sentinel["cleanupCompleted"], "runtimeContractUnchanged": sentinel["runtimeContractUnchanged"],
                "unhandledExceptionCount": sentinel["unhandledExceptionCount"], "assertionFailureCount": sentinel["assertionFailureCount"],
            })

    run("xcrun", "simctl", "terminate", device, BUNDLE_ID, check=False)
    entries, runs = write_progress(matrix, contracts_by_id, quarantined)
    if args.pilot:
        PILOT_PATH.write_text(json.dumps({
            "schemaVersion": 1, "batch": "C", "status": "PASS" if len(pilot_results) == 5 and all(item["passed"] for item in pilot_results) else "BLOCKED",
            "pilotCount": len(pilot_results), "results": pilot_results,
            "unhandledExceptionCount": sum(item.get("unhandledExceptionCount", 0) for item in pilot_results),
            "assertionFailureCount": sum(item.get("assertionFailureCount", 0) for item in pilot_results),
        }, ensure_ascii=False, indent=2) + "\n")
    if len(runs) == matrix["candidateCount"]:
        write_manifest(matrix, entries, runs)
        print(f"U48 Batch C capture manifest: candidates={len(runs)}, captures={len(entries)}")
    else:
        print(f"U48 Batch C capture progress: candidates={len(runs)}/{matrix['candidateCount']}, captures={len(entries)}/{matrix['expectedCaptureCount']}")


if __name__ == "__main__":
    main()
