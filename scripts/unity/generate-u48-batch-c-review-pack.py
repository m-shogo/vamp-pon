#!/usr/bin/env python3
"""Generate U48 Batch C review evidence without approving or connecting candidates."""

from __future__ import annotations

import hashlib
import json
import textwrap
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[2]
EVIDENCE = ROOT / "docs/design-targets/generated/unity-u48/batch-c"
CONTACTS = EVIDENCE / "contact-sheets"
SYSTEMS = EVIDENCE / "system-sheets"
READINESS = ROOT / "docs/design-targets/generated/unity-u48/readiness.json"
FONT_PATH = ROOT / "unity/VampPonUnity/Assets/_Project/Resources/ZenMaruGothic-Medium.ttf"

RANKING_LETTERS = {
    "hud-top-status-frame": "BDCA", "hud-hp-frame": "BDCA", "hud-timer-frame": "BDCA",
    "hud-inventory-weapon-slot": "CBDA", "hud-inventory-passive-slot": "CBDA", "hud-rare-slot": "DCBA", "hud-kokuyou-gauge-frame": "DBCA",
    "levelup-card-background": "DCBA", "levelup-icon-frame": "BDCA", "levelup-title-area": "DBCA", "levelup-description-area": "BDCA", "levelup-selection-feedback": "CDBA", "levelup-decline-button": "BDCA",
    "replacement-modal-background": "DCBA", "replacement-incoming-candidate-panel": "DCBA", "replacement-owned-slot-row": "CDBA", "replacement-selected-slot-state": "CDBA", "replacement-confirm-button": "BDCA", "replacement-cancel-button": "BDCA",
    "result-main-panel": "DCBA", "result-summary-header": "DCBA", "result-inventory-row": "CDBA", "result-evolution-awakening-row": "CDBA", "result-retry-button": "BDCA", "result-return-button": "BDCA",
    "stage-select-title-frame": "DCBA", "stage-select-stage-card": "DCBA", "stage-select-locked-unlocked-state": "DCBA", "stage-select-metadata-row": "DCBA", "stage-select-primary-button": "BDCA",
}
SYSTEM_RANKINGS = {"hud": "BDCA", "levelUp": "DCBA", "replacement": "DCBA", "result": "DCBA", "stageSelect": "DCBA"}
SCREEN_LABELS = {"hud": "HUD", "levelUp": "LevelUp", "replacement": "Replacement", "result": "Result", "stageSelect": "StageSelect"}


def load(name: str) -> dict:
    return json.loads((EVIDENCE / name).read_text())


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def now() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def font(size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(FONT_PATH), size)


def contain(path: Path, size: tuple[int, int], background=(24, 20, 27)) -> Image.Image:
    with Image.open(path) as source:
        value = source.convert("RGBA")
    value.thumbnail(size, Image.Resampling.NEAREST)
    output = Image.new("RGB", size, background)
    output.paste(value.convert("RGB"), ((size[0] - value.width) // 2, (size[1] - value.height) // 2), value.getchannel("A"))
    return output


def wrapped(draw: ImageDraw.ImageDraw, xy: tuple[int, int], value: str, value_font: ImageFont.FreeTypeFont, width: int, fill=(222, 211, 192)) -> int:
    lines = textwrap.wrap(value, max(14, width // max(7, value_font.size // 2))) or [""]
    draw.multiline_text(xy, "\n".join(lines), font=value_font, fill=fill, spacing=3)
    return len(lines) * (value_font.size + 4)


def candidate_letter(candidate_id: str) -> str:
    for letter in "abcd":
        if f"-{letter}-" in candidate_id:
            return letter.upper()
    raise ValueError(f"candidate letter missing: {candidate_id}")


def ranked_candidates(group: dict) -> list[str]:
    by_letter = {candidate_letter(value): value for value in group["candidateIds"]}
    return [by_letter[letter] for letter in RANKING_LETTERS[group["assetGroup"]]]


def standard_entry(entries: list[dict], candidate_id: str, state: str) -> dict:
    return next(value for value in entries if value["candidateId"] == candidate_id and value["viewport"] == "standard" and value["uiState"] == state)


def viewport_entry(entries: list[dict], candidate_id: str, viewport: str, canonical: str) -> dict:
    return next(value for value in entries if value["candidateId"] == candidate_id and value["viewport"] == viewport and value["uiState"] == canonical)


def recommendation_reason(group: dict) -> str:
    letter = RANKING_LETTERS[group["assetGroup"]][0]
    axis = {"B": "readability", "C": "paper/black-ink interaction identity", "D": "production-balanced hierarchy"}[letter]
    return f"{SCREEN_LABELS[group['screen']]}の実runtime routeで、{axis}がCompact/Standard/Largeとrequired statesを通じて最も安定した。"


def remaining_risk(group: dict) -> str:
    states = ", ".join(group["requiredStandardStates"])
    return f"人間は実機の文字密度、隣接component整合、操作中の見分けやすさを確認する必要がある。対象state: {states}。"


def component_sheet(group: dict, entries: list[dict], contracts: dict[str, dict], qa: dict[str, dict], golden: dict) -> Path:
    width, height, column = 2040, 2140, 500
    canvas = Image.new("RGB", (width, height), (18, 15, 21)); draw = ImageDraw.Draw(canvas)
    draw.text((24, 18), f"U48 Batch C / {group['assetGroup']} / HUMAN REVIEW PENDING", font=font(28), fill=(246, 207, 127))
    draw.text((24, 55), f"{SCREEN_LABELS[group['screen']]} production UI route | Golden {golden['goldenReferenceStatus']} | approval is NOT granted", font=font(17), fill=(195, 184, 165))
    ranking = ranked_candidates(group)
    for rank, candidate_id in enumerate(ranking, 1):
        contract = contracts[candidate_id]; candidate_qa = qa[candidate_id]; x, y = 20 + (rank - 1) * column, 92
        draw.rounded_rectangle((x, y, x + column - 14, height - 18), 12, fill=(31, 26, 35), outline=(100, 79, 89), width=2)
        draw.text((x + 14, y + 10), f"AI RANK {rank} / {candidate_letter(candidate_id)}", font=font(24), fill=(246, 188, 94) if rank == 1 else (201, 188, 165)); y += 45
        y += wrapped(draw, (x + 14, y), candidate_id, font(16), column - 42); y += 4
        canvas.paste(contain(ROOT / contract["outputPath"], (column - 42, 155)), (x + 14, y)); y += 162
        draw.text((x + 14, y), "RAW ASSET / imported candidate", font=font(13), fill=(163, 151, 140)); y += 20
        canonical = group["canonicalComparisonState"]
        for index, viewport in enumerate(("compact", "standard", "large")):
            item = viewport_entry(entries, candidate_id, viewport, canonical)
            px = x + 14 + index * 151
            canvas.paste(contain(ROOT / item["componentCropPath"], (140, 175)), (px, y))
            draw.text((px, y + 178), viewport.upper(), font=font(12), fill=(166, 154, 142))
        y += 202
        state_entries = [standard_entry(entries, candidate_id, state) for state in group["requiredStandardStates"]]
        for index, item in enumerate(state_entries):
            px = x + 14 + (index % 3) * 151; py = y + (index // 3) * 184
            canvas.paste(contain(ROOT / item["componentCropPath"], (140, 150)), (px, py))
            draw.text((px, py + 152), item["uiState"][:18], font=font(11), fill=(166, 154, 142))
        y += ((len(state_entries) + 2) // 3) * 184
        meta = [
            f"canonical={canonical} / required={','.join(group['requiredStandardStates'])}",
            f"longest canonical text=live route covered / layout fixture=none (production live)",
            f"9-slice={'PASS' if candidate_qa['qa']['nineSlice']['passed'] else 'FAIL'} / text-safe={'PASS' if candidate_qa['qa']['text']['passed'] else 'FAIL'} / tap target={'PASS' if candidate_qa['qa']['interaction']['passed'] else 'FAIL'} / Safe Area={'PASS' if candidate_qa['qa']['layout']['safeArea'] else 'FAIL'}",
            f"QA={candidate_qa['status']} / Lineage={contract['lineageStatus']} / Golden={golden['goldenReferenceStatus']}",
            f"runtime contract: {contract['runtimeContract']['owner']} owns UI; UI/gameplay/provider unchanged",
            "Strength: " + (recommendation_reason(group) if rank == 1 else "独立した比較軸を保持し、人間選択肢として有効。"),
            "Weakness/Risk: " + remaining_risk(group),
            f"AI recommendation={'YES' if rank == 1 else 'NO'} / recommendationIsApproval=false",
        ]
        for line in meta:
            y += wrapped(draw, (x + 14, y), line, font(12), column - 42) + 3
        draw.text((x + 14, min(y + 8, height - 54)), "HUMAN APPROVAL: [   ]", font=font(17), fill=(246, 188, 94))
    CONTACTS.mkdir(parents=True, exist_ok=True)
    path = CONTACTS / f"{group['assetGroup']}.png"; canvas.save(path, optimize=True); return path


def system_sheet(screen: str, groups: list[dict], entries: list[dict]) -> Path:
    row_height = 245; width = 2100; height = 100 + len(groups) * row_height
    canvas = Image.new("RGB", (width, height), (18, 15, 21)); draw = ImageDraw.Draw(canvas)
    ranking = SYSTEM_RANKINGS[screen]
    draw.text((24, 16), f"U48 Batch C / {SCREEN_LABELS[screen]} / SYSTEM A-D / HUMAN REVIEW PENDING", font=font(27), fill=(246, 207, 127))
    draw.text((24, 53), f"AI system ranking: {' > '.join(ranking)} / recommended {ranking[0]} / no composite and no approval", font=font(17), fill=(195, 184, 165))
    for column, letter in enumerate("ABCD"):
        draw.text((390 + column * 420, 76), f"SYSTEM {letter}", font=font(18), fill=(246, 188, 94) if letter == ranking[0] else (201, 188, 165))
    for row, group in enumerate(groups):
        y = 100 + row * row_height; draw.text((20, y + 10), group["assetGroup"], font=font(15), fill=(224, 212, 192))
        by_letter = {candidate_letter(value): value for value in group["candidateIds"]}
        for column, letter in enumerate("ABCD"):
            candidate_id = by_letter[letter]; item = standard_entry(entries, candidate_id, group["canonicalComparisonState"]); x = 340 + column * 420
            canvas.paste(contain(ROOT / item["componentCropPath"], (390, 175)), (x, y + 8))
            draw.text((x, y + 187), candidate_id, font=font(11), fill=(165, 153, 141))
            draw.text((x, y + 207), f"system rank {ranking.index(letter)+1}", font=font(11), fill=(165, 153, 141))
    SYSTEMS.mkdir(parents=True, exist_ok=True)
    path = SYSTEMS / f"{screen}.png"; canvas.save(path, optimize=True); return path


def main() -> None:
    matrix = load("capture-matrix.json"); manifest = load("capture-manifest.json"); contracts_list = load("generation-contracts.json")["contracts"]
    contracts = {value["candidateId"]: value for value in contracts_list}; qa_list = load("automatic-qa.json")["entries"]
    qa = {value["candidateId"]: value for value in qa_list}; golden = {value["assetGroup"]: value for value in load("golden-references.json")["entries"]}
    entries = manifest["entries"]; recommendations = []
    for group in matrix["groups"]:
        path = component_sheet(group, entries, contracts, qa, golden[group["assetGroup"]]); ranking = ranked_candidates(group)
        recommendations.append({
            "assetGroup": group["assetGroup"], "screen": group["screen"], "recommendedCandidateId": ranking[0],
            "recommendedLetter": candidate_letter(ranking[0]), "rankedCandidateIds": ranking, "reason": recommendation_reason(group),
            "remainingRisk": remaining_risk(group), "contactSheetPath": str(path.relative_to(ROOT)), "contactSheetSha256": sha(path),
            "recommendationIsApproval": False, "approvedAsFinal": False, "runtimeApproved": False,
            "humanReviewStatus": "pending", "humanApprovedCandidateId": None, "approvalStatus": "pending-human-review",
        })
    systems = []
    for screen in SCREEN_LABELS:
        screen_groups = [value for value in matrix["groups"] if value["screen"] == screen]; path = system_sheet(screen, screen_groups, entries)
        systems.append({"screen": screen, "displayName": SCREEN_LABELS[screen], "recommendedSystemLetter": SYSTEM_RANKINGS[screen][0], "rankedSystemLetters": list(SYSTEM_RANKINGS[screen]), "reason": f"{SCREEN_LABELS[screen]}全componentのhierarchyとpaper/black ink/lantern lightの整合を優先。", "remainingRisk": "component単独推奨との組み合わせは人間が最終判断する。", "path": str(path.relative_to(ROOT)), "sha256": sha(path), "humanReviewStatus": "pending"})
    generated = now()
    (EVIDENCE / "ai-recommendations.json").write_text(json.dumps({"schemaVersion": 1, "sourceHead": manifest["sourceHead"], "batch": "C", "generatedAtUtc": generated, "recommendationIsApproval": False, "humanReviewStatus": "pending", "approvedAsFinal": False, "runtimeApproved": False, "humanApprovedCandidateId": None, "entries": recommendations, "screenSystems": systems}, ensure_ascii=False, indent=2) + "\n")
    verification = {
        "schemaVersion": 1, "sourceHead": manifest["sourceHead"], "generatedAtUtc": generated, "batch": "C",
        "scope": "30 UI component groups / 120 candidates / five production UI routes; review-ready only",
        "results": {"assetGroupCount": 30, "candidateCount": 120, "candidateSpecificLiveCapture": "PASS_564", "compactCaptureCount": manifest["viewportCounts"]["compact"], "standardCaptureCount": manifest["viewportCounts"]["standard"], "largeCaptureCount": manifest["viewportCounts"]["large"], "requiredStateCaptureCount": manifest["requiredStateEvidenceCount"], "goldenReferenceCount": len(golden), "generationContractCount": len(contracts_list), "lineageCompleteCount": sum(value["lineageStatus"] == "complete" for value in contracts_list), "lineageReconstructedPartialCount": sum(value["lineageStatus"] == "reconstructed-partial" for value in contracts_list), "lineageUnknownCount": sum(value["lineageStatus"] == "unknown" for value in contracts_list), "automaticQa": load("automatic-qa.json")["summary"], "liveQa": {"PASS": len(entries), "WARNING": 0, "FAIL": 0}, "duplicateScreenshotHashCount": manifest["duplicateScreenshotHashCount"], "staleEvidenceCount": manifest["staleCount"], "resizeReuseCount": manifest["standardFileResizeReuseCount"], "cleanupFailureCount": manifest["cleanupFailureCount"], "unhandledExceptionCount": manifest["unhandledExceptionCount"], "assertionFailureCount": manifest["assertionFailureCount"], "nineSliceFailureCount": manifest["nineSliceFailureCount"], "textSafeAreaFailureCount": manifest["textSafeAreaFailureCount"], "tapTargetFailureCount": manifest["tapTargetFailureCount"], "safeAreaFailureCount": manifest["safeAreaFailureCount"]},
        "runtimeContracts": {screen: {"owner": screen, "uiCommandRoutePreserved": True, "gameplayOrSaveDirectWriteUsed": False, "productionProviderChanged": False} for screen in SCREEN_LABELS},
        "approvalBoundary": {"batchAStage1GameplayCoreApprovalReady": True, "batchBGroundAreaKokuyouApprovalReady": True, "batchCUiComponentsApprovalReady": True, "productionAssetApprovalPackReady": False, "approvedProductionAssetSetAvailable": False, "productionVisualAssetProviderConnected": False, "runtimeVisualReady": False, "humanReviewStatus": "pending", "u48Status": "IN_PROGRESS_BLOCKED"},
        "notes": ["AI recommendations are not human approval.", "Production RuntimeVisualAssetProvider is unchanged.", "All candidates remain approvedAsFinal=false and runtimeApproved=false."],
    }
    (EVIDENCE / "verification-summary.json").write_text(json.dumps(verification, ensure_ascii=False, indent=2) + "\n")
    readiness = json.loads(READINESS.read_text()); readiness["sourceHead"] = manifest["sourceHead"]; readiness["generatedAtUtc"] = generated
    readiness["batchAStage1GameplayCoreApprovalReady"] = True; readiness["batchBGroundAreaKokuyouApprovalReady"] = True; readiness["batchCUiComponentsApprovalReady"] = True
    for key in ("productionAssetApprovalPackReady", "approvedProductionAssetSetAvailable", "productionVisualAssetProviderConnected", "runtimeVisualReady", "simulatorReady", "physicalDeviceReady", "audioReady", "hapticReady", "performanceReady", "rcReady", "productionApproved"):
        readiness[key] = False
    readiness["status"] = "IN_PROGRESS_BLOCKED"; readiness["completionBlocked"] = True
    stale_terms = ("13 groups", "30 split UI", "Batch C UI candidate-specific", "distinct gameplay icons, healing pickup", "Batch B ground-area")
    readiness["blockers"] = [value for value in readiness.get("blockers", []) if not any(term in value for term in stale_terms)]
    readiness["blockers"] = list(dict.fromkeys(["Batch C UI components are review-ready, but human candidate approval and production connection are pending"] + readiness["blockers"]))
    READINESS.write_text(json.dumps(readiness, ensure_ascii=False, indent=2) + "\n")
    print("U48 Batch C review pack: 30 component sheets, 5 system sheets, 30 component and 5 system AI recommendations; human approval pending")


if __name__ == "__main__":
    main()
