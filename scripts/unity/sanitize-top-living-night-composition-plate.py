#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageChops, ImageFilter, ImageStat

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
    combined = Image.new("L", TARGET_SIZE, 0)
    for file_name in HUMAN_MASK_LAYERS:
        path = LAYER_ROOT / file_name
        invariant(path.is_file(), f"TOP human-removal mask source missing: {path.relative_to(ROOT)}")
        alpha = resized_rgba(path).getchannel("A")
        combined = ImageChops.lighter(combined, alpha)

    # Threshold faint antialiasing, then deliberately grow past hair/cape edge
    # pixels so the sanitized derivative cannot retain a readable old silhouette.
    hard = combined.point(lambda value: 255 if value >= 8 else 0)
    grown = hard.filter(ImageFilter.MaxFilter(31))
    feathered = grown.filter(ImageFilter.GaussianBlur(5.0))

    stats = ImageStat.Stat(hard)
    coverage = stats.sum[0] / (255.0 * TARGET_SIZE[0] * TARGET_SIZE[1])
    invariant(0.02 < coverage < 0.30, f"TOP human-removal mask coverage is suspicious: {coverage:.4f}")
    invariant(grown.getbbox() is not None, "TOP human-removal mask is empty")
    print(f"humanMaskCoverage={coverage:.4f}")
    return feathered


def sanitize_bridge(mask: Image.Image) -> Image.Image:
    invariant(BRIDGE.is_file(), f"TOP bridge missing: {BRIDGE.relative_to(ROOT)}")
    with Image.open(BRIDGE) as source:
        source.load()
        invariant(source.size == TARGET_SIZE, f"TOP bridge must be 430x932, got {source.size}")
        bridge = source.convert("RGB")

    # A very broad blur destroys identity/silhouette detail inside the exact
    # human masks. A restrained navy blend prevents warm face/cape remnants
    # from surviving as a recognizable sixth/generic person. Only masked pixels
    # are replaced; town/rail/camp context outside the old humans stays intact.
    blurred = bridge.filter(ImageFilter.GaussianBlur(52.0))
    navy = Image.new("RGB", TARGET_SIZE, (6, 14, 29))
    neutral_fill = Image.blend(blurred, navy, 0.24)
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
    print("NOTE: raw bridge is never copied to the generator artifact; only the human-sanitized derivative is model-facing. Human mask source pixels are used as alpha only, never composited as people.")


if __name__ == "__main__":
    main()
