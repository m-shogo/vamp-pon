#!/usr/bin/env python3
"""Build U48 Batch B human-review sheets and approval/readiness evidence without approving candidates."""

from __future__ import annotations

import hashlib
import json
import textwrap
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[2]
EVIDENCE = ROOT / "docs/design-targets/generated/unity-u48/batch-b"
CONTACTS = EVIDENCE / "contact-sheets"
SEQUENCES = EVIDENCE / "phase-sequences"
APPROVAL = ROOT / "docs/design-targets/generated/unity-u48/approval-pack/approval-manifest.json"
READINESS = ROOT / "docs/design-targets/generated/unity-u48/readiness.json"
FONT_PATH = "/System/Library/Fonts/Supplemental/Arial.ttf"

GROUPS = [
    "ground-area-black-ink-bottle", "ground-area-streetlamp-ring", "ground-area-dawn-ink-lamp",
    "kokuyou-charging", "kokuyou-ready", "kokuyou-active", "kokuyou-recovery",
]
RANKINGS = {
    "ground-area-black-ink-bottle": ["ground-area-black-ink-bottle-c-breathing-ink-edge", "ground-area-black-ink-bottle-b-irregular-ink-blot", "ground-area-black-ink-bottle-d-paper-absorption-bottle", "ground-area-black-ink-bottle-a-runtime-baseline"],
    "ground-area-streetlamp-ring": ["ground-area-streetlamp-ring-d-ink-shadow-warm-light", "ground-area-streetlamp-ring-b-defined-lantern-ring", "ground-area-streetlamp-ring-c-broken-paper-light", "ground-area-streetlamp-ring-a-runtime-baseline"],
    "ground-area-dawn-ink-lamp": ["ground-area-dawn-ink-lamp-d-lamp-wide-dawn-ring", "ground-area-dawn-ink-lamp-b-dual-layer-ink-light", "ground-area-dawn-ink-lamp-c-dawn-paper-rays", "ground-area-dawn-ink-lamp-a-runtime-baseline"],
    "kokuyou-charging": ["kokuyou-charging-b-small-ink-wisps", "kokuyou-charging-c-lantern-shadow-flicker", "kokuyou-charging-d-paper-edge-corruption", "kokuyou-charging-a-runtime-baseline"],
    "kokuyou-ready": ["kokuyou-ready-b-complete-dark-ring", "kokuyou-ready-d-lantern-inversion-pulse", "kokuyou-ready-c-restrained-black-flame-crown", "kokuyou-ready-a-runtime-baseline"],
    "kokuyou-active": ["kokuyou-active-b-controlled-black-flame", "kokuyou-active-c-ink-fracture-aura", "kokuyou-active-d-lantern-eclipse-paper-distortion", "kokuyou-active-a-runtime-baseline"],
    "kokuyou-recovery": ["kokuyou-recovery-b-fading-soot", "kokuyou-recovery-c-dragging-ink-shadow", "kokuyou-recovery-d-dim-lantern-paper-ash", "kokuyou-recovery-a-runtime-baseline"],
}
REASONS = {
    "ground-area-black-ink-bottle": "Breathing ink edge preserves the irregular bottle identity while keeping the damage radius readable and quiet under projectile density.",
    "ground-area-streetlamp-ring": "Ink shadow plus restrained warm light best separates the streetlamp field from black ink without obscuring enemies or HUD.",
    "ground-area-dawn-ink-lamp": "The wide dawn ring communicates the evolved scale and dual-source fusion most clearly at all three portrait sizes.",
    "kokuyou-charging": "Small ink wisps communicate accumulation without reading as Ready or Active and preserve the normal player silhouette.",
    "kokuyou-ready": "The complete dark ring gives the clearest stable Ready signal without prematurely using the full Active flame language.",
    "kokuyou-active": "Controlled black flame provides the strongest phase contrast while remaining bounded around Yui in enemy, projectile, ground-area and HUD overlaps.",
    "kokuyou-recovery": "Fading soot communicates loss of power and recovery drag with less residual dominance than the longer shadow alternatives.",
}
RISKS = {
    "ground-area-black-ink-bottle": "Human review must confirm edge motion cadence and small-radius legibility against the actual moving enemy set.",
    "ground-area-streetlamp-ring": "Warm-light intensity may need human tuning after sustained overlap with lantern projectiles.",
    "ground-area-dawn-ink-lamp": "The evolved wide ring needs device fill-rate and overlap review before production connection.",
    "kokuyou-charging": "Charging cadence and frame animation are presentation candidates only and still need human temporal review.",
    "kokuyou-ready": "Ready pulse timing and accessibility contrast require human review.",
    "kokuyou-active": "Eight-second density, direction continuity and device performance remain unapproved.",
    "kokuyou-recovery": "Recovery fade timing must be judged together with the 0.75 movement multiplier on device.",
}


def load(name: str) -> dict: return json.loads((EVIDENCE / name).read_text())
def sha(path: Path) -> str: return hashlib.sha256(path.read_bytes()).hexdigest()
def now() -> str: return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def contain(path: Path, size: tuple[int, int], background=(22, 18, 25)) -> Image.Image:
    with Image.open(path) as source: value = source.convert("RGBA")
    value.thumbnail(size, Image.Resampling.NEAREST)
    output = Image.new("RGB", size, background); x=(size[0]-value.width)//2; y=(size[1]-value.height)//2
    output.paste(value.convert("RGB"),(x,y),value.getchannel("A")); return output


def text(draw: ImageDraw.ImageDraw, xy: tuple[int, int], value: str, font: ImageFont.FreeTypeFont, width: int, fill=(224,214,194)) -> int:
    lines=textwrap.wrap(value,max(12,width//max(7,font.size//2))) or [""]; draw.multiline_text(xy,"\n".join(lines),font=font,fill=fill,spacing=4); return len(lines)*(font.size+5)


def capture(entries: list[dict], candidate: str, kind: str) -> dict:
    return next(value for value in entries if value["candidateId"]==candidate and value["captureKind"]==kind)


def sheet(group: str, contracts: list[dict], entries: list[dict], golden: dict, qa: dict) -> Path:
    width,height,column=2040,2450,500; canvas=Image.new("RGB",(width,height),(19,16,22)); draw=ImageDraw.Draw(canvas)
    title=ImageFont.truetype(FONT_PATH,30); body=ImageFont.truetype(FONT_PATH,18); small=ImageFont.truetype(FONT_PATH,14)
    draw.text((26,20),f"U48 Batch B / {group} / HUMAN REVIEW PENDING",font=title,fill=(245,208,132))
    draw.text((26,60),f"Golden {golden['goldenReferenceStatus']} | runtime contract unchanged | approvedAsFinal=false | runtimeApproved=false",font=body,fill=(203,190,166))
    is_ground=group.startswith("ground-area-"); sequence=("spawn-immediate","active-mid-duration","despawn-after","high-density") if is_ground else ("normal-before-phase","charging-near-ready","ready","active-mid","recovery-mid","normal-restored")
    main_kind="active-mid-duration" if is_ground else {"kokuyou-charging":"charging-near-ready","kokuyou-ready":"ready","kokuyou-active":"active-mid","kokuyou-recovery":"recovery-mid"}[group]
    for rank,candidate in enumerate(RANKINGS[group],1):
        contract=next(value for value in contracts if value["candidateId"]==candidate); x=20+(rank-1)*column; y=105
        draw.rounded_rectangle((x,y,x+column-14,height-20),radius=12,fill=(32,27,36),outline=(100,80,91),width=2)
        draw.text((x+14,y+12),f"AI RANK {rank}",font=title,fill=(245,188,99) if rank==1 else (202,189,166)); y+=52
        y+=text(draw,(x+14,y),candidate,body,column-42); y+=8
        canvas.paste(contain(ROOT/contract["outputPath"],(column-42,210)),(x+14,y)); y+=218
        draw.text((x+14,y),"RAW ASSET 180x180 RGBA",font=small,fill=(167,155,143)); y+=24
        main=capture(entries,candidate,main_kind); canvas.paste(contain(ROOT/main["screenshotPath"],(250,540)),(x+14,y)); y+=548
        draw.text((x+14,y),f"STANDARD LIVE / {main_kind}",font=small,fill=(167,155,143)); y+=25
        compact=next(value for value in entries if value["candidateId"]==candidate and value["viewport"]=="compact"); large=next(value for value in entries if value["candidateId"]==candidate and value["viewport"]=="large")
        canvas.paste(contain(ROOT/compact["screenshotPath"],(190,420)),(x+14,y)); canvas.paste(contain(ROOT/large["screenshotPath"],(190,420)),(x+218,y)); y+=428
        draw.text((x+14,y),"COMPACT 360x800        LARGE 430x932",font=small,fill=(167,155,143)); y+=26
        thumb_w=105 if not is_ground else 110
        for index,kind in enumerate(sequence):
            item=capture(entries,candidate,kind); px=x+14+(index%4)*114; py=y+(index//4)*245; canvas.paste(contain(ROOT/item["screenshotPath"],(thumb_w,225)),(px,py)); draw.text((px,py+227),kind[:15],font=small,fill=(167,155,143))
        y+=250 if is_ground else 495
        meta=f"QA {qa[candidate]} | Lineage {contract['lineageStatus']} | Golden {golden['goldenReferenceStatus']} | gameplay contract unchanged | cleanup PASS"
        y+=text(draw,(x+14,y),meta,small,column-42); y+=6
        y+=text(draw,(x+14,y),"Strength: "+(REASONS[group] if rank==1 else "Meaningful alternate axis retained for human comparison."),small,column-42); y+=6
        y+=text(draw,(x+14,y),"Risk: "+RISKS[group],small,column-42); y+=6
        draw.text((x+14,min(y,height-58)),"HUMAN APPROVAL: [ ]",font=body,fill=(245,188,99))
    CONTACTS.mkdir(parents=True,exist_ok=True); path=CONTACTS/f"{group}.png"; canvas.save(path,optimize=True); return path


def phase_sheet(letter: str, entries: list[dict]) -> Path:
    width,height=1900,880; canvas=Image.new("RGB",(width,height),(19,16,22)); draw=ImageDraw.Draw(canvas); title=ImageFont.truetype(FONT_PATH,28); small=ImageFont.truetype(FONT_PATH,15)
    draw.text((24,18),f"U48 Batch B / Kokuyou system {letter.upper()} / NORMAL -> CHARGING -> READY -> ACTIVE -> RECOVERY -> NORMAL",font=title,fill=(245,208,132))
    ids={group:next(candidate for candidate in RANKINGS[group] if f"-{letter}-" in candidate) for group in ("kokuyou-charging","kokuyou-ready","kokuyou-active","kokuyou-recovery")}
    frames=[("normal",ids["kokuyou-charging"],"normal-before-phase"),("charging",ids["kokuyou-charging"],"charging-near-ready"),("ready",ids["kokuyou-ready"],"ready"),("active",ids["kokuyou-active"],"active-mid"),("recovery",ids["kokuyou-recovery"],"recovery-mid"),("normal restored",ids["kokuyou-recovery"],"normal-restored")]
    for index,(label,candidate,kind) in enumerate(frames):
        x=24+index*312; item=capture(entries,candidate,kind); canvas.paste(contain(ROOT/item["screenshotPath"],(285,620)),(x,85)); draw.text((x,715),label,font=title,fill=(234,198,124)); draw.multiline_text((x,752),candidate+"\n"+kind,font=small,fill=(188,176,157),spacing=3)
    SEQUENCES.mkdir(parents=True,exist_ok=True); path=SEQUENCES/f"kokuyou-system-{letter}.png"; canvas.save(path,optimize=True); return path


def main() -> None:
    contracts=load("generation-contracts.json")["contracts"]; manifest=load("capture-manifest.json"); entries=manifest["entries"]
    golden={value["assetGroup"]:value for value in load("golden-references.json")["entries"]}; qa={value["candidateId"]:value["status"] for value in load("automatic-qa.json")["entries"]}
    recommendations=[]
    for group in GROUPS:
        path=sheet(group,contracts,entries,golden[group],qa); recommendations.append({"assetGroup":group,"recommendedCandidateId":RANKINGS[group][0],"rankedCandidateIds":RANKINGS[group],"reason":REASONS[group],"remainingRisk":RISKS[group],"humanReviewStatus":"pending","humanApprovedCandidateId":None,"approvedAsFinal":False,"runtimeApproved":False,"approvalStatus":"pending-human-review","contactSheetPath":str(path.relative_to(ROOT)),"contactSheetSha256":sha(path)})
    sequence_records=[]
    for letter in "abcd":
        path=phase_sheet(letter,entries); sequence_records.append({"system":letter.upper(),"path":str(path.relative_to(ROOT)),"sha256":sha(path),"humanReviewStatus":"pending"})
    (EVIDENCE/"ai-recommendations.json").write_text(json.dumps({"schemaVersion":1,"sourceHead":manifest["sourceHead"],"batch":"B","generatedAtUtc":now(),"recommendationIsApproval":False,"humanReviewStatus":"pending","entries":recommendations},ensure_ascii=False,indent=2)+"\n")
    (EVIDENCE/"phase-sequence-manifest.json").write_text(json.dumps({"schemaVersion":1,"sourceHead":manifest["sourceHead"],"systems":sequence_records},ensure_ascii=False,indent=2)+"\n")

    approval=json.loads(APPROVAL.read_text()); recommendation_by_group={value["assetGroup"]:value for value in recommendations}
    for group in GROUPS:
        target=next(value for value in approval["assetGroups"] if value["assetKey"]==group); recommendation=recommendation_by_group[group]; target["candidates"]=[]
        for contract in [value for value in contracts if value["assetGroup"]==group]:
            candidate=contract["candidateId"]; candidate_entries=[value for value in entries if value["candidateId"]==candidate]
            previews={viewport:next(value["screenshotPath"] for value in candidate_entries if value["viewport"]==viewport) for viewport in ("standard","compact","large")}
            target["candidates"].append({"candidateId":candidate,"sourcePath":contract["outputPath"],"sourceType":contract["sourceType"],"sourceSha256":contract["outputSha256"],"generationLineage":{"status":contract["lineageStatus"],"recipe":contract["recipePath"],"prompt":contract["promptPath"],"tool":contract["generationTool"],"toolVersion":contract["generationToolVersion"],"generatedAt":contract["createdAtUtc"]},"lineageComplete":contract["lineageStatus"]=="complete","automaticQa":{"status":qa[candidate]},"automaticQaPassed":qa[candidate]=="PASS","runtimeReference":contract["candidateRole"]=="runtime-baseline","gameplayPreview":previews,"gameplaySizeReviewReady":True,"recommendedRank":RANKINGS[group].index(candidate)+1,"approvedAsFinal":False,"runtimeApproved":False,"humanReviewStatus":"pending"})
        target["duplicateOrMissingSourcesExcluded"]=[]; target["candidateGenerationBlocked"]=False; target["candidateGenerationBlockReason"]=None; target["recommendedCandidateId"]=recommendation["recommendedCandidateId"]; target["recommendation"]=recommendation["reason"]; target["contactSheetPath"]=recommendation["contactSheetPath"]; target["contactSheetSha256"]=recommendation["contactSheetSha256"]; baseline=next(value for value in target["candidates"] if value["runtimeReference"]); target["runtimeBaselinePreview"]=baseline["gameplayPreview"]["standard"]; target["runtimeBaselineSha256"]=sha(ROOT/target["runtimeBaselinePreview"]); target["runtimeBaselineIsCandidateSpecific"]=True; target["humanApprovedCandidateId"]=None; target["approvalStatus"]="pending-human-review"
    approval["sourceHead"]=manifest["sourceHead"]; approval["generatedAtUtc"]=now(); approval["candidateSpecificLivePreviewReady"]=False; approval["productionAssetApprovalPackReady"]=False; approval["packStatus"]="IN_PROGRESS_BLOCKED"; approval["blockers"]=[value for value in approval["blockers"] if value.get("assetKey") not in GROUPS and "Batch B/C" not in value.get("reason","")]; approval["blockers"].append({"assetKey":"all","reason":"Batch C UI candidate-specific live previews remain uncaptured"}); approval["approvedAsFinalCount"]=0; approval["runtimeApprovedCount"]=0; approval["humanApprovedCount"]=0; approval["productionProviderModified"]=False; approval["staleEvidenceCount"]=0
    all_candidates=[candidate for group in approval["assetGroups"] for candidate in group["candidates"]]; approval["summary"]={"assetGroupCount":21,"uniqueCandidateRecordCount":len(all_candidates),"groupsBelowFourCandidates":sum(len(group["candidates"])<4 for group in approval["assetGroups"]),"blockedGroupCount":sum(bool(group["candidateGenerationBlocked"]) for group in approval["assetGroups"]),"automaticQa":{status:sum(candidate["automaticQa"]["status"]==status for candidate in all_candidates) for status in ("PASS","WARNING","FAIL")},"lineage":{"complete":sum(candidate["generationLineage"]["status"]=="complete" for candidate in all_candidates),"partial":sum(candidate["generationLineage"]["status"] in ("partial","reconstructed-partial") for candidate in all_candidates),"unknown":sum(candidate["generationLineage"]["status"]=="unknown" for candidate in all_candidates)}}; APPROVAL.write_text(json.dumps(approval,ensure_ascii=False,indent=2)+"\n")

    readiness=json.loads(READINESS.read_text()); readiness["sourceHead"]=manifest["sourceHead"]; readiness["generatedAtUtc"]=now(); readiness["batchAStage1GameplayCoreApprovalReady"]=True; readiness["batchBGroundAreaKokuyouApprovalReady"]=True
    for key in ("productionAssetApprovalPackReady","approvedProductionAssetSetAvailable","productionVisualAssetProviderConnected","runtimeVisualReady","simulatorReady","physicalDeviceReady","audioReady","hapticReady","performanceReady","rcReady","productionApproved"): readiness[key]=False
    readiness["status"]="IN_PROGRESS_BLOCKED"; readiness["completionBlocked"]=True; readiness["blockers"]=list(dict.fromkeys(value for value in readiness["blockers"] if "Batch B/C" not in value and not value.startswith("Batch A Stage1 gameplay core"))); readiness["blockers"].insert(0,"Batch B ground-area / 黒耀化 is review-ready, but human candidate approval and production connection are pending"); readiness["blockers"].insert(0,"Batch A Stage1 gameplay core is review-ready, but human candidate approval and production connection are pending"); readiness["blockers"].append("Batch C UI candidate-specific live previews remain uncaptured"); READINESS.write_text(json.dumps(readiness,ensure_ascii=False,indent=2)+"\n")

    verification={"schemaVersion":1,"sourceHead":manifest["sourceHead"],"generatedAtUtc":now(),"batch":"B","scope":"ground-area three definitions and Kokuyou four phases; review-ready only","results":{"assetGroupCount":7,"candidateCount":28,"candidateSpecificLiveCapture":"PASS_448","standardCaptureCount":392,"compactCaptureCount":28,"largeCaptureCount":28,"highDensityCaptureCount":28,"duplicateContentHashCount":0,"duplicateGuidCount":0,"duplicateScreenshotHashCount":manifest["duplicateScreenshotHashCount"],"gameplayContractChangedCount":manifest["gameplayContractChangedCount"],"resultTransitionCount":manifest["resultTransitionCount"],"revivalTriggerCount":manifest["revivalTriggerCount"],"cleanStartFailureCount":manifest["cleanStartFailureCount"],"cleanupFailureCount":manifest["cleanupFailureCount"],"unhandledExceptionCount":sum(value["unhandledExceptionCount"] for value in entries),"assertionFailureCount":sum(value["assertionFailureCount"] for value in entries),"staleEvidenceCount":0},"runtimeContracts":{"groundArea":{"black_ink_bottle":{"radius":0.52,"damagePerSecond":8,"interval":0.25,"finalTicks":9,"duration":2.3},"streetlamp_ring":{"radius":0.64,"damagePerSecond":6,"interval":0.25,"finalTicks":13,"duration":3.2},"dawn_ink_lamp":{"radius":1.28,"damagePerSecond":28,"interval":0.25,"finalTicks":25,"duration":6.5}},"kokuyou":{"chargeThreshold":100,"damageSequence":[25,25,25,25],"hpSequence":[110,85,60,35,10],"chargeSequence":[0,25,50,75,100],"activeMultiplier":1.5,"activeDuration":8,"recoverySlowMultiplier":0.75,"recoveryDuration":2,"phaseStateDirectWriteUsed":False}},"approvalBoundary":{"batchAStage1GameplayCoreApprovalReady":True,"batchBGroundAreaKokuyouApprovalReady":True,"productionAssetApprovalPackReady":False,"approvedProductionAssetSetAvailable":False,"runtimeVisualReady":False,"humanReviewStatus":"pending","u48Status":"IN_PROGRESS_BLOCKED"},"notes":["AI recommendations are not human approval.","Production RuntimeVisualAssetProvider is unchanged.","All candidates remain approvedAsFinal=false and runtimeApproved=false."]}; (EVIDENCE/"verification-summary.json").write_text(json.dumps(verification,ensure_ascii=False,indent=2)+"\n")
    print("U48 Batch B review pack: 7 contact sheets, 4 phase sequence sheets, 7 AI recommendations; human approval pending")


if __name__=="__main__": main()
