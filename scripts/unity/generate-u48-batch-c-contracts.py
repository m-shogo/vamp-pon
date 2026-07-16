#!/usr/bin/env python3
"""Generate U48 Batch C UI audit, Golden References, recipes, prompts and contracts."""

from __future__ import annotations

import hashlib
import json
import re
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
EVIDENCE = ROOT / "docs/design-targets/generated/unity-u48/batch-c"
OUTPUT_ROOT = "unity/VampPonUnity/Assets/_Project/Art/Candidates/U48/BatchC"
SOURCE_HEAD = "eba336591d6414465a87cbe72db69715d7517d61"
TOOL = "scripts/unity/build-u48-batch-c-candidates.py"
TOOL_VERSION = "1"

UI_DESIGN = "docs/unity-ui-design-system-v1.md"
RESPONSIVE = "docs/unity-responsive-screen-policy.md"
CANON = "docs/181-current-production-canon.md"
STYLE = "docs/88-adopted-visual-direction.md"

HUD_FRAME = "unity/VampPonUnity/Assets/_Project/Resources/U45Candidates/UI/u45-battle-hud-top-frame.png"
SLOT_FRAME = "unity/VampPonUnity/Assets/_Project/Resources/U45Candidates/UI/u45-battle-inventory-slot-frame.png"
LEVELUP_FRAME = "unity/VampPonUnity/Assets/_Project/Resources/U45Candidates/UI/u45-levelup-card-common.png"
BUTTON_FRAME = "unity/VampPonUnity/Assets/_Project/Resources/U45Candidates/UI/u45-paper-button-frame.png"
STAGE_PANEL = "unity/VampPonUnity/Assets/_Project/Resources/U45Candidates/UI/u45-stage-select-map-panel.png"
STAGE_CARD = "unity/VampPonUnity/Assets/_Project/Resources/U45Candidates/UI/u45-stage-card-frame.png"
RESULT_PANEL = "unity/VampPonUnity/Assets/_Project/Resources/U46Candidates/UI/Result/u46-result-memory-page.png"
RESULT_ROW = "unity/VampPonUnity/Assets/_Project/Resources/U46Candidates/UI/Result/u46-result-reward-card.png"
RESULT_PRIMARY = "unity/VampPonUnity/Assets/_Project/Resources/U46Candidates/UI/Result/u46-result-primary-button.png"
RESULT_SECONDARY = "unity/VampPonUnity/Assets/_Project/Resources/U46Candidates/UI/Result/u46-result-secondary-button.png"


def sha(path: str) -> str:
    return hashlib.sha256((ROOT / path).read_bytes()).hexdigest()


def write_json(path: Path, value: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n")


def guid(path: str) -> str | None:
    meta = ROOT / f"{path}.meta"
    if not meta.exists():
        return None
    match = re.search(r"^guid: ([0-9a-f]{32})$", meta.read_text(), re.MULTILINE)
    return match.group(1) if match else None


OWNER_SOURCE = {
    "hud": "unity/VampPonUnity/Assets/_Project/Scripts/Runtime/U1Stage1SceneBootstrap.cs",
    "levelup": "unity/VampPonUnity/Assets/_Project/Scripts/U4/U4LevelUpOverlay.cs",
    "replacement": "unity/VampPonUnity/Assets/_Project/Scripts/U4/U4LevelUpOverlay.cs",
    "result": "unity/VampPonUnity/Assets/_Project/Scripts/UI/Screens/ResultView.cs",
    "stageSelect": "unity/VampPonUnity/Assets/_Project/Scripts/UI/Screens/StageSelectView.cs",
}

SCREENSHOT = {
    "hud": "docs/design-targets/generated/unity-u47/simulator-smoke/screenshots/05-inventory-full.png",
    "levelup": "docs/design-targets/generated/unity-u47/simulator-smoke/screenshots/03-levelup-actual-choices.png",
    "replacement": "docs/design-targets/generated/unity-u47/simulator-smoke/screenshots/07-levelup-replacement.png",
    "result": "docs/design-targets/generated/unity-u47/simulator-smoke/screenshots/20-result-u47-summary.png",
    "stageSelect": "docs/design-targets/generated/unity-u47/simulator-smoke/screenshots/01-stage-select.png",
}


# group, owner, runtime component, baseline asset, asset type, logical size, states, text-safe inset, tap target
GROUPS = [
    ("hud-top-status-frame", "hud", "TopHudPlaceholder/Image", HUD_FRAME, "sprite", [326, 46], ["default"], [12, 6, 12, 6], None),
    ("hud-hp-frame", "hud", "TopHudPlaceholder/Label HP region", HUD_FRAME, "sprite", [108, 46], ["default", "low-hp"], [10, 6, 10, 6], None),
    ("hud-timer-frame", "hud", "TopHudPlaceholder/Label timer region", HUD_FRAME, "sprite", [104, 46], ["default"], [10, 6, 10, 6], None),
    ("hud-inventory-weapon-slot", "hud", "U45BattleInventorySlot/Image", SLOT_FRAME, "sprite", [48, 48], ["default", "occupied", "selected", "disabled"], [5, 5, 5, 5], None),
    ("hud-inventory-passive-slot", "hud", "U47ActualInventoryHud/Image passive region", SLOT_FRAME, "sprite", [48, 48], ["default", "occupied", "selected", "disabled"], [5, 5, 5, 5], None),
    ("hud-rare-slot", "hud", "U47ActualInventoryHud/Image rare region", SLOT_FRAME, "sprite", [48, 48], ["default", "occupied", "selected", "disabled"], [5, 5, 5, 5], None),
    ("hud-kokuyou-gauge-frame", "hud", "U47ActualInventoryHud/Image gauge region", None, "color-only", [350, 22], ["charging", "ready", "active", "recovery"], [8, 3, 8, 3], None),
    ("levelup-card-background", "levelup", "PaperCard/bgImage", LEVELUP_FRAME, "sprite", [300, 132], ["default", "selected", "disabled"], [16, 12, 16, 12], [300, 132]),
    ("levelup-icon-frame", "levelup", "PaperCard/Content/IconFrame", None, "procedural", [40, 40], ["default", "selected", "disabled"], [4, 4, 4, 4], None),
    ("levelup-title-area", "levelup", "PaperCard/Content nameLabel", None, "layout-only", [266, 22], ["default", "selected", "disabled"], [8, 2, 8, 2], None),
    ("levelup-description-area", "levelup", "PaperCard/Content descLabel", None, "layout-only", [266, 62], ["default", "selected", "disabled"], [8, 4, 8, 4], None),
    ("levelup-selection-feedback", "levelup", "PaperCard/InnerBorder+CanvasGroup", LEVELUP_FRAME, "sprite", [300, 132], ["default", "selected", "disabled"], [16, 12, 16, 12], [300, 132]),
    ("levelup-decline-button", "levelup", "PaperButton", BUTTON_FRAME, "sprite", [220, 44], ["default", "pressed", "disabled"], [12, 5, 12, 5], [220, 48]),
    ("replacement-modal-background", "replacement", "U4LevelUpOverlay/Panel", None, "color-only", [344, 590], ["default"], [18, 18, 18, 18], None),
    ("replacement-incoming-candidate-panel", "replacement", "U4LevelUpOverlay/Title+Panel", None, "layout-only", [300, 76], ["default", "selected", "disabled"], [12, 8, 12, 8], None),
    ("replacement-owned-slot-row", "replacement", "ReplacementSlotButton", BUTTON_FRAME, "sprite", [300, 44], ["default", "selected", "disabled"], [12, 5, 12, 5], [300, 48]),
    ("replacement-selected-slot-state", "replacement", "ReplacementSlotButton hovered state", BUTTON_FRAME, "sprite", [300, 44], ["default", "selected", "disabled"], [12, 5, 12, 5], [300, 48]),
    ("replacement-confirm-button", "replacement", "ReplacementSlotButton actual confirm", BUTTON_FRAME, "sprite", [300, 44], ["default", "pressed", "disabled"], [12, 5, 12, 5], [300, 48]),
    ("replacement-cancel-button", "replacement", "PaperButton 受け取らない", BUTTON_FRAME, "sprite", [220, 44], ["default", "pressed", "disabled"], [12, 5, 12, 5], [220, 48]),
    ("result-main-panel", "result", "ResultMemoryPage/Image", RESULT_PANEL, "sprite", [355, 756], ["clear", "failed"], [20, 20, 20, 20], None),
    ("result-summary-header", "result", "Outcome+Title+Stage+Rank", RESULT_PANEL, "sprite", [326, 150], ["clear", "failed"], [18, 12, 18, 12], None),
    ("result-inventory-row", "result", "U47GameplaySummary+RewardCard", RESULT_ROW, "sprite", [326, 70], ["default", "empty"], [12, 8, 12, 8], None),
    ("result-evolution-awakening-row", "result", "RewardCard evolution/awakening", RESULT_ROW, "sprite", [326, 70], ["default", "empty"], [12, 8, 12, 8], None),
    ("result-retry-button", "result", "RetryButton", RESULT_PRIMARY, "sprite", [296, 59], ["default", "pressed", "disabled"], [14, 6, 14, 6], [296, 59]),
    ("result-return-button", "result", "StageSelectButton", RESULT_SECONDARY, "sprite", [218, 55], ["default", "pressed", "disabled"], [14, 6, 14, 6], [218, 55]),
    ("stage-select-stage-card", "stageSelect", "Stage1Card/Image", STAGE_CARD, "sprite", [275, 192], ["locked", "unlocked", "completed", "selected"], [16, 12, 16, 12], [275, 192]),
    ("stage-select-locked-unlocked-state", "stageSelect", "Stage1Card visual state", STAGE_CARD, "sprite", [275, 192], ["locked", "unlocked"], [16, 12, 16, 12], [275, 192]),
    ("stage-select-primary-button", "stageSelect", "StartStageButton", BUTTON_FRAME, "sprite", [248, 71], ["default", "pressed", "disabled"], [14, 6, 14, 6], [248, 71]),
    ("stage-select-title-frame", "stageSelect", "StageSelectPaperMap/Title+Subtitle", STAGE_PANEL, "sprite", [303, 94], ["default", "selected"], [18, 10, 18, 10], None),
    ("stage-select-metadata-row", "stageSelect", "Stage1Card/StageDetail", STAGE_CARD, "sprite", [248, 61], ["default", "disabled"], [12, 6, 12, 6], None),
]

CANDIDATES = [
    ("a-runtime-baseline", "runtime-baseline", "reconstructed", "current runtime structure with explicit safe border"),
    ("b-readability", "readability", "procedural-authored", "strong hierarchy, wider text-safe center and state-readable corners"),
    ("c-paper-ink", "worldbuilding", "procedural-authored", "matte paper fibers, irregular black-ink edge and restrained lantern accent"),
    ("d-production-balanced", "production-balanced", "procedural-authored", "balanced readability, paper-ink identity and scalable ornament density"),
]


def baseline_audit() -> dict:
    existing_audit = EVIDENCE / "runtime-baseline-audit.json"
    generated_at = "2026-07-16T06:34:06.513237Z"
    if existing_audit.exists():
        generated_at = json.loads(existing_audit.read_text()).get("generatedAtUtc", generated_at)
    entries = []
    for group, owner, component, asset, asset_type, logical, states, inset, tap in GROUPS:
        rect = {
            "anchorMin": [0.0, 0.0], "anchorMax": [1.0, 1.0], "pivot": [0.5, 0.5],
            "sizeDelta": logical,
        }
        entries.append({
            "assetGroup": group,
            "runtimeOwner": OWNER_SOURCE[owner],
            "runtimeComponent": component,
            "currentAssetPath": asset,
            "assetType": asset_type,
            "currentGuid": guid(asset) if asset else None,
            "currentSha256": sha(asset) if asset else None,
            "renderMode": "ScreenSpaceOverlay/uGUI",
            "sortingOrder": 0 if owner == "hud" else 100 if owner in {"levelup", "replacement"} else 90,
            "rectTransform": rect,
            "canvasScalerContract": {"mode": "ScaleWithScreenSize", "referenceResolution": [390, 844], "matchWidthOrHeight": 0.5},
            "safeAreaOwner": "SafeAreaFitter" if owner != "hud" else "SafeAreaCanvas/SafeAreaFitter",
            "interactionOwner": component if tap else "presentation-only",
            "currentStates": states,
            "imageType": "Sliced" if asset else "Simple/no-sprite",
            "spriteBorder": "read-from-meta" if asset else None,
            "material": "UI/Default",
            "color": "runtime theme/fallback color",
            "alpha": "runtime component value",
            "font": "ZenMaruGothic-Medium Runtime SDF" if "Label" in component or "Title" in component or "row" in group else None,
            "fontSizePolicy": "existing runtime value; candidate may not change it",
            "wrappingOverflow": "existing runtime TextMeshPro contract",
            "layout": "existing RectTransform; candidate may not change anchors/pivot/size",
            "raycastTarget": bool(tap),
            "buttonHitArea": tap,
            "textSafeInset": inset,
            "knownProblems": ["candidate-specific 9-slice/text/safe-area/tap-target review was not previously available"],
        })
    return {
        "schemaVersion": 1, "sourceHead": SOURCE_HEAD, "generatedAtUtc": generated_at,
        "scope": "U48 Batch C current production runtime UI baseline; audit only",
        "assetGroupCount": len(entries), "entries": entries,
        "productionProviderModified": False, "gameplayContractChanged": False,
    }


def main() -> None:
    if len(GROUPS) != 30 or len({group[0] for group in GROUPS}) != 30:
        raise SystemExit("Batch C requires exactly 30 unique groups")
    EVIDENCE.mkdir(parents=True, exist_ok=True)
    write_json(EVIDENCE / "runtime-baseline-audit.json", baseline_audit())
    golden_entries = []
    recipes = []
    contracts = []
    now = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    for group, owner, component, asset, _asset_type, logical, states, inset, tap in GROUPS:
        references = [UI_DESIGN, RESPONSIVE, CANON, STYLE, SCREENSHOT[owner]] + ([asset] if asset else [])
        golden_entries.append({
            "assetGroup": group,
            "goldenReferenceStatus": "composite",
            "references": [{"path": path, "sha256": sha(path), "role": "runtime-baseline" if path == asset else "runtime-size" if path == SCREENSHOT[owner] else "policy"} for path in references],
            "inherit": ["紙UI", "黒インク", "抑制されたランタン光", "existing runtime logical size and hierarchy"],
            "doNotInherit": ["generic fantasy", "glossy plastic", "neon/SF HUD", "baked text", "unapproved runtime status"],
            "runtimeReadabilityContract": ["Compact/Standard/Large", "existing font and content retained", "text-safe area retained", "no overflow", "Safe Area retained"],
            "interactionContract": ["existing interaction owner", "existing hit area unchanged", "default/selected/pressed/disabled/locked states as applicable"],
            "prohibitedExpressions": ["text or controls baked into sprite", "color-only candidate inflation", "unsafe 9-slice ornament", "candidate-specific RectTransform change"],
            "humanApprovedGoldenReference": False,
            "approvedForRuntime": False,
        })
        for suffix, role, source_type, operation in CANDIDATES:
            candidate = f"{group}-{suffix}"
            prompt_path = EVIDENCE / "prompts" / f"{candidate}.txt"
            prompt_path.parent.mkdir(parents=True, exist_ok=True)
            prompt_path.write_text(
                f"U48 Batch C / {group} / {candidate}\n"
                f"Purpose: {component}\nOperation: {operation}\n"
                f"Logical size: {logical}; states: {states}; text-safe inset: {inset}; tap target: {tap}\n"
                "Textless matte paper UI component, black ink, restrained lantern warmth. "
                "Transparent PNG RGBA, stable 9-slice corners, no logo, no baked text, no glossy plastic or neon.\n"
            )
            recipe_id = f"batch-c:{candidate}:v1"
            recipes.append({
                "recipeId": recipe_id, "assetGroup": group, "candidateId": candidate,
                "operation": operation, "logicalSize": logical, "sourcePixelSize": [240, 120],
                "border": [18, 18, 18, 18], "seed": int(hashlib.sha256(candidate.encode()).hexdigest()[:8], 16),
                "deterministic": True,
            })
            output_path = f"{OUTPUT_ROOT}/{group}/{candidate}.png"
            output = ROOT / output_path
            parent_paths = [asset] if asset else [SCREENSHOT[owner]]
            contracts.append({
                "schemaVersion": 1, "assetGroup": group, "candidateId": candidate,
                "candidateRole": role, "sourceType": source_type,
                "goldenReferencePaths": references, "goldenReferenceSha256": [sha(path) for path in references],
                "parentSourcePaths": parent_paths, "parentSourceSha256": [sha(path) for path in parent_paths],
                "generationTool": TOOL, "generationToolVersion": TOOL_VERSION,
                "recipePath": "docs/design-targets/generated/unity-u48/batch-c/generation-recipes.json",
                "recipeId": recipe_id, "promptPath": str(prompt_path.relative_to(ROOT)),
                "promptSha256": sha(str(prompt_path.relative_to(ROOT))),
                "createdAtUtc": now if output.exists() else None,
                "outputPath": output_path, "outputSha256": sha(output_path) if output.exists() else None,
                "targetImportContract": {
                    "format": "PNG RGBA", "sourcePixelSize": [240, 120], "logicalSize": logical,
                    "filterMode": "Bilinear", "compression": "None", "mipmap": False,
                    "imageType": "Sliced", "pixelsPerUnit": 100, "border": [18, 18, 18, 18], "pivot": [0.5, 0.5],
                },
                "runtimeContract": {
                    "owner": owner, "runtimeComponent": component, "requiredStates": states,
                    "textSafeInset": inset, "tapTarget": tap, "sameLogicalSize": True,
                    "previewOnly": True, "uiLogicUnchanged": True, "gameplayStateUnchanged": True,
                    "productionProviderUnchanged": True,
                },
                "automaticQaContract": [
                    "exists", "png-rgba", "alpha", "unique-content-sha", "unique-guid", "bilinear", "mipmap-off",
                    "compression-none", "finite-non-empty-bounds", "safe-nine-slice", "0.75x-1x-1.5x-2x-stretch",
                    "short-long-japanese-latin-number-punctuation-text", "compact-standard-large", "safe-area", "tap-target",
                    "required-states", "preview-cleanup", "runtime-contract-unchanged",
                ],
                "lineageStatus": ("reconstructed-partial" if source_type == "reconstructed" else "complete") if output.exists() else "unknown",
                "humanReviewStatus": "pending", "humanApprovedCandidateId": None,
                "approvedAsFinal": False, "runtimeApproved": False, "approvalStatus": "pending-human-review",
            })
    write_json(EVIDENCE / "golden-references.json", {"schemaVersion": 1, "sourceHead": SOURCE_HEAD, "batch": "C", "entries": golden_entries})
    write_json(EVIDENCE / "generation-recipes.json", {"schemaVersion": 1, "sourceHead": SOURCE_HEAD, "tool": TOOL, "toolVersion": TOOL_VERSION, "recipes": recipes})
    write_json(EVIDENCE / "generation-contracts.json", {"schemaVersion": 1, "sourceHead": SOURCE_HEAD, "batch": "C", "generatedAtUtc": now, "assetGroupCount": 30, "candidateCount": len(contracts), "contracts": contracts})
    print(f"U48 Batch C contracts generated: {len(golden_entries)} groups, {len(contracts)} candidates")


if __name__ == "__main__":
    main()
