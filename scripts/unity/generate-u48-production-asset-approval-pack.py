#!/usr/bin/env python3
"""Build the U48 Priority A approval inventory and honest comparison sheets.

This script never edits Unity assets or approval flags. Existing screenshots are
labelled as runtime baselines; they are not candidate-specific live previews.
"""

from __future__ import annotations

import hashlib
import json
import subprocess
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "docs/design-targets/generated/unity-u48/approval-pack"
SHEETS = OUT / "contact-sheets"
READINESS = ROOT / "docs/design-targets/generated/unity-u48/readiness.json"
HUMAN_INDEX = ROOT / "docs/design-targets/generated/unity-u48/human-approval-index.json"
HUMAN_GUIDE = ROOT / "docs/unity-u48-production-asset-human-approval-guide-2026-07-17.md"
FONT = ImageFont.truetype(str(ROOT / "unity/VampPonUnity/Assets/_Project/Resources/ZenMaruGothic-Medium.ttf"), 18)

RUNTIME = "unity/VampPonUnity/Assets/_Project/Resources/RuntimeVisuals/Stage1"
U47 = "docs/design-targets/generated/unity-u47/simulator-smoke/screenshots"


def group(key: str, title: str, candidates: list[str], baseline: str, reason: str, comparison_ready: bool = True) -> dict:
    return {"assetKey": key, "title": title, "sources": candidates, "baseline": baseline, "recommendationReason": reason, "comparisonReady": comparison_ready}


GROUPS = [
    group("player-yui", "Yui player sprite", [
        f"{RUNTIME}/Characters/Yui/yui-runtime-dot-sheet.png",
        "unity/VampPonUnity/Assets/_Project/Resources/U5Candidates/Battle/u5-yui-battle-candidate.png",
        "public/assets/prototypes/sprite-sheets/core5-52px/yui-52px-sprite-sheet-v1.png",
        "public/assets/prototypes/sprite-sheets/core5-original/yui-sprite-sheet-v1.png",
    ], "docs/design-targets/generated/unity-u45-1/screenshots/02-yui-idle.png", "候補別live renderとanimation continuity確認後に選定する"),
    group("enemy-onbu", "Onbu enemy sprite", [
        f"{RUNTIME}/Enemies/Onbu/onbu-runtime-dot-sheet.png",
        "unity/VampPonUnity/Assets/_Project/Resources/U5Candidates/Battle/u5-ombu-battle-candidate.png",
        "public/assets/prototypes/sprite-sheets/enemies-original/enemy-ombu-small-sheet-v2-1440x1080.png",
        "public/assets/prototypes/sprite-sheets/enemies-original/asset-factory-test-pack/enemy-ombu-small-sheet-1440x1080.png",
    ], "docs/design-targets/generated/unity-u45-1/screenshots/07-onbu-move.png", "候補別live renderとdeath continuity確認後に選定する"),
    group("stage1-background", "Stage1 background", [
        "public/assets/prototypes/backgrounds/stage-01/environment-master.png",
        "assets/reference/backgrounds/stage1_night_tile_reference.png",
        "assets/concept-design/01_world/world_night-town_01.png",
    ], f"{U47}/02-initial-night-pencil.png", "runtimeはproceduralのため、tile/overdrawをlive比較してから選定する"),
    group("pickup-exp", "EXP pickup", [f"{RUNTIME}/Common/runtime-exp-fragment.png", "unity/VampPonUnity/Assets/_Project/Resources/U5Candidates/VFX/u5-exp-fragment.png"], f"{U47}/02-initial-night-pencil.png", "unique sourceが不足し候補生成が必要"),
    group("pickup-healing", "Healing pickup", [], f"{U47}/15-revival-30-percent.png", "source assetと正式生成recipeが存在しない"),
    group("common-projectile", "Common projectile", [f"{RUNTIME}/Common/runtime-lantern-spark.png", "unity/VampPonUnity/Assets/_Project/Resources/U5Candidates/VFX/u5-lantern-spark.png"], f"{U47}/02-initial-night-pencil.png", "projectile専用の複数候補と高密度live比較が必要"),
    group("hit-effect", "Hit effect", [f"{RUNTIME}/Common/runtime-lantern-spark.png", "unity/VampPonUnity/Assets/_Project/Resources/U5Candidates/VFX/u5-lantern-spark.png"], "docs/design-targets/generated/unity-u45-1/screenshots/08-onbu-hurt.png", "projectileと共有しないhit専用候補が必要"),
    group("enemy-death-effect", "Enemy death effect", [f"{RUNTIME}/Common/runtime-ink-burst.png", "unity/VampPonUnity/Assets/_Project/Resources/U5Candidates/VFX/u5-ink-burst.png"], "docs/design-targets/generated/unity-u45-1/screenshots/09-onbu-death.png", "death専用候補と高密度live比較が必要"),
    group("movement-trail", "Movement trail", [f"{RUNTIME}/Common/runtime-collect-trail.png", "unity/VampPonUnity/Assets/_Project/Resources/U5Candidates/VFX/u5-collect-trail.png"], f"{U47}/02-initial-night-pencil.png", "unique sourceが不足し候補生成が必要"),
    group("ground-area-black-ink-bottle", "black_ink_bottle ground-area", [f"{RUNTIME}/Common/runtime-ink-burst.png"], f"{U47}/08-black-ink-area.png", "三種共有spriteを脱し、area専用候補が必要"),
    group("ground-area-streetlamp-ring", "streetlamp_ring ground-area", [f"{RUNTIME}/Common/runtime-ink-burst.png"], f"{U47}/09-streetlamp-area.png", "三種共有spriteを脱し、area専用候補が必要"),
    group("ground-area-dawn-ink-lamp", "dawn_ink_lamp ground-area", [f"{RUNTIME}/Common/runtime-ink-burst.png"], f"{U47}/11-dawn-ink-lamp.png", "三種共有spriteを脱し、area専用候補が必要"),
    group("kokuyou-charging", "黒耀化 charging", [
        "unity/VampPonUnity/Assets/_Project/Resources/U8Candidates/FullscreenArt/kokuyou_fullscreen_ink_shadow_source.png",
        "unity/VampPonUnity/Assets/_Project/Resources/U8Refined/FullscreenArt/kokuyou_fullscreen_ink_shadow_source_refined.png",
        "unity/VampPonUnity/Assets/_Project/Resources/U10Candidates/FullscreenArt/kokuyou_fullscreen_final_candidate_a.png",
        "unity/VampPonUnity/Assets/_Project/Resources/U10Candidates/FullscreenArt/kokuyou_fullscreen_final_candidate_b.png",
    ], f"{U47}/16-kokuyou-charging.png", "phase別live previewが未作成のためpending"),
    group("kokuyou-ready", "黒耀化 ready", [
        "unity/VampPonUnity/Assets/_Project/Resources/U8Candidates/FullscreenArt/kokuyou_fullscreen_ink_shadow_source.png",
        "unity/VampPonUnity/Assets/_Project/Resources/U8Refined/FullscreenArt/kokuyou_fullscreen_ink_shadow_source_refined.png",
        "unity/VampPonUnity/Assets/_Project/Resources/U10Candidates/FullscreenArt/kokuyou_fullscreen_final_candidate_a.png",
        "unity/VampPonUnity/Assets/_Project/Resources/U10Candidates/FullscreenArt/kokuyou_fullscreen_final_candidate_b.png",
    ], f"{U47}/17-kokuyou-ready.png", "phase別live previewが未作成のためpending"),
    group("kokuyou-active", "黒耀化 active", [
        "unity/VampPonUnity/Assets/_Project/Resources/U8Candidates/FullscreenArt/kokuyou_fullscreen_ink_shadow_source.png",
        "unity/VampPonUnity/Assets/_Project/Resources/U8Refined/FullscreenArt/kokuyou_fullscreen_ink_shadow_source_refined.png",
        "unity/VampPonUnity/Assets/_Project/Resources/U10Candidates/FullscreenArt/kokuyou_fullscreen_final_candidate_a.png",
        "unity/VampPonUnity/Assets/_Project/Resources/U10Candidates/FullscreenArt/kokuyou_fullscreen_final_candidate_b.png",
    ], f"{U47}/18-kokuyou-active.png", "phase別live previewが未作成のためpending"),
    group("kokuyou-recovery", "黒耀化 recovery", [
        "unity/VampPonUnity/Assets/_Project/Resources/U8Candidates/FullscreenArt/kokuyou_fullscreen_ink_shadow_source.png",
        "unity/VampPonUnity/Assets/_Project/Resources/U8Refined/FullscreenArt/kokuyou_fullscreen_ink_shadow_source_refined.png",
        "unity/VampPonUnity/Assets/_Project/Resources/U10Candidates/FullscreenArt/kokuyou_fullscreen_final_candidate_a.png",
        "unity/VampPonUnity/Assets/_Project/Resources/U10Candidates/FullscreenArt/kokuyou_fullscreen_final_candidate_b.png",
    ], f"{U47}/19-kokuyou-recovery.png", "phase別live previewが未作成のためpending"),
    group("ui-hud-inventory-frame", "HUD / inventory frame", [
        "unity/VampPonUnity/Assets/_Project/Resources/U45Candidates/UI/u45-battle-hud-top-frame.png",
        "public/assets/ui/battle-hud/processed/battle-hud-dual-gauge-frame-runtime.png",
        "unity/VampPonUnity/Assets/_Project/Resources/U45Candidates/UI/u45-battle-inventory-slot-frame.png",
        "public/assets/ui/battle-hud/processed/battle-hud-inventory-paper-slot-runtime.png",
    ], f"{U47}/04-inventory-weapon-passive.png", "component roleが異なるためkit単位の候補化と全viewport live比較が必要", False),
    group("ui-levelup-card", "LevelUp card", [
        "unity/VampPonUnity/Assets/_Project/Resources/U45Candidates/UI/u45-levelup-card-common.png",
        "assets/concept-design/05_ui/ui_card-levelup_01.png",
    ], f"{U47}/03-levelup-actual-choices.png", "common cardの独立候補が不足し全viewport live比較も未実施"),
    group("ui-replacement-modal", "Replacement modal", [], f"{U47}/07-levelup-replacement.png", "専用raw candidateと正式生成recipeが存在しない"),
    group("ui-result-kit", "Result component kit", [
        "unity/VampPonUnity/Assets/_Project/Resources/U46Candidates/UI/Result/u46-result-memory-page.png",
        "unity/VampPonUnity/Assets/_Project/Resources/U8Candidates/UI/result_paper_ledger_panel.png",
        "docs/design-targets/final/result-clear-final.png",
        "unity/VampPonUnity/Assets/_Project/Resources/U10Candidates/UI/result_stats_ink_strip.png",
    ], f"{U47}/20-result-u47-summary.png", "component roleが異なるためkit単位の候補化と全viewport live比較が必要", False),
    group("ui-stage-select-kit", "StageSelect component kit", [
        "unity/VampPonUnity/Assets/_Project/Resources/U45Candidates/UI/u45-stage-select-map-panel.png",
        "unity/VampPonUnity/Assets/_Project/Resources/U8Candidates/UI/stageselect_paper_map_base.png",
        "docs/design-targets/final/stage-select-final.png",
        "unity/VampPonUnity/Assets/_Project/Resources/U10Candidates/UI/stageselect_route_active_node.png",
    ], f"{U47}/01-stage-select.png", "component roleが異なるためkit単位の候補化と全viewport live比較が必要", False),
]


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def meta_guid(path: Path) -> str | None:
    meta = Path(f"{path}.meta")
    if not meta.exists():
        return None
    for line in meta.read_text().splitlines():
        if line.startswith("guid: "):
            return line.split(" ", 1)[1]
    return None


def qa(path: Path) -> dict:
    with Image.open(path) as source:
        image = source.convert("RGBA")
        alpha = image.getchannel("A")
        bbox = alpha.getbbox()
        edge = False
        if bbox:
            w, h = image.size
            edge = bbox[0] == 0 or bbox[1] == 0 or bbox[2] == w or bbox[3] == h
        warnings = []
        if source.format != "PNG":
            warnings.append("not-png")
        if not bbox:
            warnings.append("empty-alpha")
        if edge:
            warnings.append("alpha-edge-contact")
        if meta_guid(path) is None:
            warnings.append("unity-meta-guid-unavailable")
        status = "FAIL" if "empty-alpha" in warnings or "not-png" in warnings else ("WARNING" if warnings else "PASS")
        return {
            "status": status,
            "format": source.format,
            "mode": source.mode,
            "width": image.width,
            "height": image.height,
            "alphaPresent": alpha.getextrema()[0] < 255,
            "nonEmptyBounds": list(bbox) if bbox else None,
            "edgeContact": edge,
            "unityMetaPresent": Path(f"{path}.meta").exists(),
            "guid": meta_guid(path),
            "warnings": warnings,
            "notAutomated": ["PPU/pivot/filter/compression/mipmap when no Unity meta", "animation continuity", "gameplay readability", "fill-rate and sorting", "Safe Area/tap target/contrast"],
        }


def lineage(path: str) -> dict:
    if path.startswith("unity/"):
        return {"status": "partial", "sourceDocument": "unknown", "promptOrRecipe": "unknown", "parentAsset": "unknown", "generatedAt": "unknown", "tool": "unknown"}
    if path.startswith("public/assets/prototypes"):
        return {"status": "partial", "sourceDocument": "repo prototype manifest or adjacent metadata", "promptOrRecipe": "unknown", "parentAsset": "unknown", "generatedAt": "unknown", "tool": "unknown"}
    return {"status": "unknown", "sourceDocument": "unknown", "promptOrRecipe": "unknown", "parentAsset": "unknown", "generatedAt": "unknown", "tool": "unknown"}


def fit(image: Image.Image, width: int, height: int) -> Image.Image:
    copy = image.convert("RGBA")
    copy.thumbnail((width, height), Image.Resampling.NEAREST)
    canvas = Image.new("RGBA", (width, height), (34, 31, 42, 255))
    canvas.alpha_composite(copy, ((width - copy.width) // 2, (height - copy.height) // 2))
    return canvas.convert("RGB")


def wrap_text(value: str, width: int = 44) -> str:
    return "\n".join(value[index:index + width] for index in range(0, len(value), width))


def read_json(path: Path) -> dict:
    return json.loads(path.read_text())


def candidate_letter(candidate_id: str) -> str:
    for letter in "abcd":
        if f"-{letter}-" in candidate_id:
            return letter.upper()
    raise ValueError(f"candidate letter missing: {candidate_id}")


def batch_c_groups() -> list[dict]:
    evidence = ROOT / "docs/design-targets/generated/unity-u48/batch-c"
    contracts = read_json(evidence / "generation-contracts.json")["contracts"]
    manifest = read_json(evidence / "capture-manifest.json")
    qa_entries = read_json(evidence / "automatic-qa.json")["entries"]
    recommendations = read_json(evidence / "ai-recommendations.json")["entries"]
    qa_by_id = {value["candidateId"]: value for value in qa_entries}
    recommendation_by_group = {value["assetGroup"]: value for value in recommendations}
    result = []
    for asset_key in [value["assetGroup"] for value in read_json(evidence / "capture-matrix.json")["groups"]]:
        recommendation = recommendation_by_group[asset_key]
        candidates = []
        for contract in [value for value in contracts if value["assetGroup"] == asset_key]:
            candidate_id = contract["candidateId"]
            capture_entries = [value for value in manifest["entries"] if value["candidateId"] == candidate_id]
            canonical_state = next(value["uiState"] for value in capture_entries if value["viewport"] == "compact" and value["captureKind"] == "canonical-viewport")
            previews = {viewport: next(value["screenshotPath"] for value in capture_entries if value["viewport"] == viewport and value["uiState"] == canonical_state) for viewport in ("standard", "compact", "large")}
            state_previews = {value["uiState"]: value["screenshotPath"] for value in capture_entries if value["viewport"] == "standard"}
            candidates.append({
                "candidateId": candidate_id,
                "sourcePath": contract["outputPath"],
                "sourceType": contract["sourceType"],
                "sourceSha256": contract["outputSha256"],
                "generationLineage": {"status": contract["lineageStatus"], "recipe": contract["recipePath"], "prompt": contract["promptPath"], "tool": contract["generationTool"], "toolVersion": contract["generationToolVersion"], "generatedAt": contract["createdAtUtc"]},
                "lineageComplete": contract["lineageStatus"] == "complete",
                "automaticQa": {"status": qa_by_id[candidate_id]["status"]},
                "automaticQaPassed": qa_by_id[candidate_id]["status"] == "PASS",
                "liveQa": {"status": "PASS", "captureCount": len(capture_entries), "requiredStates": state_previews},
                "runtimeReference": candidate_letter(candidate_id) == "A",
                "gameplayPreview": previews,
                "gameplaySizeReviewReady": True,
                "recommendedRank": recommendation["rankedCandidateIds"].index(candidate_id) + 1,
                "approvedAsFinal": False,
                "runtimeApproved": False,
                "humanReviewStatus": "pending",
            })
        baseline = next(value for value in candidates if value["runtimeReference"])
        result.append({
            "assetKey": asset_key,
            "displayName": asset_key,
            "requiredForStage1": True,
            "candidates": candidates,
            "duplicateOrMissingSourcesExcluded": [],
            "candidateGenerationBlocked": False,
            "candidateGenerationBlockReason": None,
            "recommendedCandidateId": recommendation["recommendedCandidateId"],
            "recommendation": recommendation["reason"],
            "keyRisk": recommendation["remainingRisk"],
            "contactSheetPath": recommendation["contactSheetPath"],
            "contactSheetSha256": recommendation["contactSheetSha256"],
            "runtimeBaselinePreview": baseline["gameplayPreview"]["standard"],
            "runtimeBaselineSha256": sha256(ROOT / baseline["gameplayPreview"]["standard"]),
            "runtimeBaselineIsCandidateSpecific": True,
            "humanApprovedCandidateId": None,
            "approvalStatus": "pending-human-review",
        })
    return result


def write_human_approval_files(asset_groups: list[dict], source_head: str, generated_at: str) -> None:
    groups = []
    for value in asset_groups:
        recommended = value["recommendedCandidateId"]
        options = [{"letter": candidate_letter(candidate["candidateId"]), "candidateId": candidate["candidateId"]} for candidate in value["candidates"]]
        options.sort(key=lambda item: item["letter"])
        groups.append({"assetGroup": value["assetKey"], "candidateOptions": options, "recommendedCandidateId": recommended, "recommendedLetter": candidate_letter(recommended), "contactSheetPath": value["contactSheetPath"], "keyRisk": value.get("keyRisk", "人間による実runtime表示、動き、実機可読性の最終確認が必要。"), "approvedCandidateId": None})
    HUMAN_INDEX.write_text(json.dumps({"schemaVersion": 1, "sourceHead": source_head, "generatedAtUtc": generated_at, "humanReviewStatus": "pending", "recommendationIsApproval": False, "groupCount": len(groups), "groups": groups}, ensure_ascii=False, indent=2) + "\n")
    lines = ["# U48 Production Asset 人間承認ガイド", "", "この一覧は候補選択用です。AI推奨は承認ではなく、production接続も行っていません。", "", "## 返答形式", "", "以下の各行で `asset-group: A〜D` を選択してください。", "", "```text"]
    lines.extend(f"{value['assetGroup']}: {value['recommendedLetter']}" for value in groups)
    lines.extend(["```", "", "## 全候補ID", ""])
    for value in groups:
        lines.append(f"### {value['assetGroup']}")
        lines.append("")
        lines.append(f"AI推奨: {value['recommendedLetter']} (`{value['recommendedCandidateId']}`)")
        lines.append("")
        for option in value["candidateOptions"]:
            lines.append(f"- {option['letter']}: `{option['candidateId']}`")
        lines.extend(["", f"主な残リスク: {value['keyRisk']}", ""])
    HUMAN_GUIDE.write_text("\n".join(lines) + "\n")


def sheet(group_data: dict, candidates: list[dict], output: Path) -> None:
    width, height = 1600, 1000
    canvas = Image.new("RGB", (width, height), (242, 232, 207))
    draw = ImageDraw.Draw(canvas)
    draw.text((36, 24), f"U48 {group_data['title']} Production Approval Pack", fill=(28, 24, 34), font=FONT)
    draw.text((36, 50), "UNAPPROVED CANDIDATES / human review pending", fill=(140, 36, 42), font=FONT)
    card_w = 350
    for index in range(4):
        x = 36 + index * 385
        draw.rounded_rectangle((x, 86, x + card_w, 545), radius=12, fill=(51, 46, 59), outline=(113, 92, 67), width=3)
        if index < len(candidates):
            candidate = candidates[index]
            with Image.open(ROOT / candidate["sourcePath"]) as raw:
                canvas.paste(fit(raw, 310, 330), (x + 20, 115))
            draw.text((x + 20, 96), candidate["candidateId"], fill=(245, 220, 151), font=FONT)
            draw.text((x + 20, 458), f"QA: {candidate['automaticQa']['status']}", fill=(240, 240, 235), font=FONT)
            draw.text((x + 20, 480), f"Lineage: {candidate['generationLineage']['status']}", fill=(240, 240, 235), font=FONT)
            draw.text((x + 20, 502), "[ ] human approve", fill=(240, 240, 235), font=FONT)
        else:
            draw.text((x + 20, 112), f"candidate-{chr(97 + index)}", fill=(245, 220, 151), font=FONT)
            draw.text((x + 20, 150), "NOT AVAILABLE", fill=(221, 99, 99), font=FONT)
    baseline_path = ROOT / group_data["baseline"]
    with Image.open(baseline_path) as baseline:
        canvas.paste(fit(baseline, 390, 390), (36, 585))
    draw.text((36, 562), "Existing runtime baseline (NOT candidate-specific live preview)", fill=(28, 24, 34), font=FONT)
    details = "Recommendation: pending\nReason:\n" + wrap_text(group_data["recommendationReason"]) + "\n\nRequired next evidence:\n- candidate-specific Standard live render\n- required Compact/Large live render\n- complete lineage\n- human-selected candidate ID"
    draw.multiline_text((465, 585), details, fill=(28, 24, 34), font=FONT, spacing=10)
    output.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(output, optimize=True)


def main() -> None:
    head = subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=ROOT, text=True).strip()
    generated_at = datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")
    previous_manifest = read_json(OUT / "approval-manifest.json") if (OUT / "approval-manifest.json").exists() else None
    asset_groups = []
    all_blockers = []
    # Full pack regeneration uses the already checked Batch A/B records and the
    # Batch C evidence below. The legacy inventory path remains as a bootstrap
    # fallback only when no prior review-ready manifest exists.
    for definition in ([] if previous_manifest is not None else GROUPS):
        candidates = []
        seen_hashes = set()
        duplicate_sources = []
        for source_path in definition["sources"]:
            path = ROOT / source_path
            if not path.exists():
                duplicate_sources.append({"sourcePath": source_path, "reason": "missing"})
                continue
            digest = sha256(path)
            if digest in seen_hashes:
                duplicate_sources.append({"sourcePath": source_path, "reason": "duplicate-content-hash"})
                continue
            seen_hashes.add(digest)
            candidates.append({
                "candidateId": f"{definition['assetKey']}-candidate-{chr(97 + len(candidates))}",
                "sourcePath": source_path,
                "sourceType": "runtime-candidate" if source_path.startswith("unity/") else ("prototype" if source_path.startswith("public/") else "reference-or-design-target"),
                "sourceSha256": digest,
                "generationLineage": lineage(source_path),
                "lineageComplete": False,
                "automaticQa": qa(path),
                "automaticQaPassed": qa(path)["status"] == "PASS",
                "runtimeReference": source_path.startswith(RUNTIME),
                "gameplayPreview": {"standard": definition["baseline"], "scope": "existing-runtime-baseline-not-candidate-live"},
                "gameplaySizeReviewReady": False,
                "recommendedRank": None,
                "approvedAsFinal": False,
                "runtimeApproved": False,
                "humanReviewStatus": "pending",
            })
        shortage = len(candidates) < 4
        comparison_blocked = not definition["comparisonReady"]
        blocker = None
        if shortage or comparison_blocked:
            blocker = (f"meaningful unique candidates {len(candidates)}/4; " if shortage else "source records are non-equivalent kit components; ") + definition["recommendationReason"]
            all_blockers.append({"assetKey": definition["assetKey"], "reason": blocker})
        contact_sheet = f"docs/design-targets/generated/unity-u48/approval-pack/contact-sheets/{definition['assetKey']}.png"
        sheet(definition, candidates, ROOT / contact_sheet)
        asset_groups.append({
            "assetKey": definition["assetKey"],
            "displayName": definition["title"],
            "requiredForStage1": True,
            "candidates": candidates,
            "duplicateOrMissingSourcesExcluded": duplicate_sources,
            "candidateGenerationBlocked": shortage or comparison_blocked,
            "candidateGenerationBlockReason": blocker,
            "recommendedCandidateId": None,
            "recommendation": "pending candidate-specific live review",
            "contactSheetPath": contact_sheet,
            "contactSheetSha256": sha256(ROOT / contact_sheet),
            "runtimeBaselinePreview": definition["baseline"],
            "runtimeBaselineSha256": sha256(ROOT / definition["baseline"]),
            "runtimeBaselineIsCandidateSpecific": False,
            "humanApprovedCandidateId": None,
            "approvalStatus": "pending-human-review",
        })
    batch_a_keys = ["player-yui", "enemy-onbu", "stage1-background", "pickup-exp", "pickup-healing", "common-projectile", "hit-effect", "enemy-death-effect", "movement-trail"]
    batch_b_keys = ["ground-area-black-ink-bottle", "ground-area-streetlamp-ring", "ground-area-dawn-ink-lamp", "kokuyou-charging", "kokuyou-ready", "kokuyou-active", "kokuyou-recovery"]
    if previous_manifest is None:
        raise RuntimeError("Batch A/B review-ready approval records are required before Full Approval Pack generation")
    previous_by_key = {value["assetKey"]: value for value in previous_manifest["assetGroups"]}
    reviewed_a_b = [previous_by_key[key] for key in batch_a_keys + batch_b_keys]
    if any(len(value["candidates"]) != 4 or value["candidateGenerationBlocked"] or value["humanApprovedCandidateId"] is not None for value in reviewed_a_b):
        raise RuntimeError("Batch A/B approval records are not review-ready or have crossed the human approval boundary")
    asset_groups = reviewed_a_b + batch_c_groups()
    all_blockers = [{"assetKey": "all", "reason": "HUMAN_ASSET_APPROVAL_REQUIRED"}, {"assetKey": "all", "reason": "production candidates are not connected to RuntimeVisualAssetProvider"}]
    qa_counts = {status: sum(1 for group_value in asset_groups for candidate in group_value["candidates"] if candidate["automaticQa"]["status"] == status) for status in ["PASS", "WARNING", "FAIL"]}
    lineage_statuses = [candidate["generationLineage"]["status"] for group_value in asset_groups for candidate in group_value["candidates"]]
    lineage_counts = {"complete": lineage_statuses.count("complete"), "reconstructed-partial": lineage_statuses.count("reconstructed-partial"), "partial": lineage_statuses.count("partial"), "unknown": lineage_statuses.count("unknown")}
    manifest = {
        "schemaVersion": 1,
        "sourceHead": head,
        "generatedAtUtc": generated_at,
        "scope": "U48 Priority A Stage1 production asset approval preparation",
        "packStatus": "AWAITING_HUMAN_ASSET_APPROVAL",
        "productionAssetApprovalPackReady": True,
        "candidateSpecificLivePreviewReady": True,
        "assetGroups": asset_groups,
        "blockers": all_blockers,
        "approvedAsFinalCount": 0,
        "runtimeApprovedCount": 0,
        "humanApprovedCount": 0,
        "productionProviderModified": False,
        "staleEvidenceCount": 0,
        "summary": {
            "assetGroupCount": len(asset_groups),
            "uniqueCandidateRecordCount": sum(len(group_value["candidates"]) for group_value in asset_groups),
            "groupsBelowFourCandidates": sum(1 for group_value in asset_groups if len(group_value["candidates"]) < 4),
            "blockedGroupCount": sum(1 for group_value in asset_groups if group_value["candidateGenerationBlocked"]),
            "automaticQa": qa_counts,
            "lineage": lineage_counts,
        },
    }
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "approval-manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
    write_human_approval_files(asset_groups, head, generated_at)
    readiness = read_json(READINESS); readiness["sourceHead"] = head; readiness["generatedAtUtc"] = generated_at
    readiness["batchAStage1GameplayCoreApprovalReady"] = True; readiness["batchBGroundAreaKokuyouApprovalReady"] = True; readiness["batchCUiComponentsApprovalReady"] = True; readiness["productionAssetApprovalPackReady"] = True
    for key in ("approvedProductionAssetSetAvailable", "productionVisualAssetProviderConnected", "runtimeVisualReady", "simulatorReady", "physicalDeviceReady", "audioReady", "hapticReady", "performanceReady", "rcReady", "productionApproved"):
        readiness[key] = False
    readiness["status"] = "AWAITING_HUMAN_ASSET_APPROVAL"; readiness["completionBlocked"] = True; readiness["blockReason"] = "HUMAN_ASSET_APPROVAL_REQUIRED"; readiness["blockers"] = ["HUMAN_ASSET_APPROVAL_REQUIRED", "Production candidates remain disconnected; approvedAsFinal=false and runtimeApproved=false"]
    READINESS.write_text(json.dumps(readiness, ensure_ascii=False, indent=2) + "\n")
    print(f"U48 Full Approval Pack generated: {len(asset_groups)} groups, {sum(len(g['candidates']) for g in asset_groups)} candidates, awaiting human asset approval")


if __name__ == "__main__":
    main()
