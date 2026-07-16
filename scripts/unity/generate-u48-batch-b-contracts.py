#!/usr/bin/env python3
"""Generate U48 Batch B baseline audit, Golden References, prompts, recipes, and contracts."""

from __future__ import annotations

import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
EVIDENCE = ROOT / "docs/design-targets/generated/unity-u48/batch-b"
CANDIDATE_ROOT = "unity/VampPonUnity/Assets/_Project/Art/Candidates/U48/BatchB"
SOURCE_HEAD = "b69a64095a580077327d49daac009a69c81efaa5"
TOOL = "scripts/unity/build-u48-batch-b-candidates.py"
TOOL_VERSION = "1"
INK = "unity/VampPonUnity/Assets/_Project/Resources/RuntimeVisuals/Stage1/Common/runtime-ink-burst.png"


def sha(path: str) -> str:
    return hashlib.sha256((ROOT / path).read_bytes()).hexdigest()


def write_json(path: Path, value: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n")


GROUPS = {
    "ground-area-black-ink-bottle": {
        "definition": "black_ink_bottle", "phase": None, "status": "composite",
        "references": [
            ("docs/88-adopted-visual-direction.md", "worldbuilding"),
            ("docs/black-ink-bottle-prototype-qa.md", "shape"),
            ("docs/ui/inventory-icon-design-bible.md", "shape"),
            ("docs/design-targets/generated/unity-u47/simulator-smoke/screenshots/08-black-ink-area.png", "runtime-size"),
            (INK, "runtime-baseline"),
        ],
        "inherit": ["小瓶から漏れた小さく濃い黒インク", "重く粘るにじみ", "紙への吸収", "通常武器相当の静かな強度"],
        "doNotInherit": ["streetlampの暖色輪", "dawnの広い朝光", "pickup actor", "現行共通spriteのcandidate承認状態"],
        "readability": ["radius 0.52へvisualを合わせる", "enemy/player/projectile/pickupを隠さない", "DoT tickとdurationを動きで読める"],
        "prohibited": ["単純な色付きdisc", "pickup中心icon", "大きな白発光", "HUD前面"],
        "candidates": [
            ("a-runtime-baseline", "runtime-baseline", "reconstructed", "runtime common ink spriteを180pxへ正規化したbaseline"),
            ("b-irregular-ink-blot", "shape-distinction", "procedural-authored", "不規則な小型ink blotと滴"),
            ("c-breathing-ink-edge", "motion-readability", "procedural-authored", "脈動を示す二重の吸収edge"),
            ("d-paper-absorption-bottle", "worldbuilding-integration", "procedural-authored", "紙吸収と小瓶motifを統合"),
        ],
    },
    "ground-area-streetlamp-ring": {
        "definition": "streetlamp_ring", "phase": None, "status": "composite",
        "references": [
            ("docs/88-adopted-visual-direction.md", "worldbuilding"),
            ("docs/streetlamp-ring-prototype-qa.md", "shape"),
            ("docs/ui/inventory-icon-design-bible.md", "shape"),
            ("docs/design-targets/generated/unity-u47/simulator-smoke/screenshots/09-streetlamp-area.png", "runtime-size"),
            (INK, "runtime-baseline"),
        ],
        "inherit": ["紙上へ落ちる暖色の街灯輪", "black inkの薄い影", "輪郭のある通常武器"],
        "doNotInherit": ["black inkの色違いだけ", "dawnの進化強度", "neon/SF表現", "現行共通spriteのcandidate承認状態"],
        "readability": ["radius 0.64へvisualを合わせる", "black inkより明るくdawnより弱い", "broken circumferenceでも作用域を読める"],
        "prohibited": ["完全なneon円", "過剰な白発光", "進化武器より強い表現", "HUD前面"],
        "candidates": [
            ("a-runtime-baseline", "runtime-baseline", "reconstructed", "共通ink spriteの現行tint/scale運用を正規化"),
            ("b-defined-lantern-ring", "shape-distinction", "procedural-authored", "街灯輪の明確な節と灯芯"),
            ("c-broken-paper-light", "motion-readability", "procedural-authored", "紙切れ状のbroken light circumference"),
            ("d-ink-shadow-warm-light", "worldbuilding-integration", "procedural-authored", "外周ink shadowと内周warm light"),
        ],
    },
    "ground-area-dawn-ink-lamp": {
        "definition": "dawn_ink_lamp", "phase": None, "status": "composite",
        "references": [
            ("docs/88-adopted-visual-direction.md", "worldbuilding"),
            ("docs/black-ink-bottle-prototype-qa.md", "evolution"),
            ("docs/streetlamp-ring-prototype-qa.md", "evolution"),
            ("docs/pixel-art-generation-prompts.md", "shape"),
            ("docs/design-targets/generated/unity-u47/simulator-smoke/screenshots/11-dawn-ink-lamp.png", "runtime-size"),
            (INK, "runtime-baseline"),
        ],
        "inherit": ["black inkとstreetlampの合体", "黒・灯り・朝色の三層", "三種中最大で最強の輪"],
        "doNotInherit": ["素材武器の単純拡大", "全画面flash", "UI modal枠", "現行共通spriteのcandidate承認状態"],
        "readability": ["radius 1.28へvisualを合わせる", "evolutionの強さを示しつつactorを隠さない", "広い輪でも中央視界を保つ"],
        "prohibited": ["単純2倍scale", "全画面白flash", "高輝度の塗りつぶし", "固定UI枠"],
        "candidates": [
            ("a-runtime-baseline", "runtime-baseline", "reconstructed", "共通ink spriteの現行evolution tint/scale運用を正規化"),
            ("b-dual-layer-ink-light", "shape-distinction", "procedural-authored", "inkとlightの二層ring"),
            ("c-dawn-paper-rays", "motion-readability", "procedural-authored", "朝色の紙rayと呼吸する外周"),
            ("d-lamp-wide-dawn-ring", "worldbuilding-integration", "procedural-authored", "central lamp markと広いink dawn ring"),
        ],
    },
    "kokuyou-charging": {
        "definition": None, "phase": "Charging", "status": "composite",
        "references": [("docs/88-adopted-visual-direction.md", "worldbuilding"), ("docs/design-targets/final/kokuyou-cutin-final.png", "color"), ("docs/unity-u24-kokuyou-climax-visual-target-alignment-2026-07-01.md", "motion"), ("docs/design-targets/generated/unity-u47/simulator-smoke/screenshots/16-kokuyou-charging.png", "runtime-size")],
        "inherit": ["低強度の黒インクと影の集積", "通常playを邪魔しない", "理性が静かに揺らぐ"],
        "doNotInherit": ["activeの強さ", "phase文字そのもの", "cutinの全画面構図"],
        "readability": ["phase文字なしでもchargingと通常を最低限区別", "player identityとHUDを維持", "damage gaugeの進行と連続する"],
        "prohibited": ["可愛い目", "コミカルな表情", "汎用紫オーラだけ", "強い点滅"],
        "candidates": [("a-runtime-baseline", "runtime-baseline", "reconstructed", "文字のみbaselineへ添える最小ink影"), ("b-small-ink-wisps", "shape-distinction", "procedural-authored", "小さなink wisps"), ("c-lantern-shadow-flicker", "motion-readability", "procedural-authored", "lantern shadowの抑制flicker"), ("d-paper-edge-corruption", "worldbuilding-integration", "procedural-authored", "紙縁の侵食")],
    },
    "kokuyou-ready": {
        "definition": None, "phase": "Ready", "status": "composite",
        "references": [("docs/88-adopted-visual-direction.md", "worldbuilding"), ("docs/design-targets/final/kokuyou-cutin-final.png", "color"), ("docs/unity-u24-kokuyou-climax-visual-target-alignment-2026-07-01.md", "motion"), ("docs/design-targets/generated/unity-u47/simulator-smoke/screenshots/17-kokuyou-ready.png", "runtime-size")],
        "inherit": ["発動可能の緊張", "完成した暗い輪", "active未満の強度"], "doNotInherit": ["activeの黒炎量", "phase文字そのもの", "全画面cutin"],
        "readability": ["chargingとの差を明確にする", "manual activation可能性を静かなpulseで示す", "HUDとplayer silhouetteを維持"],
        "prohibited": ["可愛い目", "過剰点滅", "active以上の強度", "汎用紫オーラだけ"],
        "candidates": [("a-runtime-baseline", "runtime-baseline", "reconstructed", "文字のみbaselineへ添える閉じた暗輪"), ("b-complete-dark-ring", "shape-distinction", "procedural-authored", "complete dark ring"), ("c-restrained-black-flame-crown", "motion-readability", "procedural-authored", "抑えた黒炎冠"), ("d-lantern-inversion-pulse", "worldbuilding-integration", "procedural-authored", "反転lanternとready pulse")],
    },
    "kokuyou-active": {
        "definition": None, "phase": "Active", "status": "composite",
        "references": [("docs/88-adopted-visual-direction.md", "worldbuilding"), ("docs/design-targets/final/kokuyou-cutin-final.png", "color"), ("docs/unity-u24-kokuyou-climax-visual-target-alignment-2026-07-01.md", "motion"), ("docs/design-targets/generated/unity-u47/simulator-smoke/screenshots/18-kokuyou-active.png", "runtime-size")],
        "inherit": ["黒炎と邪念", "通常との差が最大", "player本人のsilhouette保持"], "doNotInherit": ["可愛い目", "cutinの全画面占有", "汎用紫オーラ"],
        "readability": ["damage multiplier中と分かる", "enemy/projectile/pickup/ground-areaを隠さない", "長時間でも視認負荷を抑える"],
        "prohibited": ["コミカルな暴走", "全画面白flash", "player identity消失", "高頻度点滅"],
        "candidates": [("a-runtime-baseline", "runtime-baseline", "reconstructed", "文字のみbaselineへ添える強いink aura"), ("b-controlled-black-flame", "shape-distinction", "procedural-authored", "controlled black flame"), ("c-ink-fracture-aura", "motion-readability", "procedural-authored", "ink fracture aura"), ("d-lantern-eclipse-paper-distortion", "worldbuilding-integration", "procedural-authored", "lantern eclipseと紙歪み")],
    },
    "kokuyou-recovery": {
        "definition": None, "phase": "Recovery", "status": "composite",
        "references": [("docs/88-adopted-visual-direction.md", "worldbuilding"), ("docs/design-targets/final/kokuyou-cutin-final.png", "color"), ("docs/unity-u24-kokuyou-climax-visual-target-alignment-2026-07-01.md", "motion"), ("docs/design-targets/generated/unity-u47/simulator-smoke/screenshots/19-kokuyou-recovery.png", "runtime-size")],
        "inherit": ["active後の疲労と重さ", "短い煤とink残滓", "通常復帰への自然な減衰"], "doNotInherit": ["chargingの集積方向", "activeの強さ", "phase文字そのもの"],
        "readability": ["chargingへ戻ったと誤認しない", "slow中の重さを示す", "normal復帰後に残留しない"],
        "prohibited": ["可愛い目", "active同等の炎", "永続残留", "汎用紫オーラだけ"],
        "candidates": [("a-runtime-baseline", "runtime-baseline", "reconstructed", "文字のみbaselineへ添える弱い煤残り"), ("b-fading-soot", "shape-distinction", "procedural-authored", "fading soot"), ("c-dragging-ink-shadow", "motion-readability", "procedural-authored", "dragging ink shadow"), ("d-dim-lantern-paper-ash", "worldbuilding-integration", "procedural-authored", "dim lanternとpaper ash")],
    },
}


def baseline_audit() -> dict:
    meta = INK + ".meta"
    common = {
        "spriteSourcePath": INK, "contentSha256": sha(INK), "metaPath": meta, "metaSha256": sha(meta),
        "sourceDimensions": [1254, 1254], "pixelsPerUnit": 180, "pivot": [0.5, 0.5], "filterMode": "Point",
        "compression": "None", "mipmap": False, "sortingLayer": "Default", "sortingOrder": 8,
        "material": "SpriteRenderer default", "animation": "none", "spawnVisual": "immediate enable",
        "despawnVisual": "immediate disable after duration", "dotTickVisual": "none",
    }
    ground = []
    for definition, radius, dps, ticks, duration, tint in [
        ("black_ink_bottle", .52, 8, 9, 2.3, [.035, .02, .03, .55]),
        ("streetlamp_ring", .64, 6, 13, 3.2, [1, .58, .18, .34]),
        ("dawn_ink_lamp", 1.28, 28, 25, 6.5, [.45, .18, .12, .46]),
    ]:
        ground.append({"definitionId": definition, **common, "visualScaleFormula": "Vector3.one * max(0.25, gameplayRadius * 2)", "visualScale": radius * 2, "alpha": tint[3], "tint": tint, "gameplayRadius": radius, "damagePerSecond": dps, "tickInterval": .25, "finalTickCount": ticks, "duration": duration, "lifetimeMatchesGameplayDuration": True})
    return {
        "schemaVersion": 1, "sourceHead": SOURCE_HEAD,
        "groundArea": {"summary": "三種とも同一candidate runtime-ink-burst spriteをweapon別tintとgameplay radius由来scaleで区別する。専用animation、spawn/despawn transition、DoT tick visualはない。", "sharedElements": ["sprite", "material", "pivot", "PPU", "sorting order", "instant spawn/despawn"], "entries": ground},
        "kokuyou": {
            "summary": "U47 production runtimeはInventory HUDのphase文字だけを表示し、専用player sprite変化/aura/trail/screen overlay/camera/post-process/material/particleを持たない。",
            "chargingVisual": "HUD phase text only", "readyVisual": "HUD phase text only", "activeVisual": "HUD phase text only", "recoveryVisual": "HUD phase text only",
            "playerSpriteChange": "none", "aura": "none", "trail": "none", "screenOverlay": "none", "hudGauge": "text gauge", "phaseText": True,
            "cameraOrPostProcess": "none", "material": "none", "particle": "none", "phaseTransitionOwner": "KokuyouRuntimeController", "cleanup": "state reset to Idle; no dedicated visual object exists", "normalReturn": True,
            "baselineDeficiency": "phase文字だけではcandidate visualとして数えられない。Batch B candidate Aはこの不足を明記したreconstructed-partial visual proxyであり、既存production visualとは扱わない。",
        },
    }


def main() -> None:
    EVIDENCE.mkdir(parents=True, exist_ok=True)
    write_json(EVIDENCE / "runtime-baseline-audit.json", baseline_audit())
    golden_entries = []
    recipes = []
    contracts = []
    now = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    for group, spec in GROUPS.items():
        golden_entries.append({
            "assetGroup": group, "goldenReferenceStatus": spec["status"],
            "references": [{"path": path, "sha256": sha(path), "role": role} for path, role in spec["references"]],
            "inherit": spec["inherit"], "doNotInherit": spec["doNotInherit"],
            "runtimeReadabilityContract": spec["readability"], "prohibitedExpressions": spec["prohibited"],
            "approvedForRuntime": False, "humanApprovedGoldenReference": False,
        })
        for suffix, role, source_type, recipe_text in spec["candidates"]:
            candidate = f"{group}-{suffix}"
            prompt_path = EVIDENCE / "prompts" / f"{candidate}.txt"
            prompt_path.parent.mkdir(parents=True, exist_ok=True)
            prompt = f"U48 Batch B / {group} / {candidate}\n{recipe_text}\nInherit: {'; '.join(spec['inherit'])}\nAvoid: {'; '.join(spec['prohibited'])}\nTextless transparent 180x180 PNG RGBA, Point filter, no edge contact.\n"
            prompt_path.write_text(prompt)
            recipe_id = f"batch-b:{candidate}:v1"
            recipes.append({"recipeId": recipe_id, "candidateId": candidate, "operation": recipe_text, "canvas": [180, 180], "seed": int(hashlib.sha256(candidate.encode()).hexdigest()[:8], 16), "deterministic": True})
            output_path = f"{CANDIDATE_ROOT}/{group}/{candidate}.png"
            output = ROOT / output_path
            parent_paths = [INK] if group.startswith("ground-area") or suffix.startswith("a-") else [path for path, _ in spec["references"] if path.endswith(".png")][:1]
            contracts.append({
                "schemaVersion": 1, "assetGroup": group, "candidateId": candidate, "candidateRole": role,
                "sourceType": source_type, "goldenReferencePaths": [path for path, _ in spec["references"]],
                "goldenReferenceSha256": [sha(path) for path, _ in spec["references"]],
                "parentSourcePaths": parent_paths, "parentSourceSha256": [sha(path) for path in parent_paths],
                "generationTool": TOOL, "generationToolVersion": TOOL_VERSION,
                "recipePath": "docs/design-targets/generated/unity-u48/batch-b/generation-recipes.json",
                "recipeId": recipe_id, "promptPath": str(prompt_path.relative_to(ROOT)), "promptSha256": sha(str(prompt_path.relative_to(ROOT))),
                "createdAtUtc": now if output.exists() else None, "outputPath": output_path, "outputSha256": sha(output_path) if output.exists() else None,
                "targetImportContract": {"format": "PNG RGBA", "dimensions": [180, 180], "pixelsPerUnit": 180, "pivot": [0.5, 0.5], "filterMode": "Point", "compression": "None", "mipmap": False},
                "runtimeContract": {"definitionId": spec["definition"], "kokuyouPhase": spec["phase"], "previewOnly": True, "gameplayValuesUnchanged": True, "productionProviderUnchanged": True},
                "automaticQaContract": ["exists", "png-rgba", "alpha", "180x180", "unique-content-sha", "unique-guid", "point", "mipmap-off", "compression-none", "finite-non-empty-bounds", "no-edge-contact", "gameplay-size-live-review"],
                "lineageStatus": ("reconstructed-partial" if source_type == "reconstructed" else "complete") if output.exists() else "unknown",
                "humanReviewStatus": "pending", "approvedAsFinal": False, "runtimeApproved": False,
            })
    write_json(EVIDENCE / "golden-references.json", {"schemaVersion": 1, "sourceHead": SOURCE_HEAD, "batch": "B", "entries": golden_entries})
    write_json(EVIDENCE / "generation-recipes.json", {"schemaVersion": 1, "sourceHead": SOURCE_HEAD, "tool": TOOL, "toolVersion": TOOL_VERSION, "recipes": recipes})
    write_json(EVIDENCE / "generation-contracts.json", {"schemaVersion": 1, "sourceHead": SOURCE_HEAD, "batch": "B", "generatedAtUtc": now, "candidateCount": len(contracts), "contracts": contracts})
    print(f"U48 Batch B contracts generated: {len(golden_entries)} groups, {len(contracts)} candidates")


if __name__ == "__main__":
    main()
