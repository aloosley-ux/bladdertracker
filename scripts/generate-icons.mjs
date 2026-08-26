// One-off: rasterise public/icon.svg into PNG icons for the PWA manifest.
import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';

const svg = await readFile('public/icon.svg');

const sizes = [192, 512];
for (const size of sizes) {
  const out = `public/icons/icon-${size}.png`;
  // Pad onto a solid background so maskable icons keep safe-zone content visible.
  await sharp(svg, { density: 384 })
    .resize(size, size)
    .png()
    .toFile(out);
  console.log('wrote', out);
}

// Apple touch icon: iOS does not support SVG; 180x180 PNG, opaque background.
await sharp(svg, { density: 384 })
  .resize(180, 180)
  .flatten({ background: '#f8f5ff' })
  .png()
  .toFile('public/icons/apple-touch-icon.png');
console.log('wrote public/icons/apple-touch-icon.png');

// Maskable variants: content shrunk to 80% inside a solid tile (safe zone).
for (const size of [192, 512]) {
  const inner = Math.round(size * 0.8);
  const offset = Math.round((size - inner) / 2);
  const padded = await sharp(svg, { density: 384 })
    .resize(inner, inner)
    .extend({ top: offset, bottom: offset, left: offset, right: offset, background: '#8b4dff' })
    .png()
    .toBuffer();
  await sharp(padded).png().toFile(`public/icons/maskable-icon-${size}.png`);
  console.log('wrote', `public/icons/maskable-icon-${size}.png`);
}
