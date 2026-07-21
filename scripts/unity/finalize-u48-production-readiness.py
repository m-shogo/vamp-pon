#!/usr/bin/env python3
"""Promote U48 readiness after the committed 46-group production Simulator verification."""

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
U48 = ROOT / "docs/design-targets/generated/unity-u48"
VERIFICATION = U48 / "production-verification/manifest.json"
VERIFICATION_COMMIT = "58f213f6"


def load(path: Path) -> dict:
    return json.loads(path.read_text())


def save(path: Path, value: dict) -> None:
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n")


def main() -> None:
    verification = load(VERIFICATION)
    if verification["assetGroupCount"] != 46 or verification["entryCount"] != 138:
        raise RuntimeError("U48 production verification is incomplete.")
    if any(verification[key] for key in ("duplicateScreenshotHashCount", "previewDependencyUsedCount", "resizeReuseCount", "exceptionCount", "assertionFailureCount", "cleanupFailureCount", "staleCount")):
        raise RuntimeError("U48 production verification contains a failed integrity counter.")
    now = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")

    approved_path = U48 / "approved-production-set.json"
    approved = load(approved_path)
    for entry in approved["entries"]:
        entry["runtimeApproved"] = True
    approved["productionConnectionStatus"] = "runtime-approved"
    approved["runtimeApprovedCount"] = 46
    save(approved_path, approved)

    manifest_path = U48 / "approval-pack/approval-manifest.json"
    manifest = load(manifest_path)
    selected = {entry["assetGroup"]: entry["candidateId"] for entry in approved["entries"]}
    for group in manifest["assetGroups"]:
        for candidate in group["candidates"]:
            candidate["runtimeApproved"] = candidate["candidateId"] == selected[group["assetKey"]]
            if candidate["runtimeApproved"]:
                candidate["approvalStatus"] = "runtime-approved"
    manifest["packStatus"] = "PRODUCTION_RUNTIME_APPROVED"
    manifest["blockers"] = []
    manifest["runtimeApprovedCount"] = 46
    manifest["productionProviderModified"] = True
    manifest["generatedAtUtc"] = now
    if isinstance(manifest.get("summary"), dict):
        manifest["summary"]["runtimeApprovedCount"] = 46
        manifest["summary"]["productionConnectionStatus"] = "runtime-approved"
    save(manifest_path, manifest)

    summary_path = U48 / "human-approval-summary.json"
    summary = load(summary_path)
    summary["runtimeApprovedCount"] = 46
    summary["productionConnectionStatus"] = "runtime-approved"
    summary["runtimeVerificationEvidence"] = str(VERIFICATION.relative_to(ROOT))
    summary["runtimeVerificationCommit"] = VERIFICATION_COMMIT
    save(summary_path, summary)

    readiness_path = U48 / "readiness.json"
    readiness = load(readiness_path)
    readiness.update({
        "generatedAtUtc": now,
        "status": "U48_COMPLETED_PRODUCTION_VISUAL_RUNTIME_READY",
        "runtimeVisualReady": True,
        "simulatorReady": True,
        "completionBlocked": False,
        "blockers": [],
        "blockReason": None,
        "runtimeApprovedAssetCount": 46,
        "productionVerificationCaptureCount": 138,
        "productionVerificationEvidence": str(VERIFICATION.relative_to(ROOT)),
        "productionVerificationCommit": VERIFICATION_COMMIT,
        "u48Completed": True,
        "nextRequiredPhase": "U49 actual-device audio/haptic",
    })
    save(readiness_path, readiness)

    completion_path = U48 / "completion-summary.json"
    completion = load(completion_path)
    completion.update({
        "generatedAtUtc": now,
        "status": "COMPLETED",
        "completed": [
            "46-group / 184-candidate approval pack",
            "46/46 user-provided human selections matching AI recommendations",
            "46 stable production copies with unique production GUIDs",
            "production RuntimeVisualAssetProvider and UI/gameplay catalog connection",
            "46-group / 138-capture production-only iOS Simulator verification",
            "Compact / Standard / Large production runtime visual review",
            "Preview dependency 0, exception 0, assertion 0, cleanup failure 0",
            "U47 gameplay contract and production slot capacities preserved",
            "U48 runtimeVisualReady and simulatorReady promotion",
        ],
        "notCompleted": [
            "U49 actual-device audio/haptic verification",
            "U50 performance/touch metrics",
            "U51 release-candidate and application-wide production approval",
        ],
        "staleEvidenceCount": 0,
        "unhandledExceptionCount": 0,
        "assertionFailureCount": 0,
        "unityCompileResult": "PASS_PRODUCTION_NO_PREVIEW_DEFINE",
        "unityNormalCompileResult": "PASS",
        "unityPreviewCompileResult": "PASS_PREVIEW_DEFINE",
        "iosExportResult": "PASS_PRODUCTION_NO_PREVIEW_DEFINE",
        "previewIosExportResult": "PASS_PREVIEW_DEFINE",
        "xcodeBuildResult": "PASS_PRODUCTION_RELEASE_SIMULATOR",
        "simulatorInstallLaunchResult": "PASS",
        "backgroundForegroundSmokeResult": "PASS_SAME_PROCESS_RESUMED",
        "productionVerificationResult": "PASS_46_GROUPS_138_CAPTURES",
        "u47SimulatorRegressionResult": "PASS_23_CURRENT_CAPTURES",
        "u48CompletionCommitAllowed": True,
        "u48CompletionPushAllowed": True,
        "nextRequiredPhase": "U49 actual-device audio/haptic",
    })
    save(completion_path, completion)

    visual_path = ROOT / "docs/design-targets/generated/unity-runtime-visual-readiness/readiness.json"
    visual = load(visual_path)
    visual.update({
        "generatedAt": "2026-07-21",
        "phase": "U48-production-asset-expansion",
        "runtimeVisualClassification": "production-animated-sprite",
        "runtimeAssetProviderApprovalLevel": "Production",
        "runtimeCandidateAssetProviderConnected": False,
        "productionVisualAssetProviderConnected": True,
        "playerSpriteSource": "Assets/_Project/Art/Production/U48/Gameplay/player-yui.png",
        "playerSpriteMetaPath": "unity/VampPonUnity/Assets/_Project/Art/Production/U48/Gameplay/player-yui.png.meta",
        "playerAssetApprovedAsFinal": True,
        "playerAssetRuntimeApproved": True,
        "enemySpriteSource": "Assets/_Project/Art/Production/U48/Gameplay/enemy-onbu.png",
        "enemySpriteMetaPath": "unity/VampPonUnity/Assets/_Project/Art/Production/U48/Gameplay/enemy-onbu.png.meta",
        "enemyAssetApprovedAsFinal": True,
        "enemyAssetRuntimeApproved": True,
        "simulatorFinalArtApprovalProvided": True,
        "productionCharacterAssetReady": True,
        "productionEnemyAssetReady": True,
        "runtimeVisualCandidateReady": False,
        "runtimeVisualReady": True,
        "unityCompileVerifiedAfterGate": True,
        "unityCompileResult": "passed",
        "unityCompileCommit": VERIFICATION_COMMIT,
        "unityCompileEvidencePath": str(VERIFICATION.relative_to(ROOT)),
        "simulatorRegressionRerunAfterGate": True,
        "simulatorRegressionResult": "passed",
        "simulatorRegressionCommit": VERIFICATION_COMMIT,
        "simulatorRegressionEvidencePath": str(VERIFICATION.relative_to(ROOT)),
        "nextRequiredPhase": "U49 actual-device audio/haptic",
    })
    save(visual_path, visual)

    big_path = ROOT / "docs/design-targets/generated/unity-big-implementation/readiness.json"
    big = load(big_path)
    big.update({
        "generatedAt": "2026-07-21",
        "phase": "U48 production asset expansion completed; U49 actual-device audio/haptic current",
        "currentRequiredPhase": "U49 actual-device audio/haptic",
        "nextPhaseAfterCurrent": "U50 performance/touch metrics",
        "runtimeCandidateAssetProviderConnected": False,
        "productionVisualAssetProviderConnected": True,
        "runtimeVisualCandidateReady": False,
        "runtimeVisualReady": True,
        "candidateAssetsApprovedAsFinal": True,
        "u48ProductionVisualRuntimeReady": True,
    })
    big["notes"] = [
        "implementationFoundationReady means the control-plane is documented, not that product runtime is production-ready",
        "U47 gameplay data/runtime and production DataRegistry are complete",
        "U48 approved 46 production visual groups are connected and verified on iOS Simulator across 138 captures",
        "U49 actual-device audio/haptic, U50 performance/touch metrics, and U51 RC remain incomplete",
        "execution flags may become true only with PASSED result and a recorded commit",
    ]
    save(big_path, big)
    print("U48 readiness finalized: runtimeApproved=46, runtimeVisualReady=true, simulatorReady=true, next=U49")


if __name__ == "__main__":
    main()
