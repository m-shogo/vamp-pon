#!/usr/bin/env python3
"""Deterministically slice the selected U46 candidate atlas into textless UI parts."""

from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "docs/design-targets/generated/unity-u46/ui-generation/u46-ui-kit-candidate-02-alpha.png"
OUT = ROOT / "unity/VampPonUnity/Assets/_Project/Resources/U46Candidates/UI"

PARTS = {
    "Result/u46-result-memory-page.png": (48, 36, 574, 314),
    "Result/u46-result-rank-seal.png": (608, 44, 805, 274),
    "Result/u46-result-stat-chip.png": (827, 117, 1030, 236),
    "Result/u46-result-reward-card.png": (1095, 520, 1262, 744),
    "Result/u46-result-new-record-row.png": (48, 326, 764, 452),
    "Result/u46-result-divider.png": (826, 329, 1468, 381),
    "Result/u46-result-primary-button.png": (823, 391, 1142, 498),
    "Result/u46-result-secondary-button.png": (1163, 391, 1470, 498),
    "Collection/u46-collection-page.png": (48, 482, 516, 742),
    "Collection/u46-collection-tab-active.png": (542, 508, 798, 600),
    "Collection/u46-collection-tab-inactive.png": (805, 508, 1048, 600),
    "Collection/u46-collection-entry-card.png": (1093, 512, 1267, 750),
    "Collection/u46-collection-entry-locked.png": (1272, 512, 1464, 750),
    "Collection/u46-collection-paper-clip.png": (67, 740, 125, 868),
    "Collection/u46-collection-progress-track.png": (298, 795, 753, 870),
    "Collection/u46-collection-progress-fill.png": (298, 742, 753, 811),
    "Collection/u46-collection-new-badge.png": (150, 742, 261, 865),
    "Collection/u46-collection-bottom-nav.png": (47, 882, 1215, 1004),
    "Common/u46-paper-shadow.png": (920, 742, 1098, 860),
    "Common/u46-warm-lantern-accent.png": (1110, 730, 1230, 880),
    "Common/u46-ink-corner.png": (1238, 738, 1375, 879),
    "Common/u46-page-edge.png": (1392, 735, 1485, 882),
}


def main() -> None:
    image = Image.open(SOURCE).convert("RGBA")
    for relative, box in PARTS.items():
        target = OUT / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        crop = image.crop(box)
        alpha_bbox = crop.getchannel("A").getbbox()
        if alpha_bbox:
            crop = crop.crop(alpha_bbox)
        padded = Image.new("RGBA", (crop.width + 16, crop.height + 16))
        padded.alpha_composite(crop, (8, 8))
        padded.save(target, optimize=True)
        print(f"{target.relative_to(ROOT)} {padded.width}x{padded.height}")


if __name__ == "__main__":
    main()
