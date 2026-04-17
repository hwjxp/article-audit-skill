#!/usr/bin/env python3

import math
import sys
from pathlib import Path

from PIL import Image, ImageDraw


def build_contact_sheet(image_dir: Path, output_path: Path, cols: int = 4) -> None:
    files = sorted(
        [
            p
            for p in image_dir.iterdir()
            if p.is_file() and p.suffix.lower() in {".png", ".jpg", ".jpeg", ".gif", ".webp"}
        ]
    )
    if not files:
        raise SystemExit(f"No images found in {image_dir}")

    thumb_w, thumb_h = 220, 220
    rows = math.ceil(len(files) / cols)
    canvas = Image.new("RGB", (cols * thumb_w, rows * thumb_h), (255, 255, 255))

    for idx, file in enumerate(files):
        with Image.open(file) as image:
            preview = image.convert("RGB")
            preview.thumbnail((thumb_w - 10, thumb_h - 30))
            col = idx % cols
            row = idx // cols
            x = col * thumb_w + (thumb_w - preview.width) // 2
            y = row * thumb_h + 5
            canvas.paste(preview, (x, y))
            draw = ImageDraw.Draw(canvas)
            draw.rectangle(
                [col * thumb_w, row * thumb_h + thumb_h - 24, col * thumb_w + thumb_w, row * thumb_h + thumb_h],
                fill=(245, 245, 245),
            )
            draw.text((col * thumb_w + 8, row * thumb_h + thumb_h - 20), file.name, fill=(0, 0, 0))

    output_path.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(output_path, quality=90)


def main() -> None:
    if len(sys.argv) < 2:
        raise SystemExit("Usage: python3 build_contact_sheet.py <image-dir> [output-file]")

    image_dir = Path(sys.argv[1]).expanduser().resolve()
    output_path = (
        Path(sys.argv[2]).expanduser().resolve()
        if len(sys.argv) > 2
        else image_dir.parent / "contact-sheet.jpg"
    )

    build_contact_sheet(image_dir, output_path)
    print(output_path)


if __name__ == "__main__":
    main()
