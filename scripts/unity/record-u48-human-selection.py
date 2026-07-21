#!/usr/bin/env python3
"""Record the user's U48 selection decision without granting runtime approval."""

from __future__ import annotations

import hashlib
import json
import subprocess
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
INDEX = ROOT / "docs/design-targets/generated/unity-u48/human-approval-index.json"
MANIFEST = ROOT / "docs/design-targets/generated/unity-u48/approval-pack/approval-manifest.json"
READINESS = ROOT / "docs/design-targets/generated/unity-u48/readiness.json"
DECISION = ROOT / "docs/design-targets/generated/unity-u48/human-selection-decision.json"
SUMMARY = ROOT / "docs/design-targets/generated/unity-u48/human-approval-summary.json"
DOC = ROOT / "docs/unity-u48-human-asset-approval-2026-07-21.md"

DECISION_TEXT = "AI推奨46件をすべて人間承認として採用する。"
SOURCE = "user-provided-human-decision"
SCOPE = "U48-production-asset-selection"


SELECTIONS = {
    "player-yui": "C", "enemy-onbu": "C", "stage1-background": "C", "pickup-exp": "B", "pickup-healing": "D",
    "common-projectile": "C", "hit-effect": "B", "enemy-death-effect": "D", "movement-trail": "C",
    "ground-area-black-ink-bottle": "C", "ground-area-streetlamp-ring": "D", "ground-area-dawn-ink-lamp": "D",
    "kokuyou-charging": "B", "kokuyou-ready": "B", "kokuyou-active": "B", "kokuyou-recovery": "B",
    "hud-hp-frame": "B", "hud-inventory-passive-slot": "C", "hud-inventory-weapon-slot": "C", "hud-kokuyou-gauge-frame": "D",
    "hud-rare-slot": "D", "hud-timer-frame": "B", "hud-top-status-frame": "B",
    "levelup-card-background": "D", "levelup-decline-button": "B", "levelup-description-area": "B", "levelup-icon-frame": "B",
    "levelup-selection-feedback": "C", "levelup-title-area": "D",
    "replacement-cancel-button": "B", "replacement-confirm-button": "B", "replacement-incoming-candidate-panel": "D",
    "replacement-modal-background": "D", "replacement-owned-slot-row": "C", "replacement-selected-slot-state": "C",
    "result-evolution-awakening-row": "C", "result-inventory-row": "C", "result-main-panel": "D", "result-retry-button": "B",
    "result-return-button": "B", "result-summary-header": "D",
    "stage-select-locked-unlocked-state": "D", "stage-select-metadata-row": "D", "stage-select-primary-button": "B",
    "stage-select-stage-card": "D", "stage-select-title-frame": "D",
}


def read(path: Path) -> dict:
    return json.loads(path.read_text())


def write(path: Path, value: dict) -> None:
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n")


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> None:
    index = read(INDEX); manifest = read(MANIFEST); readiness = read(READINESS)
    head = subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=ROOT, text=True).strip()
    if DECISION.exists():
        previous = read(DECISION); decided_utc = previous["decidedAtUtc"]; decided_jst = previous["decidedAtJst"]
    else:
        now = datetime.now(timezone.utc).replace(microsecond=0)
        decided_utc = now.isoformat().replace("+00:00", "Z")
        decided_jst = now.astimezone(timezone.utc).astimezone().isoformat(timespec="seconds")

    index_by_group = {group["assetGroup"]: group for group in index["groups"]}
    manifest_by_group = {group["assetKey"]: group for group in manifest["assetGroups"]}
    if set(SELECTIONS) != set(index_by_group) or set(SELECTIONS) != set(manifest_by_group):
        raise RuntimeError("Human selection groups do not exactly match the 46-group approval pack.")

    records = []
    for asset_group, letter in SELECTIONS.items():
        index_group = index_by_group[asset_group]; manifest_group = manifest_by_group[asset_group]
        option = next((value for value in index_group["candidateOptions"] if value["letter"] == letter), None)
        if option is None: raise RuntimeError(f"Unknown candidate letter: {asset_group}:{letter}")
        selected_id = option["candidateId"]
        if selected_id != index_group["recommendedCandidateId"] or selected_id != manifest_group["recommendedCandidateId"]:
            raise RuntimeError(f"Human selection does not match AI recommendation: {asset_group}")
        selected = next(value for value in manifest_group["candidates"] if value["candidateId"] == selected_id)
        source = ROOT / selected["sourcePath"]
        if not source.is_file() or sha(source) != selected["sourceSha256"] or selected["automaticQa"]["status"] != "PASS":
            raise RuntimeError(f"Selected source/QA mismatch: {selected_id}")
        if not selected["gameplaySizeReviewReady"] or not all((ROOT / path).is_file() for path in selected["gameplayPreview"].values()):
            raise RuntimeError(f"Selected live QA is incomplete: {selected_id}")
        records.append({
            "assetGroup": asset_group, "selectedLetter": letter, "selectedCandidateId": selected_id,
            "recommendedCandidateId": manifest_group["recommendedCandidateId"], "recommendationMatched": True,
            "sourcePath": selected["sourcePath"], "sourceSha256": selected["sourceSha256"],
            "automaticQaStatus": "PASS", "liveQaStatus": "PASS", "stale": False,
        })
        manifest_group["humanApprovedCandidateId"] = selected_id
        manifest_group["approvalStatus"] = "human-approved"
        manifest_group["approvalSource"] = SOURCE
        index_group["approvedCandidateId"] = selected_id
        for candidate in manifest_group["candidates"]:
            chosen = candidate["candidateId"] == selected_id
            candidate["approvedAsFinal"] = chosen
            candidate["runtimeApproved"] = False
            candidate["humanReviewStatus"] = "approved" if chosen else "not-selected"
            candidate["approvalStatus"] = "human-approved" if chosen else "not-selected"
            if chosen: candidate["approvalSource"] = SOURCE

    decision = {
        "schemaVersion": 1, "sourceHead": head, "decidedAtUtc": decided_utc, "decidedAtJst": decided_jst,
        "decisionText": DECISION_TEXT, "decisionSource": SOURCE, "decisionScope": SCOPE,
        "candidateSelectionBasis": "AI recommendation reviewed and adopted by the user",
        "supersedableBeforeReleaseCandidate": True, "selectionCount": len(records), "recommendationMatchCount": len(records),
        "missingSelectionCount": 0, "duplicateSelectionCount": 0, "unknownAssetGroupCount": 0, "unknownCandidateLetterCount": 0,
        "selections": records,
    }
    index["sourceHead"] = head; index["humanReviewStatus"] = "approved"; index["recommendationIsApproval"] = False
    index["humanDecisionSource"] = SOURCE; index["humanDecisionText"] = DECISION_TEXT
    manifest["sourceHead"] = head; manifest["packStatus"] = "HUMAN_APPROVED_PRODUCTION_CONNECTION_PENDING"
    manifest["approvedAsFinalCount"] = 46; manifest["runtimeApprovedCount"] = 0; manifest["humanApprovedCount"] = 46
    manifest["blockers"] = [{"assetKey": "all", "reason": "PRODUCTION_VISUAL_CONNECTION_REQUIRED"}]
    readiness.update({
        "sourceHead": head, "status": "HUMAN_APPROVED_PRODUCTION_CONNECTION_PENDING",
        "approvedProductionAssetSetAvailable": False, "productionVisualAssetProviderConnected": False,
        "runtimeVisualReady": False, "simulatorReady": False, "completionBlocked": True,
        "blockers": ["PRODUCTION_VISUAL_CONNECTION_REQUIRED"], "blockReason": "PRODUCTION_VISUAL_CONNECTION_REQUIRED",
    })
    summary = {
        "schemaVersion": 1, "decisionSource": SOURCE, "decisionText": DECISION_TEXT,
        "decidedAtUtc": decided_utc, "decidedAtJst": decided_jst, "selectionSource": str(DECISION.relative_to(ROOT)),
        "selectionCount": 46, "recommendationMatchCount": 46, "humanApprovedCandidateCount": 46,
        "approvedAsFinalCount": 46, "runtimeApprovedCount": 0, "productionConnectedCount": 0,
        "nonSelectedCandidateCount": 138, "nonSelectedApprovedAsFinalCount": 0, "nonSelectedRuntimeApprovedCount": 0,
        "productionConnectionStatus": "pending",
    }
    write(DECISION, decision); write(SUMMARY, summary); write(INDEX, index); write(MANIFEST, manifest); write(READINESS, readiness)
    lines = [
        "# U48 human asset approval — 2026-07-21", "", f"決定: **{DECISION_TEXT}**", "",
        f"- decision source: `{SOURCE}`", f"- decision scope: `{SCOPE}`", f"- UTC: `{decided_utc}`", f"- JST: `{decided_jst}`",
        "- RC前の重大問題時は差し替え可能", "- この記録だけではruntime approval・アプリ全体のproduction approvalを付与しない", "",
        "## Human-approved selections", "",
    ]
    lines.extend(f"- `{record['assetGroup']}`: `{record['selectedCandidateId']}` ({record['selectedLetter']})" for record in records)
    lines.extend(["", "## Current boundary", "", "Selected 46 candidates are `approvedAsFinal=true` and `runtimeApproved=false`. Production connection and Simulator verification remain pending.", ""])
    DOC.write_text("\n".join(lines))
    print("U48 human selection recorded: 46/46 recommendations adopted; runtime approval remains false.")


if __name__ == "__main__": main()
