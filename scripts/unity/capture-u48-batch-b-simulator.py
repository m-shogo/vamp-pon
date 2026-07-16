#!/usr/bin/env python3
"""Capture all U48 Batch B candidates through actual U47 runtime routes on iOS Simulator."""

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
EVIDENCE = ROOT / "docs/design-targets/generated/unity-u48/batch-b"
CAPTURE_ROOT = EVIDENCE / "live-captures"
MANIFEST = EVIDENCE / "capture-manifest.json"
APP = ROOT / "unity/VampPonUnity/Builds/U48BatchBDerivedData/Build/Products/Release-iphonesimulator/VampPonUnitySpike.app"
BUNDLE_ID = "com.mshogo.vamppon.u1"


def run(*args: str, env: dict[str, str] | None = None, check: bool = True) -> str:
    return subprocess.run(args, check=check, text=True, capture_output=True, env=env).stdout.strip()


def sha(path: Path) -> str: return hashlib.sha256(path.read_bytes()).hexdigest()


def simulator() -> str:
    data=json.loads(run("xcrun","simctl","list","devices","booted","-j")); devices=[d for values in data["devices"].values() for d in values if d.get("state")=="Booted"]
    if len(devices)!=1: raise RuntimeError(f"Expected exactly one booted Simulator, found {len(devices)}")
    return devices[0]["udid"]


def main() -> None:
    if not APP.is_dir(): raise RuntimeError(f"Simulator app is missing: {APP}")
    contracts=json.loads((EVIDENCE/"generation-contracts.json").read_text())["contracts"]
    selected=set(filter(None,os.environ.get("U48_BATCH_B_CANDIDATE_IDS","").split(",")))
    if selected: contracts=[c for c in contracts if c["candidateId"] in selected]
    qa={x["candidateId"]:x["status"] for x in json.loads((EVIDENCE/"automatic-qa.json").read_text())["entries"]}
    device=simulator(); run("xcrun","simctl","install",device,str(APP)); container=Path(run("xcrun","simctl","get_app_container",device,BUNDLE_ID,"data")); sim_root=container/"Documents/u48-batch-b-captures"
    if CAPTURE_ROOT.exists() and not selected: shutil.rmtree(CAPTURE_ROOT)
    CAPTURE_ROOT.mkdir(parents=True,exist_ok=True); entries=[]; candidate_runs=[]
    for index,contract in enumerate(contracts,1):
        group=contract["assetGroup"]; candidate=contract["candidateId"]; source_candidate=sim_root/group/candidate
        if source_candidate.exists(): shutil.rmtree(source_candidate)
        env=os.environ.copy(); env.update({"SIMCTL_CHILD_VAMPPON_U48_PREVIEW_ENABLED":"1","SIMCTL_CHILD_VAMPPON_U48_ASSET_GROUP":group,"SIMCTL_CHILD_VAMPPON_U48_CANDIDATE_ID":candidate,"SIMCTL_CHILD_VAMPPON_U48_BATCH_B_CAPTURE":"1"})
        run("xcrun","simctl","terminate",device,BUNDLE_ID,check=False)
        run("xcrun","simctl","launch",device,BUNDLE_ID,env=env)
        summary_path=source_candidate/"summary.json"; deadline=time.monotonic()+90
        while not summary_path.exists() and time.monotonic()<deadline: time.sleep(.25)
        if not summary_path.exists():
            logs=run("xcrun","simctl","spawn",device,"log","show","--last","2m","--style","compact","--predicate",f'process == "VampPonUnitySpike"',check=False)
            raise RuntimeError(f"Capture timeout: {candidate}\n{logs[-5000:]}")
        summary=json.loads(summary_path.read_text())
        if not summary.get("passed"): raise RuntimeError(f"Capture failed: {candidate}: {summary}")
        destination=CAPTURE_ROOT/group/candidate; screenshots=destination/"screenshots"; results=destination/"results"; screenshots.mkdir(parents=True,exist_ok=True); results.mkdir(parents=True,exist_ok=True)
        for result_path in sorted((source_candidate/"results").glob("*.json")):
            result=json.loads(result_path.read_text()); ppm=source_candidate/"screenshots"/f"{result_path.stem}.ppm"; png=screenshots/f"{result_path.stem}.png"
            with Image.open(ppm) as image: image.convert("RGB").save(png,format="PNG",optimize=True)
            copied=results/result_path.name; shutil.copy2(result_path,copied); source=ROOT/contract["outputPath"]
            entries.append({"assetGroup":group,"candidateId":candidate,"viewport":result["viewport"],"width":result["width"],"height":result["height"],"captureKind":result["captureKind"],"runtimeState":result["runtimeState"],"screenshotPath":str(png.relative_to(ROOT)),"screenshotSha256":sha(png),"runtimeResultPath":str(copied.relative_to(ROOT)),"runtimeResultSha256":sha(copied),"sourceAssetPath":contract["outputPath"],"sourceAssetSha256":sha(source),"lineageStatus":contract["lineageStatus"],"automaticQaStatus":qa[candidate],"liveRender":result["liveRender"],"actualU47RuntimeRoute":result["actualU47RuntimeRoute"],"phaseStateDirectWriteUsed":result["phaseStateDirectWriteUsed"],"standardFileResizeReuse":result["standardFileResizeReuse"],"gameplayContractUnchanged":result["gameplayContractUnchanged"],"previewCleanupPassed":summary["previewCleanupPassed"],"unhandledExceptionCount":summary["unhandledExceptionCount"],"assertionFailureCount":summary["assertionFailureCount"],"auxiliaryPreviewOnly":result["auxiliaryPreviewOnly"]})
        clean_source=source_candidate/"clean-start.json"; clean_destination=destination/"clean-start.json"
        if not clean_source.is_file(): raise RuntimeError(f"Clean-start evidence missing: {candidate}")
        shutil.copy2(clean_source,clean_destination); shutil.copy2(summary_path,destination/"summary.json")
        clean=json.loads(clean_source.read_text()); candidate_runs.append({"assetGroup":group,"candidateId":candidate,"cleanStartPath":str(clean_destination.relative_to(ROOT)),"cleanStartSha256":sha(clean_destination),"summaryPath":str((destination/"summary.json").relative_to(ROOT)),"summarySha256":sha(destination/"summary.json"),"processRestarted":clean["processRestarted"],"verificationReinitializeExecuted":clean["verificationReinitializeExecuted"],"startStageCommandExecuted":clean["startStageCommandExecuted"],"fullHpBeforeCharge":clean["currentHpBeforeCharge"]==clean["maxHp"],"productionCapacityRestored":clean["productionCapacityRestored"],"finalAppFlowState":summary["finalAppFlowState"],"finalKokuyouPhase":summary["finalKokuyouPhase"],"resultTransitionCount":summary["resultTransitionCount"],"revivalTriggerCount":summary["revivalTriggerCount"],"cleanupCompleted":summary["cleanupCompleted"],"passed":summary["passed"]})
        print(f"[{index:02d}/{len(contracts):02d}] {candidate}: {summary['completedCaptureCount']} live captures PASS",flush=True)
    run("xcrun","simctl","terminate",device,BUNDLE_ID,check=False)
    if selected: return
    counts={viewport:sum(e["viewport"]==viewport for e in entries) for viewport in ("standard","compact","large")}; screenshot_hashes=[e["screenshotSha256"] for e in entries]
    manifest={"schemaVersion":2,"sourceHead":run("git","rev-parse","HEAD"),"batch":"B","generatedAtUtc":datetime.now(timezone.utc).isoformat().replace("+00:00","Z"),"assetGroupCount":len({e["assetGroup"] for e in entries}),"candidateCount":len({e["candidateId"] for e in entries}),"entryCount":len(entries),"candidateRunCount":len(candidate_runs),"viewportCounts":counts,"highDensityCaptureCount":sum(e["captureKind"] in ("high-density","active-with-projectile-density") for e in entries),"duplicateScreenshotHashCount":len(screenshot_hashes)-len(set(screenshot_hashes)),"standardFileResizeReuseCount":sum(bool(e["standardFileResizeReuse"]) for e in entries),"phaseStateDirectWriteCount":sum(bool(e["phaseStateDirectWriteUsed"]) for e in entries),"actualU47RuntimeRouteCount":sum(bool(e["actualU47RuntimeRoute"]) for e in entries),"gameplayContractChangedCount":sum(not e["gameplayContractUnchanged"] for e in entries),"resultTransitionCount":sum(e["resultTransitionCount"] for e in candidate_runs),"revivalTriggerCount":sum(e["revivalTriggerCount"] for e in candidate_runs),"cleanStartFailureCount":sum(not e["fullHpBeforeCharge"] or not e["productionCapacityRestored"] for e in candidate_runs),"cleanupFailureCount":sum(not e["cleanupCompleted"] for e in candidate_runs),"privateDeviceIdentifierRecorded":False,"previewBuildOnly":True,"productionProviderChanged":False,"candidateRuns":candidate_runs,"entries":entries}
    MANIFEST.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+"\n"); print(f"U48 Batch B capture manifest: {len(entries)} live renders, standard={counts['standard']}, compact={counts['compact']}, large={counts['large']}")


if __name__=="__main__": main()
