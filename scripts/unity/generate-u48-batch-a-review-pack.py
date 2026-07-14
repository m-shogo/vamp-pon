#!/usr/bin/env python3
"""Build U48 Batch A recommendations, approval-pack records, and human review contact sheets."""

from __future__ import annotations

import hashlib
import json
import textwrap
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[2]
EVIDENCE = ROOT / "docs/design-targets/generated/unity-u48/batch-a"
CONTACTS = EVIDENCE / "contact-sheets"
APPROVAL = ROOT / "docs/design-targets/generated/unity-u48/approval-pack/approval-manifest.json"
READINESS = ROOT / "docs/design-targets/generated/unity-u48/readiness.json"
FONT = "/System/Library/Fonts/Supplemental/Arial.ttf"

RANKINGS = {
    "player-yui": ["player-yui-c-lantern-bag", "player-yui-d-paper-ink", "player-yui-b-silhouette", "player-yui-a-runtime-baseline"],
    "enemy-onbu": ["enemy-onbu-c-sprout-mist", "enemy-onbu-d-ink-death", "enemy-onbu-b-silhouette", "enemy-onbu-a-runtime-baseline"],
    "stage1-background": ["stage1-background-c-night-street", "stage1-background-d-balanced", "stage1-background-b-paper-map", "stage1-background-a-procedural-baseline"],
    "exp-pickup": ["exp-pickup-b-paper-fragment", "exp-pickup-d-ink-light-hybrid", "exp-pickup-a-runtime-baseline", "exp-pickup-c-small-crystal"],
    "healing-pickup": ["healing-pickup-d-restorative-bottle", "healing-pickup-b-bandaged-paper-charm", "healing-pickup-a-dawn-drop", "healing-pickup-c-warm-lantern-dew"],
    "common-projectile": ["common-projectile-c-paper-streak", "common-projectile-b-pencil-slash", "common-projectile-d-ink-line", "common-projectile-a-lantern-spark"],
    "hit-effect": ["hit-effect-b-paper-nick", "hit-effect-d-lantern-cross", "hit-effect-a-runtime-baseline", "hit-effect-c-ink-pinprick"],
    "enemy-death-effect": ["enemy-death-effect-d-paper-ink-burst", "enemy-death-effect-b-paper-scatter", "enemy-death-effect-a-runtime-baseline", "enemy-death-effect-c-ink-dissolve"],
    "movement-trail": ["movement-trail-c-paper-flecks", "movement-trail-b-pencil-dust", "movement-trail-d-lantern-motes", "movement-trail-a-runtime-baseline"],
}

REASONS = {
    "player-yui": "Lantern and left-hip bag remain most legible at gameplay size without changing Yui's identity.",
    "enemy-onbu": "The short sprout, face mist, and enemy silhouette separate cleanly from Yui and the night field.",
    "stage1-background": "The restrained night-street field gives the strongest actor and pickup contrast with the least central decoration.",
    "exp-pickup": "The paper fragment reads as a small memory piece and stays distinct from healing and candidate crystals.",
    "healing-pickup": "The restorative bottle communicates manual healing while remaining distinct from EXP and generic heart symbols.",
    "common-projectile": "The paper streak gives clear travel direction and stays quieter than the bright runtime spark at density.",
    "hit-effect": "The small paper nick communicates impact without masking Onbu or competing with the death effect.",
    "enemy-death-effect": "The paper/ink burst is stronger than hit feedback while remaining bounded under density.",
    "movement-trail": "Short paper flecks communicate direction with low glow and minimal player occlusion.",
}

RISKS = {
    "player-yui": "Human frame-by-frame handedness and equipment continuity review remains required.",
    "enemy-onbu": "Human death-transition timing and family-canon review remains required.",
    "stage1-background": "Scroll seam and long-session repetition require human motion review.",
    "exp-pickup": "At minimum scale, the paper glyph may need one-pixel contrast tuning.",
    "healing-pickup": "No approved Golden Reference exists; the reference contract is not human-approved.",
    "common-projectile": "Direction and lifetime must be reviewed during sustained weapon density.",
    "hit-effect": "Lifetime and stacking intensity remain runtime-timing review items.",
    "enemy-death-effect": "Pool lifetime and overlap at burst kills remain human review items.",
    "movement-trail": "Continuous movement cadence and joystick-area distraction remain human review items.",
}

APPROVAL_KEYS = {"exp-pickup": "pickup-exp", "healing-pickup": "pickup-healing"}


def load(name: str) -> dict:
    return json.loads((EVIDENCE / name).read_text())


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def contain(image: Image.Image, size: tuple[int, int], background=(20, 17, 22)) -> Image.Image:
    value = image.convert("RGBA")
    value.thumbnail(size, Image.Resampling.NEAREST)
    output = Image.new("RGB", size, background)
    x, y = (size[0] - value.width) // 2, (size[1] - value.height) // 2
    output.paste(value.convert("RGB"), (x, y), value.getchannel("A") if "A" in value.getbands() else None)
    return output


def wrapped(draw: ImageDraw.ImageDraw, xy: tuple[int, int], text: str, font: ImageFont.FreeTypeFont, width: int, fill=(225, 215, 190)) -> int:
    lines = textwrap.wrap(text, max(12, width // max(6, font.size // 2))) or [""]
    draw.multiline_text(xy, "\n".join(lines), font=font, fill=fill, spacing=4)
    return len(lines) * (font.size + 5)


def contact_sheet(group: str, contracts: list[dict], captures: list[dict], golden: dict, qa: dict) -> Path:
    width, height, card = 1560, 1840, 380
    canvas = Image.new("RGB", (width, height), (22, 18, 24))
    draw = ImageDraw.Draw(canvas)
    title = ImageFont.truetype(FONT, 30); body = ImageFont.truetype(FONT, 17); small = ImageFont.truetype(FONT, 14)
    draw.text((28, 20), f"U48 Batch A / {group} / HUMAN REVIEW PENDING", font=title, fill=(245, 210, 142))
    draw.text((28, 60), f"Golden: {golden['goldenReferenceStatus']} | approvedAsFinal=false | runtimeApproved=false | AI rank is not approval", font=body, fill=(205, 190, 165))
    ranks = RANKINGS[group]
    for column, candidate_id in enumerate(ranks):
        contract = next(value for value in contracts if value["candidateId"] == candidate_id)
        candidate_captures = [value for value in captures if value["candidateId"] == candidate_id]
        x, y = 20 + column * card, 105
        draw.rounded_rectangle((x, y, x + card - 14, height - 20), radius=12, fill=(34, 29, 38), outline=(95, 78, 90), width=2)
        draw.text((x + 14, y + 12), f"AI RANK {column + 1}", font=title, fill=(244, 190, 104) if column == 0 else (205, 190, 165))
        y += 52; y += wrapped(draw, (x + 14, y), candidate_id, body, card - 42); y += 8
        raw = Image.open(ROOT / contract["outputPath"])
        canvas.paste(contain(raw, (card - 42, 215)), (x + 14, y)); y += 225
        draw.text((x + 14, y), "RAW ASSET", font=small, fill=(170, 158, 145)); y += 25
        if group in ("player-yui", "enemy-onbu"):
            frames = Image.new("RGBA", (720, 180), (0, 0, 0, 0))
            for index, source_column in enumerate((0, 2, 3, 7)):
                frames.paste(raw.crop((source_column * 180, 0, (source_column + 1) * 180, 180)), (index * 180, 0))
            canvas.paste(contain(frames, (card - 42, 90)), (x + 14, y)); y += 100
            draw.text((x + 14, y), "REPRESENTATIVE FRAMES", font=small, fill=(170, 158, 145)); y += 25
        standard = next(value for value in candidate_captures if value["viewport"] == "standard" and value["captureKind"] in ("live-battle", "normal-density", "single"))
        standard_image = Image.open(ROOT / standard["screenshotPath"])
        canvas.paste(contain(standard_image, (210, 455)), (x + 14, y));
        gameplay_crop = standard_image.crop((95, 420, 295, 620))
        canvas.paste(contain(gameplay_crop, (125, 125)), (x + 235, y + 45));
        y += 465; draw.text((x + 14, y), "STANDARD LIVE + GAMEPLAY CROP", font=small, fill=(170, 158, 145)); y += 26
        compact = next(value for value in candidate_captures if value["viewport"] == "compact")
        large = next(value for value in candidate_captures if value["viewport"] == "large")
        canvas.paste(contain(Image.open(ROOT / compact["screenshotPath"]), (145, 320)), (x + 14, y))
        canvas.paste(contain(Image.open(ROOT / large["screenshotPath"]), (145, 320)), (x + 175, y))
        y += 328; draw.text((x + 14, y), "COMPACT 360x800     LARGE 430x932", font=small, fill=(170, 158, 145)); y += 28
        dense = next((value for value in candidate_captures if value["captureKind"] == "high-density"), None)
        if dense:
            dense_image = Image.open(ROOT / dense["screenshotPath"])
            canvas.paste(contain(dense_image, (95, 205)), (x + 260, y))
            draw.text((x + 14, y), "HIGH DENSITY", font=small, fill=(170, 158, 145))
            y += 212
        else:
            y += 30
        rank = column + 1
        meta = f"QA {qa[candidate_id]} | lineage {contract['lineageStatus']} | role {contract['candidateRole']} | source {contract['outputSha256'][:12]}..."
        y += wrapped(draw, (x + 14, y), meta, small, card - 42); y += 5
        y += wrapped(draw, (x + 14, y), "Strength: " + (REASONS[group] if rank == 1 else "Meaningful alternate axis retained for human comparison."), small, card - 42); y += 5
        y += wrapped(draw, (x + 14, y), "Risk: " + RISKS[group], small, card - 42); y += 6
        draw.text((x + 14, min(y, height - 58)), "HUMAN APPROVAL: [ ]", font=body, fill=(244, 190, 104))
    CONTACTS.mkdir(parents=True, exist_ok=True)
    path = CONTACTS / f"{group}.png"
    canvas.save(path, optimize=True)
    return path


def main() -> None:
    contracts_data = load("generation-contracts.json"); contracts = contracts_data["contracts"]
    manifest = load("capture-manifest.json"); captures = manifest["entries"]
    golden_entries = {value["assetGroup"]: value for value in load("golden-references.json")["entries"]}
    qa_entries = {value["candidateId"]: value["status"] for value in load("automatic-qa.json")["entries"]}
    recommendations = []
    contact_paths = {}
    for group, ranks in RANKINGS.items():
        group_contracts = [value for value in contracts if value["assetGroup"] == group]
        path = contact_sheet(group, group_contracts, captures, golden_entries[group], qa_entries)
        contact_paths[group] = path
        recommendations.append({
            "assetGroup": group, "recommendedCandidateId": ranks[0], "rankedCandidateIds": ranks,
            "reason": REASONS[group], "remainingRisk": RISKS[group], "humanReviewStatus": "pending",
            "humanApprovedCandidateId": None, "approvedAsFinal": False, "runtimeApproved": False,
            "contactSheetPath": str(path.relative_to(ROOT)), "contactSheetSha256": sha256(path),
        })
    recommendation_path = EVIDENCE / "ai-recommendations.json"
    recommendation_path.write_text(json.dumps({
        "schemaVersion": 1, "sourceHead": manifest["sourceHead"], "batch": "A", "generatedAtUtc": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "recommendationIsApproval": False, "humanReviewStatus": "pending", "entries": recommendations,
    }, ensure_ascii=False, indent=2) + "\n")

    approval = json.loads(APPROVAL.read_text())
    for recommendation in recommendations:
        group = recommendation["assetGroup"]; asset_key = APPROVAL_KEYS.get(group, group)
        target = next(value for value in approval["assetGroups"] if value["assetKey"] == asset_key)
        group_contracts = [value for value in contracts if value["assetGroup"] == group]
        target["candidates"] = []
        for contract in group_contracts:
            candidate_id = contract["candidateId"]
            candidate_captures = [value for value in captures if value["candidateId"] == candidate_id]
            preview = {viewport: next(value["screenshotPath"] for value in candidate_captures if value["viewport"] == viewport) for viewport in ("standard", "compact", "large")}
            target["candidates"].append({
                "candidateId": candidate_id, "sourcePath": contract["outputPath"], "sourceType": contract["sourceType"], "sourceSha256": contract["outputSha256"],
                "generationLineage": {"status": contract["lineageStatus"], "recipe": contract["recipePath"], "prompt": contract["promptPath"], "tool": contract["generationTool"], "toolVersion": contract["generationToolVersion"], "generatedAt": contract["createdAtUtc"]},
                "lineageComplete": contract["lineageStatus"] == "complete", "automaticQa": {"status": qa_entries[candidate_id]}, "automaticQaPassed": qa_entries[candidate_id] == "PASS",
                "runtimeReference": contract["candidateRole"] == "runtime-baseline", "gameplayPreview": preview, "gameplaySizeReviewReady": True,
                "recommendedRank": RANKINGS[group].index(candidate_id) + 1, "approvedAsFinal": False, "runtimeApproved": False, "humanReviewStatus": "pending",
            })
        target["duplicateOrMissingSourcesExcluded"] = []
        target["candidateGenerationBlocked"] = False; target["candidateGenerationBlockReason"] = None
        target["recommendedCandidateId"] = recommendation["recommendedCandidateId"]; target["recommendation"] = recommendation["reason"]
        target["contactSheetPath"] = recommendation["contactSheetPath"]; target["contactSheetSha256"] = recommendation["contactSheetSha256"]
        baseline = next((value for value in target["candidates"] if value["runtimeReference"]), target["candidates"][0])
        target["runtimeBaselinePreview"] = baseline["gameplayPreview"]["standard"]
        target["runtimeBaselineSha256"] = sha256(ROOT / target["runtimeBaselinePreview"])
        target["runtimeBaselineIsCandidateSpecific"] = True; target["humanApprovedCandidateId"] = None; target["approvalStatus"] = "pending-human-review"
    approval["sourceHead"] = manifest["sourceHead"]
    approval["candidateSpecificLivePreviewReady"] = False
    approval["productionAssetApprovalPackReady"] = False; approval["packStatus"] = "IN_PROGRESS_BLOCKED"
    approval["blockers"] = [value for value in approval["blockers"] if value["assetKey"] not in set(APPROVAL_KEYS.get(group, group) for group in RANKINGS)]
    if not any("candidate-specific live previews" in value["reason"] for value in approval["blockers"]):
        approval["blockers"].append({"assetKey": "all", "reason": "Batch B/C candidate-specific live previews are not captured"})
    approval["approvedAsFinalCount"] = 0; approval["runtimeApprovedCount"] = 0; approval["humanApprovedCount"] = 0; approval["productionProviderModified"] = False; approval["staleEvidenceCount"] = 0
    candidate_count = sum(len(value["candidates"]) for value in approval["assetGroups"])
    shortage_count = sum(len(value["candidates"]) < 4 for value in approval["assetGroups"])
    blocked_count = sum(bool(value["candidateGenerationBlocked"]) for value in approval["assetGroups"])
    qa_counts = {status: sum(candidate["automaticQa"]["status"] == status for value in approval["assetGroups"] for candidate in value["candidates"]) for status in ("PASS", "WARNING", "FAIL")}
    lineage_counts = {
        "complete": sum(candidate["generationLineage"]["status"] == "complete" for value in approval["assetGroups"] for candidate in value["candidates"]),
        "partial": sum(candidate["generationLineage"]["status"] in ("partial", "reconstructed-partial") for value in approval["assetGroups"] for candidate in value["candidates"]),
        "unknown": sum(candidate["generationLineage"]["status"] == "unknown" for value in approval["assetGroups"] for candidate in value["candidates"]),
    }
    approval["summary"] = {"assetGroupCount": 21, "uniqueCandidateRecordCount": candidate_count, "groupsBelowFourCandidates": shortage_count, "blockedGroupCount": blocked_count, "automaticQa": qa_counts, "lineage": lineage_counts}
    APPROVAL.write_text(json.dumps(approval, ensure_ascii=False, indent=2) + "\n")

    readiness = json.loads(READINESS.read_text())
    readiness["sourceHead"] = manifest["sourceHead"]
    readiness["batchAStage1GameplayCoreApprovalReady"] = True
    readiness["productionAssetApprovalPackReady"] = False; readiness["approvedProductionAssetSetAvailable"] = False; readiness["runtimeVisualReady"] = False
    readiness["status"] = "IN_PROGRESS_BLOCKED"; readiness["productionApproved"] = False; readiness["completionBlocked"] = True
    readiness["blockers"] = ["Batch B/C candidate-specific live previews remain uncaptured" if value == "candidate-specific live previews for Standard/Compact/Large are not captured" else value for value in readiness["blockers"]]
    readiness["blockers"].insert(0, "Batch A Stage1 gameplay core is review-ready, but human candidate approval and production connection are pending")
    READINESS.write_text(json.dumps(readiness, ensure_ascii=False, indent=2) + "\n")
    print("U48 Batch A review pack: 9 contact sheets, 9 AI recommendations, human approval pending")


if __name__ == "__main__":
    main()
