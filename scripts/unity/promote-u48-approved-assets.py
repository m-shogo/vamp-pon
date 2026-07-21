#!/usr/bin/env python3
"""Copy the 46 human-approved sources to stable U48 production paths."""

from __future__ import annotations

import hashlib
import json
import shutil
import uuid
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
DECISION = ROOT / "docs/design-targets/generated/unity-u48/human-selection-decision.json"
OUT = ROOT / "docs/design-targets/generated/unity-u48/approved-production-set.json"
AUDIT = ROOT / "docs/design-targets/generated/unity-u48/production-promotion-audit.json"
UNITY_ROOT = ROOT / "unity/VampPonUnity/Assets/_Project/Art/Production/U48"
GAMEPLAY_GROUPS = {
    "player-yui", "enemy-onbu", "stage1-background", "pickup-exp", "pickup-healing", "common-projectile", "hit-effect",
    "enemy-death-effect", "movement-trail", "ground-area-black-ink-bottle", "ground-area-streetlamp-ring",
    "ground-area-dawn-ink-lamp", "kokuyou-charging", "kokuyou-ready", "kokuyou-active", "kokuyou-recovery",
}


def read(path: Path) -> dict: return json.loads(path.read_text())
def write(path: Path, value: dict) -> None: path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n")
def sha(path: Path) -> str: return hashlib.sha256(path.read_bytes()).hexdigest()


def contract_index() -> dict[str, dict]:
    result = {}
    for path in sorted((ROOT / "docs/design-targets/generated/unity-u48").glob("batch-*/generation-contracts.json")):
        for contract in read(path)["contracts"]: result[contract["candidateId"]] = contract
    return result


def new_guid(group: str) -> str:
    return uuid.uuid5(uuid.NAMESPACE_URL, f"https://github.com/m-shogo/vamp-pon/u48-production/{group}").hex


def main() -> None:
    decision = read(DECISION); contracts = contract_index(); entries = []
    for selection in decision["selections"]:
        group = selection["assetGroup"]; source = ROOT / selection["sourcePath"]
        category = "Gameplay" if group in GAMEPLAY_GROUPS else "UI"
        destination = UNITY_ROOT / category / f"{group}.png"
        destination.parent.mkdir(parents=True, exist_ok=True); shutil.copy2(source, destination)
        source_meta = Path(str(source) + ".meta"); destination_meta = Path(str(destination) + ".meta")
        if not source_meta.is_file(): raise RuntimeError(f"Candidate meta missing: {source_meta}")
        meta = source_meta.read_text().splitlines()
        candidate_guid = next(line.split(": ", 1)[1] for line in meta if line.startswith("guid: "))
        production_guid = new_guid(group)
        if candidate_guid == production_guid: raise RuntimeError(f"Production GUID reused candidate GUID: {group}")
        destination_meta.write_text("\n".join(f"guid: {production_guid}" if line.startswith("guid: ") else line for line in meta) + "\n")
        contract = contracts.get(selection["selectedCandidateId"])
        if contract is None: raise RuntimeError(f"Generation contract missing: {selection['selectedCandidateId']}")
        relative_destination = str(destination.relative_to(ROOT))
        entries.append({
            "assetGroup": group, "candidateId": selection["selectedCandidateId"],
            "candidateSourcePath": selection["sourcePath"], "candidateSourceSha256": selection["sourceSha256"],
            "productionPath": relative_destination, "productionSha256": sha(destination), "productionGuid": production_guid,
            "candidateGuid": candidate_guid, "importContract": contract["targetImportContract"],
            "humanApproved": True, "approvedAsFinal": True, "runtimeApproved": False,
            "productionConnected": False, "runtimeProviderKey": group,
        })
    if len(entries) != 46 or len({entry["productionPath"] for entry in entries}) != 46: raise RuntimeError("Production destination mapping is incomplete or duplicated.")
    write(OUT, {
        "schemaVersion": 1, "selectionSource": str(DECISION.relative_to(ROOT)), "assetGroupCount": 46,
        "selectedCandidateCount": 46, "gameplayGroupCount": 16, "uiGroupCount": 30,
        "productionConnectionStatus": "pending", "runtimeApprovedCount": 0, "productionConnectedCount": 0,
        "entries": entries,
    })
    write(AUDIT, {
        "schemaVersion": 1, "currentProductionSource": "Assets/_Project/Resources/RuntimeVisuals/Stage1 and AppQualityAssetProvider",
        "ownerComponents": ["RuntimeVisualAssetProvider", "AppQualityAssetProvider", "U46ScreenFactory", "U4LevelUpOverlay"],
        "providerKeyStrategy": "stable asset-group ID", "destinationRoot": "unity/VampPonUnity/Assets/_Project/Art/Production/U48",
        "importSettingsStrategy": "copy approved candidate TextureImporter settings; replace GUID only",
        "guidStrategy": "deterministic UUIDv5 per stable asset group; candidate GUID is never reused",
        "atlasStrategy": "no SpriteAtlas is currently used; direct imported Sprite references through production provider",
        "bindingStrategy": "Resources production catalog plus stable provider keys; no preview define/environment selector",
        "rollbackSource": "immutable candidate source plus approved-production-set source/destination hashes",
        "currentFallback": "candidate RuntimeVisualAssetProvider and AppQualityAssetProvider before connection checkpoint",
        "requiredCheckers": ["unity:u48-human-selection:check", "unity:u48-approved-production-set:check", "unity:u48-production-visual-connection:check"],
        "candidateSourcesImmutable": True, "candidateGuidReused": False, "productionPathDependsOnCandidateId": False,
        "gameplayGroupCount": 16, "uiGroupCount": 30,
    })
    print("U48 approved assets promoted: gameplay=16, UI=30, stable paths=46, GUIDs=46.")


if __name__ == "__main__": main()
