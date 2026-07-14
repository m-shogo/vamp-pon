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
    asset_groups = []
    all_blockers = []
    for definition in GROUPS:
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
    qa_counts = {status: sum(1 for group_value in asset_groups for candidate in group_value["candidates"] if candidate["automaticQa"]["status"] == status) for status in ["PASS", "WARNING", "FAIL"]}
    lineage_counts = {status: sum(1 for group_value in asset_groups for candidate in group_value["candidates"] if candidate["generationLineage"]["status"] == status) for status in ["complete", "partial", "unknown"]}
    manifest = {
        "schemaVersion": 1,
        "sourceHead": head,
        "generatedAtUtc": generated_at,
        "scope": "U48 Priority A Stage1 production asset approval preparation",
        "packStatus": "IN_PROGRESS_BLOCKED",
        "productionAssetApprovalPackReady": False,
        "candidateSpecificLivePreviewReady": False,
        "assetGroups": asset_groups,
        "blockers": all_blockers + [
            {"assetKey": "all", "reason": "candidate-specific live previews and required viewports are not captured"},
            {"assetKey": "all", "reason": "generation lineage is incomplete or unknown"},
            {"assetKey": "all", "reason": "human approval is pending"},
        ],
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
    print(f"U48 approval pack generated: {len(asset_groups)} groups, {sum(len(g['candidates']) for g in asset_groups)} unique candidate records, readiness blocked")


if __name__ == "__main__":
    main()
