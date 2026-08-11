#!/usr/bin/env python3
"""Build the TOP Living Night V3 runtime-capture human review pack.

Consumes ONLY the real Unity runtime captures produced by
`scripts/unity/run-top-v3-runtime-capture-current.sh` (via the manifest) and
produces contact sheets, automated visual diagnostics, and a human review
checklist. It never promotes any approval flag; Pillow output is derived from
Unity captures and is clearly labelled as a review aid, not runtime evidence.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageStat

ROOT = Path(__file__).resolve().parents[2]
BASE = ROOT / "docs/design-targets/generated/top-living-night-v3/runtime-captures/current"
MANIFEST = BASE / "manifest.json"
REVIEW = BASE / "review"

PAD = 14
LABEL_H = 30
BG = (12, 14, 30)
FG = (232, 236, 250)


def load_manifest() -> dict:
    if not MANIFEST.exists():
        sys.exit(f"manifest not found: {MANIFEST} (run the capture harness first)")
    return json.loads(MANIFEST.read_text())


def cap_path(record: dict) -> Path:
    return ROOT / record["file"]


def open_cap(record: dict) -> Image.Image:
    return Image.open(cap_path(record)).convert("RGB")


def label(draw: ImageDraw.ImageDraw, xy, text: str) -> None:
    draw.text(xy, text, fill=FG)


def mean_luma(image: Image.Image) -> float:
    stat = ImageStat.Stat(image.convert("L"))
    return stat.mean[0]


def frame_diff(a: Image.Image, b: Image.Image) -> float:
    if a.size != b.size:
        b = b.resize(a.size)
    diff = ImageChops.difference(a.convert("RGB"), b.convert("RGB"))
    return sum(ImageStat.Stat(diff).mean) / 3.0


def contact_row(records: list[dict], title: str, out: Path, scale: float = 0.5) -> None:
    if not records:
        return
    images = []
    for record in records:
        img = open_cap(record)
        img = img.resize((int(img.width * scale), int(img.height * scale)))
        images.append((record, img))
    cell_w = max(img.width for _, img in images)
    cell_h = max(img.height for _, img in images)
    cols = len(images)
    width = cols * cell_w + (cols + 1) * PAD
    height = cell_h + LABEL_H * 2 + PAD * 2
    sheet = Image.new("RGB", (width, height), BG)
    draw = ImageDraw.Draw(sheet)
    label(draw, (PAD, 6), title)
    for index, (record, img) in enumerate(images):
        x = PAD + index * (cell_w + PAD)
        y = LABEL_H + PAD
        sheet.paste(img, (x, y))
        caption = f"{record['sizeKey']} {record['motionMode']} {record['frameLabel']} ({record['targetElapsedMs']}ms)"
        label(draw, (x, y + img.height + 4), caption)
    REVIEW.mkdir(parents=True, exist_ok=True)
    sheet.save(out)


def pick(records: list[dict], size_key: str, pass_mode: str, label_hint: str | None = None) -> dict | None:
    subset = [r for r in records if r["sizeKey"] == size_key and r["passMode"] == pass_mode]
    if not subset:
        return None
    if label_hint:
        for r in subset:
            if label_hint in r["frameLabel"]:
                return r
    # default: the mid/steady frame nearest 5000ms
    return min(subset, key=lambda r: abs(r["targetElapsedMs"] - 5000))


def build_contact_sheets(records: list[dict], sizes: list[str]) -> list[str]:
    made = []
    # 1. resolution comparison per motion mode
    for mode in ("normal", "reduced"):
        row = [pick(records, s, mode) for s in sizes]
        row = [r for r in row if r]
        out = REVIEW / f"resolution-compare-{mode}.png"
        contact_row(row, f"Resolution comparison — {mode} (steady frame)", out)
        made.append(out.name)
    # 2. normal vs reduced per resolution
    for s in sizes:
        row = [pick(records, s, "normal"), pick(records, s, "reduced")]
        row = [r for r in row if r]
        out = REVIEW / f"normal-vs-reduced-{s}.png"
        contact_row(row, f"Normal vs Reduced — {s}", out)
        made.append(out.name)
    # 3. time-series per resolution per mode
    for s in sizes:
        for mode in ("normal", "reduced", "transition"):
            series = sorted(
                [r for r in records if r["sizeKey"] == s and r["passMode"] == mode],
                key=lambda r: r["targetElapsedMs"],
            )
            if not series:
                continue
            out = REVIEW / f"timeseries-{s}-{mode}.png"
            contact_row(series, f"Motion time-series — {s} {mode}", out, scale=0.42)
            made.append(out.name)
    # 4. master overview
    overview = [pick(records, s, "normal") for s in sizes] + [pick(records, s, "reduced") for s in sizes]
    overview = [r for r in overview if r]
    contact_row(overview, "TOP V3 runtime capture overview", REVIEW / "contact-sheet.png", scale=0.5)
    made.append("contact-sheet.png")
    return made


def diagnostics(records: list[dict], sizes: list[str]) -> dict:
    checks: list[dict] = []

    def add(name: str, ok: bool, detail: str) -> None:
        checks.append({"check": name, "pass": bool(ok), "detail": detail})

    # per-frame: not full black, dimensions
    for r in records:
        img = open_cap(r)
        luma = mean_luma(img)
        add(f"{r['id']} not-full-black", luma > 3.0, f"mean_luma={luma:.2f}")
        add(
            f"{r['id']} dimensions",
            img.width == r["width"] and img.height == r["height"],
            f"{img.width}x{img.height} vs {r['width']}x{r['height']}",
        )

    # motion presence (normal) and suppression (reduced) per resolution
    for s in sizes:
        def series(mode: str) -> list[dict]:
            return sorted(
                [r for r in records if r["sizeKey"] == s and r["passMode"] == mode],
                key=lambda r: r["targetElapsedMs"],
            )

        def max_consecutive_diff(seq: list[dict]) -> float:
            best = 0.0
            for a, b in zip(seq, seq[1:]):
                best = max(best, frame_diff(open_cap(a), open_cap(b)))
            return best

        normal = series("normal")
        reduced = series("reduced")
        if len(normal) >= 2:
            n_diff = max_consecutive_diff(normal)
            add(f"{s} normal has inter-frame motion", n_diff > 0.05, f"max_consecutive_diff={n_diff:.4f}")
            if len(reduced) >= 2:
                r_diff = max_consecutive_diff(reduced)
                add(
                    f"{s} reduced <= normal motion",
                    r_diff <= n_diff + 1e-6,
                    f"reduced={r_diff:.4f} normal={n_diff:.4f}",
                )
            # duplicate detection: normal frames must not be identical
            add(
                f"{s} normal frames not all identical",
                n_diff > 1e-3,
                f"max_consecutive_diff={n_diff:.4f}",
            )

    summary = {
        "generatedFrom": "unity-runtime-captures",
        "note": "Pillow diagnostics are a review aid derived from real Unity captures; not runtime/human approval.",
        "totalChecks": len(checks),
        "failed": [c for c in checks if not c["pass"]],
        "checks": checks,
    }
    (REVIEW / "diagnostics.json").write_text(json.dumps(summary, indent=2) + "\n")
    return summary


def write_review_md(manifest: dict, sizes: list[str], sheets: list[str], diag: dict) -> None:
    failed = diag["failed"]
    lines: list[str] = []
    lines.append("# TOP Living Night V3 — Runtime Capture Human Review\n")
    lines.append(
        "Runtime look/motion captures from the real Unity `TopLivingNightView` "
        "(final-core5 composite + 6 semantic layers + 10 effect companions). "
        "**This pack is a human review aid, not approval.**\n"
    )
    lines.append("## Runtime evidence summary\n")
    lines.append(f"- source commit: `{manifest.get('sourceCommit','')}`")
    lines.append(f"- Unity: `{manifest.get('unityVersion','')}`")
    lines.append(f"- candidate SHA256: `{manifest.get('candidateSha256','')}`")
    lines.append(f"- semantic layer pack SHA256: `{manifest.get('semanticLayerPackSha256','')}`")
    lines.append(f"- effect companion pack SHA256: `{manifest.get('effectCompanionPackSha256','')}`")
    lines.append(f"- captures: {manifest.get('captureCount')}/{manifest.get('expectedCaptureCount')} — result {manifest.get('result')}")
    lines.append(f"- generated: `{manifest.get('generatedAtUtc','')}`\n")

    lines.append("## Automated visual diagnostics\n")
    lines.append(f"- total checks: {diag['totalChecks']}, failed: {len(failed)}")
    if failed:
        lines.append("- **FAILED checks (need attention):**")
        for c in failed:
            lines.append(f"  - `{c['check']}` — {c['detail']}")
    else:
        lines.append("- all automated checks passed (no full-black frames, dimensions correct, Normal shows inter-frame motion, Reduced ≤ Normal motion).")
    lines.append("- thresholds are intentionally loose; pixel diffs never grant aesthetic approval.\n")

    lines.append("## Contact sheets\n")
    for name in sheets:
        lines.append(f"- `review/{name}`")
    lines.append("")

    lines.append("## Core5 human review checklist (PENDING human)\n")
    lines.append("Foreground humans must be **exactly five**: Yui / Asa / Nagi / Michiru / Tomori.\n")
    for item in [
        "no sixth human",
        "no generic substitute",
        "no duplicate identity",
        "no identity merge",
        "all five individually identifiable",
        "face directions are not all identical",
        "expressions/postures are not monotonous",
        "white small animal present",
        "small round robot present",
        "fire position matches runtime effect",
        "smoke / embers follow the fire",
        "night sky is quiet but not monotonous",
        "stars / clouds do not move excessively",
        "title safe area preserved",
        "bottom button safe area preserved",
        "reads as a night place you want to come home to",
        "does NOT read as a loading screen / event poster",
    ]:
        lines.append(f"- [ ] {item}")
    lines.append("")
    lines.append("## Reduced Motion contract (PENDING human)\n")
    for item in [
        "geometry drift suppressed vs Normal",
        "smoke suppressed",
        "embers suppressed",
        "robot eye suppressed",
        "cloud / character parallax suppressed",
        "fire honours its Reduced Motion contract",
        "same-view Normal → Reduced → Normal transition looks correct (see transition time-series)",
    ]:
        lines.append(f"- [ ] {item}")
    lines.append("")
    lines.append("## Approval boundary\n")
    lines.append(
        "- `approvedAsFinal=false`, `runtimeApproved=false`, `finalApprovalBlocked=true` — unchanged.\n"
        "- Capturing runtime look/motion is NOT approval. Human visual review and device evidence remain required."
    )
    (BASE / "motion-review.md").write_text("\n".join(lines) + "\n")


def main() -> None:
    manifest = load_manifest()
    records = manifest.get("captures", [])
    if not records:
        sys.exit("manifest has no captures")
    sizes = []
    for r in records:
        if r["sizeKey"] not in sizes:
            sizes.append(r["sizeKey"])
    REVIEW.mkdir(parents=True, exist_ok=True)
    sheets = build_contact_sheets(records, sizes)
    diag = diagnostics(records, sizes)
    write_review_md(manifest, sizes, sheets, diag)
    status = "PASS" if not diag["failed"] else "REVIEW"
    print(f"TOP V3 capture review pack built: {len(sheets)} sheets, "
          f"{diag['totalChecks']} checks, {len(diag['failed'])} failed -> {status}")
    print(f"pack root: {BASE}")


if __name__ == "__main__":
    main()
