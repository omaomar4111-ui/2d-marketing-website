// scripts/process-team-images.js
// Flood fill from edges — يحافظ على الشعر والملابس السودا
// Usage: node scripts/process-team-images.js

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_DIR  = path.join(__dirname, '..', 'assets', 'team', 'raw');
const OUTPUT_DIR = path.join(__dirname, '..', 'assets', 'team');

// الفرق بين بكسل الخلفية وبكسل الشخصية
const BLACK_THRESHOLD = 30;   // أقل من كده = خلفية
const COLOR_TOLERANCE = 40;   // فرق اللون المسموح للـ flood
const FEATHER = 15;           // نعومة الحواف

function isDarkBackground(r, g, b) {
  const brightness = (r + g + b) / 3;
  return brightness < BLACK_THRESHOLD;
}

function floodFillTransparent(pixels, width, height, channels) {
  const total = width * height;
  const visited = new Uint8Array(total);
  const stack = new Int32Array(total);
  let stackTop = 0;

  function pushPixel(x, y) {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const idx = y * width + x;
    if (visited[idx]) return;
    const pixIdx = idx * channels;
    const r = pixels[pixIdx];
    const g = pixels[pixIdx + 1];
    const b = pixels[pixIdx + 2];
    if (isDarkBackground(r, g, b)) {
      visited[idx] = 1;
      pixels[pixIdx + 3] = 0; // شفاف
      stack[stackTop++] = idx;
    }
  }

  // ابدأ من كل الحواف
  for (let x = 0; x < width; x++) {
    pushPixel(x, 0);
    pushPixel(x, height - 1);
  }
  for (let y = 1; y < height - 1; y++) {
    pushPixel(0, y);
    pushPixel(width - 1, y);
  }

  while (stackTop > 0) {
    const idx = stack[--stackTop];
    const x = idx % width;
    const y = (idx / width) | 0;

    if (x + 1 < width) pushPixel(x + 1, y);
    if (x - 1 >= 0) pushPixel(x - 1, y);
    if (y + 1 < height) pushPixel(x, y + 1);
    if (y - 1 >= 0) pushPixel(x, y - 1);
  }
}

async function processOne(filename) {
  const input = path.join(INPUT_DIR, filename);
  const output = path.join(OUTPUT_DIR, filename.replace(/\.(png|jpg|jpeg|webp)$/i, '.png'));

  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const pixels = new Uint8ClampedArray(data);

  // 1. Flood fill من الحواف
  floodFillTransparent(pixels, width, height, channels);

  await sharp(Buffer.from(pixels), {
    raw: { width, height, channels: 4 }
  })
    .png({ compressionLevel: 9 })
    .toFile(output);

  console.log(`✅ ${filename} → ${path.basename(output)}`);
}

(async () => {
  if (!fs.existsSync(INPUT_DIR)) {
    console.error(`❌ Folder not found: ${INPUT_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(INPUT_DIR).filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f));

  if (!files.length) {
    console.error('❌ No images found');
    process.exit(1);
  }

  for (const file of files) {
    try { await processOne(file); }
    catch (err) { console.error(`❌ ${file}:`, err.message); }
  }

  console.log('\n🎉 Done!');
})();
