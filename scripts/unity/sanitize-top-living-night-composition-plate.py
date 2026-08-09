#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageStat

ROOT = Path(__file__).resolve().parents[2]
BRIDGE = ROOT / "docs/design-targets/generated/top-living-night-v2/previews/top-living-night-layered-candidate-430x932.png"
LAYER_ROOT = ROOT / "docs/design-targets/generated/top-living-night-v2/layers"
OUTPUT_DIR = ROOT / "docs/design-targets/generated/top-living-night-v3/preproduction"
DIAGNOSTIC_DIR = ROOT / "docs/design-targets/generated/top-living-night-v3/diagnostics"
CLEAN_PLATE = OUTPUT_DIR / "core5-clean-composition-plate-v1.png"
MASK_PREVIEW = DIAGNOSTIC_DIR / "bridge-human-removal-mask-v1.png"
TARGET_SIZE = (430, 932)
HUMAN_MASK_LAYERS = (
    "05-distant-companion.png",
    "06-characters.png",
)
# The V2 character layer was generated as a partial identity/upper-body layer,
# not a perfect segmentation of the final bridge composite. These broad organic
# regions therefore cover the full bridge bodies/limbs as a fail-closed safety
# envelope. They are intentionally oversized because the Core5 layout will be
# rebuilt on top of this sanitized plate.
MANUAL_HUMAN_REGIONS = (
    (-55, 300, 145, 610),   # left seated traveler
    (45, 260, 230, 535),    # older central-left traveler + raised arm
    (120, 335, 240, 610),   # center-left seated traveler
    (195, 340, 320, 615),   # center-right seated traveler
    (275, 340, 465, 640),   # right seated traveler
    (275, 295, 360, 435),   # distant standing companion
)
RESTORE_ALLOWED_LAYERS = (
    "09-fire-base.png",
    "08-animal-robot.png",
    "14-foreground-accents.png",
)


def invariant(condition: bool, message: str) -> None:
    if not condition:
        raise RuntimeError(message)


def resized_rgba(path: Path) -> Image.Image:
    with Image.open(path) as source:
        source.load()
        rgba = source.convert("RGBA")
    if rgba.size != TARGET_SIZE:
        rgba = rgba.resize(TARGET_SIZE, Image.Resampling.LANCZOS)
    return rgba


def build_human_mask() -> Image.Image:
    # Layer alpha is retained only as a fine alignment aid around heads/hair.
    # Never depend on it as full-body segmentation: 06-characters is partial.
    layer_alpha = Image.new("L", TARGET_SIZE, 0)
    for file_name in HUMAN_MASK_LAYERS:
        path = LAYER_ROOT / file_name
        invariant(path.is_file(), f"TOP human-removal mask source missing: {path.relative_to(ROOT)}")
        alpha = resized_rgba(path).getchannel("A")
        layer_alpha = ImageChops.lighter(layer_alpha, alpha)
    layer_hard = layer_alpha.point(lambda value: 255 if value >= 8 else 0)
    layer_aid = layer_hard.filter(ImageFilter.MaxFilter(9))

    manual = Image.new("L", TARGET_SIZE, 0)
    draw = ImageDraw.Draw(manual)
    for region in MANUAL_HUMAN_REGIONS:
        draw.ellipse(region, fill=255)

    combined = ImageChops.lighter(manual, layer_aid)
    # Small final growth/feather removes hair/cloth antialiasing without creating
    # the previous screen-wide horizontal band.
    grown = combined.filter(ImageFilter.MaxFilter(11))
    feathered = grown.filter(ImageFilter.GaussianBlur(7.0))

    stats = ImageStat.Stat(manual)
    manual_coverage = stats.sum[0] / (255.0 * TARGET_SIZE[0] * TARGET_SIZE[1])
    invariant(0.12 < manual_coverage < 0.52, f"TOP manual human-removal coverage is suspicious: {manual_coverage:.4f}")
    invariant(grown.getbbox() is not None, "TOP human-removal mask is empty")
    print(f"manualHumanMaskCoverage={manual_coverage:.4f}")
    return feathered


def sanitize_bridge(mask: Image.Image) -> Image.Image:
    invariant(BRIDGE.is_file(), f"TOP bridge missing: {BRIDGE.relative_to(ROOT)}")
    invariant(CLEAN_PLATE.is_file(), "base human-free layer composition must exist before bridge sanitization")
    with Image.open(BRIDGE) as source:
        source.load()
        invariant(source.size == TARGET_SIZE, f"TOP bridge must be 430x932, got {source.size}")
        bridge = source.convert("RGB")
    with Image.open(CLEAN_PLATE) as source:
        source.load()
        invariant(source.size == TARGET_SIZE, f"base human-free composition must be 430x932, got {source.size}")
        base_human_free = source.convert("RGB")

    # Preserve bridge town/rail detail outside the full-body masks. Inside the
    # masks, erase identity and body structure by mixing a very broad bridge blur
    # with the independently human-free layer plate, then slightly neutralize it.
    # This keeps scene palette/depth without retaining readable generic people.
    blurred = bridge.filter(ImageFilter.GaussianBlur(62.0))
    neutral_fill = Image.blend(blurred, base_human_free, 0.40)
    navy = Image.new("RGB", TARGET_SIZE, (6, 14, 29))
    neutral_fill = Image.blend(neutral_fill, navy, 0.12)
    sanitized = Image.composite(neutral_fill, bridge, mask)

    # Restore only explicitly allowed non-human foreground assets after removal
    # so fire/animal/robot/lantern context stays crisp even where masks overlap.
    sanitized_rgba = sanitized.convert("RGBA")
    for file_name in RESTORE_ALLOWED_LAYERS:
        path = LAYER_ROOT / file_name
        invariant(path.is_file(), f"TOP allowed restore layer missing: {path.relative_to(ROOT)}")
        overlay = resized_rgba(path)
        alpha_min, alpha_max = overlay.getchannel("A").getextrema()
        invariant(alpha_min < 255 and alpha_max > 0, f"TOP allowed restore layer alpha invalid: {file_name}")
        sanitized_rgba = Image.alpha_composite(sanitized_rgba, overlay)

    return sanitized_rgba.convert("RGB")


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    DIAGNOSTIC_DIR.mkdir(parents=True, exist_ok=True)
    mask = build_human_mask()
    sanitized = sanitize_bridge(mask)
    sanitized.save(CLEAN_PLATE, format="PNG", optimize=True)
    mask.convert("L").save(MASK_PREVIEW, format="PNG", optimize=True)

    with Image.open(CLEAN_PLATE) as check:
        check.load()
        invariant(check.size == TARGET_SIZE, f"sanitized TOP clean plate dimension mismatch: {check.size}")
        invariant(check.mode in {"RGB", "RGBA"}, f"sanitized TOP clean plate mode mismatch: {check.mode}")

    print("TOP bridge human sanitization: PASS")
    print(f"cleanPlate={CLEAN_PLATE.relative_to(ROOT)}")
    print(f"maskDiagnostic={MASK_PREVIEW.relative_to(ROOT)}")
    print("NOTE: raw bridge is never copied to the generator artifact; only the full-body human-sanitized derivative is model-facing. 05/06 source pixels are used as alpha alignment aids only, never composited as people.")


if __name__ == "__main__":
    main()
