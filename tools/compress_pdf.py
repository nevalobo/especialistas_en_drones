#!/usr/bin/env python3
"""
compress_pdf.py — Compress a mostly-visual PDF for web delivery by rasterizing pages.

What it does:
    Renders every page to a raster at a chosen zoom factor, re-encodes each page
    as a JPEG at a given quality, and rebuilds a new PDF from those page images.
    This is the reliable method for image-heavy marketing catalogs (photos with
    overlaid text) where selectable text is not required: it never breaks layered
    backgrounds or transparency, and gives predictable output size.

    NOTE: this flattens the PDF — text becomes part of the page image and is no
    longer selectable/searchable. That is the right trade-off for a visual
    catalog served on the web, but wrong for a text document. For text-heavy PDFs
    use PyMuPDF's `rewrite_images` (image re-sampling) instead — see git history.

Inputs (CLI args):
    src            Path to the source PDF.
    dst            Path to write the compressed PDF.
    --zoom         Render scale (default: 1.5). 1.0 = 72 DPI, 1.5 ≈ 108 DPI,
                   2.0 = 144 DPI. Higher = sharper but larger.
    --quality      JPEG quality 1-100 (default: 72).

Output:
    Writes the compressed PDF to `dst` and prints a before/after size report.

Dependencies:
    pymupdf (PyMuPDF / fitz) and Pillow.
    Install: python3 -m pip install --user pymupdf pillow

Caveats:
    - Flattens text into images (see NOTE above).
    - zoom 1.5 / quality 72 is a good default for on-screen web catalogs; raise
      zoom for print-quality downloads, lower it for lighter files.
"""
import argparse
import io
import os
import sys

import fitz  # PyMuPDF
from PIL import Image


def compress(src: str, dst: str, zoom: float = 1.5, quality: int = 72) -> None:
    source = fitz.open(src)
    out = fitz.open()

    matrix = fitz.Matrix(zoom, zoom)
    for pno in range(source.page_count):
        page = source[pno]
        # Render the whole page (all layers composited) to a raster, so overlaid
        # text and layered/transparent backgrounds survive intact.
        pix = page.get_pixmap(matrix=matrix)
        im = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)

        buf = io.BytesIO()
        im.save(buf, format="JPEG", quality=quality, optimize=True)

        # Recreate the page at its ORIGINAL point size and drop the JPEG in — keeps
        # physical page dimensions identical so the viewer/aspect ratio is unchanged.
        rect = page.rect
        new_page = out.new_page(width=rect.width, height=rect.height)
        new_page.insert_image(rect, stream=buf.getvalue())

    out.save(dst, garbage=4, deflate=True)
    out.close()
    source.close()

    src_mb = os.path.getsize(src) / 1_048_576
    dst_mb = os.path.getsize(dst) / 1_048_576
    print(f"Size: {src_mb:.1f} MB -> {dst_mb:.1f} MB  ({dst_mb / src_mb * 100:.0f}% of original)")


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("src")
    ap.add_argument("dst")
    ap.add_argument("--zoom", type=float, default=1.5)
    ap.add_argument("--quality", type=int, default=72)
    args = ap.parse_args()
    compress(args.src, args.dst, args.zoom, args.quality)
    return 0


if __name__ == "__main__":
    sys.exit(main())
