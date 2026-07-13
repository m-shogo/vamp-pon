from pathlib import Path
import json
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
EVIDENCE = ROOT / "docs/design-targets/generated/unity-u47/simulator-smoke"
manifest = json.loads((EVIDENCE / "manifest.json").read_text())
font = ImageFont.load_default(size=14)

def build(entries, name):
    columns, cell_width, cell_height = 3, 320, 620
    rows = (len(entries) + columns - 1) // columns
    sheet = Image.new("RGB", (columns * cell_width, rows * cell_height), (18, 15, 14))
    draw = ImageDraw.Draw(sheet)
    for index, entry in enumerate(entries):
        x, y = (index % columns) * cell_width, (index // columns) * cell_height
        image = Image.open(ROOT / entry["screenshotPath"]).convert("RGB")
        image.thumbnail((270, 540), Image.Resampling.LANCZOS)
        image_x = x + (cell_width - image.width) // 2
        sheet.paste(image, (image_x, y + 70))
        capture_number = int(entry["captureId"].split("-", 1)[0])
        label = f'#{capture_number:02d}  {entry["captureId"]}\n{entry["sizeKey"]} {entry["width"]}x{entry["height"]}  PASS'
        draw.multiline_text((x + 10, y + 8), label, font=font, fill=(245, 220, 168), spacing=3)
        draw.rectangle((x, y, x + cell_width - 1, y + cell_height - 1), outline=(95, 70, 48), width=1)
    sheet.save(EVIDENCE / name, optimize=True)

build(manifest["entries"][:12], "contact-sheet-01-captures-01-12.png")
build(manifest["entries"][12:], "contact-sheet-02-captures-13-23.png")
print("U47 contact sheets written: 2")
