#!/usr/bin/env python3
"""Capture the 46 approved U48 production visual groups on one iOS Simulator build."""

from __future__ import annotations

import hashlib
import json
import shutil
import subprocess
import time
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[2]
APPROVED = ROOT / "docs/design-targets/generated/unity-u48/approved-production-set.json"
EVIDENCE = ROOT / "docs/design-targets/generated/unity-u48/production-verification"
CAPTURES = EVIDENCE / "live-captures"
MANIFEST = EVIDENCE / "manifest.json"
MATRIX = EVIDENCE / "capture-matrix.json"
APP = ROOT / "unity/VampPonUnity/Builds/U48ProductionDerivedData/Build/Products/Release-iphonesimulator/VampPonUnitySpike.app"
BUNDLE_ID = "com.mshogo.vamppon.u1"
REQUEST = "Documents/u48-production-capture-request.txt"


def run(*args: str, check: bool = True) -> str:
    return subprocess.run(args, check=check, text=True, capture_output=True).stdout.strip()


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def booted_simulator() -> str:
    payload = json.loads(run("xcrun", "simctl", "list", "devices", "booted", "-j"))
    devices = [item for values in payload["devices"].values() for item in values if item.get("state") == "Booted"]
    if len(devices) != 1:
        raise RuntimeError(f"Expected exactly one booted Simulator, found {len(devices)}")
    return devices[0]["udid"]


def main() -> None:
    if not APP.is_dir():
        raise RuntimeError(f"Production Simulator app is missing: {APP}")
    approved = json.loads(APPROVED.read_text())
    groups = approved["entries"]
    if len(groups) != 46 or len({item["assetGroup"] for item in groups}) != 46:
        raise RuntimeError("Approved production set must contain 46 unique groups.")

    device = booted_simulator()
    run("xcrun", "simctl", "install", device, str(APP))
    container = Path(run("xcrun", "simctl", "get_app_container", device, BUNDLE_ID, "data"))
    simulator_root = container / "Documents/u48-production-visual-captures"
    request_path = container / REQUEST
    if CAPTURES.exists():
        shutil.rmtree(CAPTURES)
    CAPTURES.mkdir(parents=True)
    entries: list[dict[str, object]] = []
    group_runs: list[dict[str, object]] = []

    for index, approved_entry in enumerate(groups, 1):
        group = approved_entry["assetGroup"]
        simulator_group = simulator_root / group
        if simulator_group.exists():
            shutil.rmtree(simulator_group)
        run("xcrun", "simctl", "terminate", device, BUNDLE_ID, check=False)
        request_path.write_text(group + "\n")
        run("xcrun", "simctl", "launch", device, BUNDLE_ID)
        summary_path = simulator_group / "summary.json"
        failure_path = simulator_group / "failure.txt"
        deadline = time.monotonic() + 45
        while not summary_path.exists() and time.monotonic() < deadline:
            if failure_path.exists():
                time.sleep(1)
                if failure_path.exists():
                    raise RuntimeError(f"Production capture failed: {group}\n{failure_path.read_text()}")
            time.sleep(.25)
        if not summary_path.exists():
            progress = (simulator_group / "progress.txt").read_text() if (simulator_group / "progress.txt").exists() else "missing"
            raise RuntimeError(f"Production capture timeout: {group}; progress={progress}")
        summary = json.loads(summary_path.read_text())
        if not summary.get("passed"):
            raise RuntimeError(f"Production capture summary failed: {group}: {summary}")

        destination = CAPTURES / group
        screenshots = destination / "screenshots"
        results = destination / "results"
        screenshots.mkdir(parents=True)
        results.mkdir(parents=True)
        group_entries = []
        for result_path in sorted((simulator_group / "results").glob("*.json")):
            result = json.loads(result_path.read_text())
            source_ppm = simulator_group / "screenshots" / f"{result_path.stem}.ppm"
            screenshot_path = screenshots / f"{result_path.stem}.png"
            with Image.open(source_ppm) as image:
                image.convert("RGB").save(screenshot_path, format="PNG", optimize=True)
            copied_result = results / result_path.name
            shutil.copy2(result_path, copied_result)
            record = {
                "assetGroup": group,
                "candidateId": approved_entry["candidateId"],
                "viewport": result["viewport"],
                "width": result["width"],
                "height": result["height"],
                "captureKind": result["captureKind"],
                "runtimeState": result["runtimeState"],
                "requiredStates": result["requiredStates"],
                "screenshotPath": str(screenshot_path.relative_to(ROOT)),
                "screenshotSha256": sha256(screenshot_path),
                "runtimeResultPath": str(copied_result.relative_to(ROOT)),
                "runtimeResultSha256": sha256(copied_result),
                "candidateSourcePath": approved_entry["candidateSourcePath"],
                "candidateSourceSha256": approved_entry["candidateSourceSha256"],
                "productionPath": approved_entry["productionPath"],
                "productionSha256": result["productionSha256"],
                "runtimeProviderKey": result["runtimeProviderKey"],
                "sourceIdentityPassed": result["sourceIdentityPassed"],
                "importContractPassed": result["importContractPassed"],
                "gameplayContractUnchanged": result["gameplayContractUnchanged"],
                "uiContractUnchanged": result["uiContractUnchanged"],
                "liveRender": result["liveRender"],
                "previewDependencyUsed": result["previewDependencyUsed"],
                "resizeReuse": result["resizeReuse"],
                "cleanupPassed": result["cleanupPassed"],
                "exceptionCount": result["exceptionCount"],
                "assertionFailureCount": result["assertionFailureCount"],
                "stale": result["stale"],
            }
            entries.append(record)
            group_entries.append(record)
        if len(group_entries) != 3:
            raise RuntimeError(f"Expected three viewport captures for {group}, found {len(group_entries)}")
        copied_summary = destination / "summary.json"
        shutil.copy2(summary_path, copied_summary)
        group_runs.append({
            "assetGroup": group,
            "candidateId": approved_entry["candidateId"],
            "summaryPath": str(copied_summary.relative_to(ROOT)),
            "summarySha256": sha256(copied_summary),
            "requiredStates": group_entries[0]["requiredStates"],
            "completedCaptureCount": summary["completedCaptureCount"],
            "requiredStateCount": summary["requiredStateCount"],
            "productionProvider": summary["productionProvider"],
            "previewDependencyUsed": summary["previewDependencyUsed"],
            "cleanupPassed": summary["cleanupPassed"],
            "exceptionCount": summary["exceptionCount"],
            "assertionFailureCount": summary["assertionFailureCount"],
            "passed": summary["passed"],
        })
        print(f"[{index:02d}/46] {group}: 3 production live captures PASS", flush=True)

    run("xcrun", "simctl", "terminate", device, BUNDLE_ID, check=False)
    now = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    counts = {name: sum(item["viewport"] == name for item in entries) for name in ("compact", "standard", "large")}
    manifest = {
        "schemaVersion": 1,
        "sourceHead": run("git", "rev-parse", "HEAD"),
        "generatedAtUtc": now,
        "verificationBuild": "production-catalog-with-smoke-capture-bridge",
        "previewDefineEnabled": False,
        "assetGroupCount": len(group_runs),
        "gameplayGroupCount": approved["gameplayGroupCount"],
        "uiGroupCount": approved["uiGroupCount"],
        "entryCount": len(entries),
        "expectedEntryCount": 138,
        "viewportCounts": counts,
        "duplicateScreenshotHashCount": len(entries) - len({item["screenshotSha256"] for item in entries}),
        "previewDependencyUsedCount": sum(bool(item["previewDependencyUsed"]) for item in entries),
        "resizeReuseCount": sum(bool(item["resizeReuse"]) for item in entries),
        "exceptionCount": sum(int(item["exceptionCount"]) for item in group_runs),
        "assertionFailureCount": sum(int(item["assertionFailureCount"]) for item in group_runs),
        "cleanupFailureCount": sum(not bool(item["cleanupPassed"]) for item in group_runs),
        "staleCount": sum(bool(item["stale"]) for item in entries),
        "privateDeviceIdentifierRecorded": False,
        "entries": entries,
        "groupRuns": group_runs,
    }
    EVIDENCE.mkdir(parents=True, exist_ok=True)
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
    MATRIX.write_text(json.dumps({
        "schemaVersion": 1,
        "generatedAtUtc": now,
        "assetGroupCount": len(group_runs),
        "viewportCounts": counts,
        "expectedViewportCounts": {"compact": 46, "standard": 46, "large": 46},
        "totalCaptureCount": len(entries),
        "expectedTotalCaptureCount": 138,
        "groups": group_runs,
    }, ensure_ascii=False, indent=2) + "\n")
    print(f"U48 production manifest: groups={len(group_runs)}, captures={len(entries)}, viewports={counts}")


if __name__ == "__main__":
    main()
