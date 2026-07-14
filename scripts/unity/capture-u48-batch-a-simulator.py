#!/usr/bin/env python3
"""Capture every U48 Batch A candidate through the define-gated iOS Simulator preview route."""

from __future__ import annotations

import hashlib
import json
import os
import shutil
import subprocess
import time
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[2]
EVIDENCE = ROOT / "docs/design-targets/generated/unity-u48/batch-a"
CONTRACTS = EVIDENCE / "generation-contracts.json"
QA = EVIDENCE / "automatic-qa.json"
CAPTURE_ROOT = EVIDENCE / "live-captures"
MANIFEST = EVIDENCE / "capture-manifest.json"
BUNDLE_ID = "com.mshogo.vamppon.u1"
DEFAULT_APP = ROOT / "unity/VampPonUnity/Builds/U48BatchADerivedData/Build/Products/Release-iphonesimulator/VampPonUnitySpike.app"


def run(*args: str, env: dict[str, str] | None = None) -> str:
    return subprocess.run(args, check=True, text=True, capture_output=True, env=env).stdout.strip()


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def booted_simulator() -> str:
    data = json.loads(run("xcrun", "simctl", "list", "devices", "booted", "-j"))
    devices = [device for values in data["devices"].values() for device in values if device.get("state") == "Booted"]
    if len(devices) != 1:
        raise RuntimeError(f"Expected exactly one booted Simulator, found {len(devices)}")
    return devices[0]["udid"]


def main() -> None:
    app = Path(os.environ.get("U48_BATCH_A_SIMULATOR_APP", DEFAULT_APP))
    if not app.is_dir():
        raise RuntimeError(f"Simulator app is missing: {app}")
    contracts = json.loads(CONTRACTS.read_text())
    candidates = [value for value in contracts["contracts"] if value["outputSha256"] is not None]
    if len(candidates) != 36:
        raise RuntimeError(f"Expected 36 generated candidates, found {len(candidates)}")
    qa = {value["candidateId"]: value["status"] for value in json.loads(QA.read_text())["entries"]}
    device = booted_simulator()
    run("xcrun", "simctl", "install", device, str(app))
    container = Path(run("xcrun", "simctl", "get_app_container", device, BUNDLE_ID, "data"))
    simulator_root = container / "Documents/u48-batch-a-captures"
    if CAPTURE_ROOT.exists():
        shutil.rmtree(CAPTURE_ROOT)
    CAPTURE_ROOT.mkdir(parents=True)
    entries: list[dict[str, object]] = []

    for index, contract in enumerate(candidates, start=1):
        group = contract["assetGroup"]
        candidate_id = contract["candidateId"]
        simulator_candidate = simulator_root / group / candidate_id
        if simulator_candidate.exists():
            shutil.rmtree(simulator_candidate)
        environment = os.environ.copy()
        environment.update({
            "SIMCTL_CHILD_VAMPPON_U48_PREVIEW_ENABLED": "1",
            "SIMCTL_CHILD_VAMPPON_U48_ASSET_GROUP": group,
            "SIMCTL_CHILD_VAMPPON_U48_CANDIDATE_ID": candidate_id,
            "SIMCTL_CHILD_VAMPPON_U48_PREVIEW_VERIFY": "1",
            "SIMCTL_CHILD_VAMPPON_U48_PREVIEW_EXPECT_ACTIVE": "1",
            "SIMCTL_CHILD_VAMPPON_U48_PREVIEW_CAPTURE": "1",
        })
        run("xcrun", "simctl", "launch", "--terminate-running-process", device, BUNDLE_ID, env=environment)
        summary_path = simulator_candidate / "summary.json"
        deadline = time.monotonic() + 30
        while not summary_path.exists() and time.monotonic() < deadline:
            time.sleep(.25)
        if not summary_path.exists():
            raise RuntimeError(f"Capture timeout: {candidate_id}")
        summary = json.loads(summary_path.read_text())
        if not summary.get("passed"):
            raise RuntimeError(f"Capture failed: {candidate_id}: {summary}")

        destination = CAPTURE_ROOT / group / candidate_id
        screenshots = destination / "screenshots"
        results = destination / "results"
        screenshots.mkdir(parents=True)
        results.mkdir(parents=True)
        for result_path in sorted((simulator_candidate / "results").glob("*.json")):
            result = json.loads(result_path.read_text())
            source_ppm = simulator_candidate / "screenshots" / f"{result_path.stem}.ppm"
            screenshot_path = screenshots / f"{result_path.stem}.png"
            with Image.open(source_ppm) as image:
                image.convert("RGB").save(screenshot_path, format="PNG", optimize=True)
            destination_result = results / result_path.name
            shutil.copy2(result_path, destination_result)
            source_path = ROOT / contract["outputPath"]
            entries.append({
                "assetGroup": group,
                "candidateId": candidate_id,
                "viewport": result["viewport"],
                "width": result["width"],
                "height": result["height"],
                "captureKind": result["captureKind"],
                "liveRender": result["liveRender"],
                "standardFileResizeReuse": result["standardFileResizeReuse"],
                "verificationPresentationOnly": result["verificationPresentationOnly"],
                "screenshotPath": str(screenshot_path.relative_to(ROOT)),
                "screenshotSha256": sha256(screenshot_path),
                "runtimeResultPath": str(destination_result.relative_to(ROOT)),
                "sourceAssetPath": contract["outputPath"],
                "sourceAssetSha256": sha256(source_path),
                "lineageStatus": contract["lineageStatus"],
                "automaticQaStatus": qa[candidate_id],
                "previewCleanupPassed": summary["previewCleanupPassed"],
                "unhandledExceptionCount": summary["unhandledExceptionCount"],
                "assertionFailureCount": summary["assertionFailureCount"],
            })
        shutil.copy2(summary_path, destination / "summary.json")
        print(f"[{index:02d}/36] {candidate_id}: {summary['completedCaptureCount']} live captures PASS", flush=True)

    subprocess.run(("xcrun", "simctl", "terminate", device, BUNDLE_ID), check=False, capture_output=True)
    now = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    source_head = run("git", "rev-parse", "HEAD")
    counts = {viewport: sum(value["viewport"] == viewport for value in entries) for viewport in ("standard", "compact", "large")}
    manifest = {
        "schemaVersion": 1,
        "sourceHead": source_head,
        "batch": "A",
        "generatedAtUtc": now,
        "assetGroupCount": len({value["assetGroup"] for value in entries}),
        "candidateCount": len({value["candidateId"] for value in entries}),
        "entryCount": len(entries),
        "viewportCounts": counts,
        "highDensityCaptureCount": sum(value["captureKind"] == "high-density" for value in entries),
        "duplicateScreenshotHashCount": len(entries) - len({value["screenshotSha256"] for value in entries}),
        "standardFileResizeReuseCount": sum(bool(value["standardFileResizeReuse"]) for value in entries),
        "privateDeviceIdentifierRecorded": False,
        "previewBuildOnly": True,
        "productionProviderChanged": False,
        "entries": entries,
    }
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
    print(f"U48 Batch A capture manifest: {len(entries)} live renders, standard={counts['standard']}, compact={counts['compact']}, large={counts['large']}")


if __name__ == "__main__":
    main()
