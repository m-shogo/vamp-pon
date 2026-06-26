#!/usr/bin/env node
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { join, relative } from 'node:path';
import { deflateSync, inflateSync } from 'node:zlib';

const ROOT = 'public/assets/ui';
const OUTPUT_DIR = 'public/assets/ui/battle-hud/processed';
const WRITE = process.argv.includes('--write');
const FORCE = process.argv.includes('--force');

const MANIFEST = [
  adopted(
    'battle-hud-ultimate-seal-lantern-button',
    'battle-hud-ultimate-seal-lantern-button-v1.png',
    'public/assets/ui/battle-hud/battle-hud-ultimate-seal-lantern-button.png',
    '右下必殺ボタン本体。封蝋＋ランタン。',
  ),
  adopted(
    'battle-hud-kokuyou-bottle-frame',
    'battle-hud-kokuyou-bottle-frame-v1.png',
    'public/assets/ui/battle-hud/battle-hud-kokuyou-bottle-frame.png',
    '左下黒曜ゲージ瓶枠。',
  ),
  adopted(
    'kokuyouBottleLabel',
    'battle-hud-kokuyou-bottle-label-v1.png',
    'public/assets/ui/ChatGPT Image Jun 26, 2026, 03_28_38 PM.png',
    '黒曜瓶ゲージ下部の紙ラベル帯。文字はPhaser Textで描画。黒曜/BERSERK等は焼き込まない。',
  ),
  runtime(
    'kokuyouBottleLabelRuntime',
    'battle-hud-kokuyou-bottle-label-runtime.png',
    'public/assets/ui/ChatGPT Image Jun 26, 2026, 03_28_38 PM.png',
    '黒曜瓶ゲージ下部の紙ラベル帯runtime版。216x54。文字はPhaser Textで描画。',
    216,
    54,
  ),
  adopted(
    'battle-hud-inventory-paper-slot',
    'battle-hud-inventory-paper-slot-v1.png',
    'public/assets/ui/battle-hud/battle-hud-inventory-paper-slot.png',
    '下部インベントリ通常スロット。',
  ),
  adopted(
    'battle-hud-dual-gauge-frame',
    'battle-hud-dual-gauge-frame-v1.png',
    'public/assets/ui/battle-hud/battle-hud-dual-gauge-frame.png',
    'HP/EXP 2段ゲージ外枠。',
  ),
  adopted(
    'battle-hud-memory-street-progress-frame',
    'battle-hud-memory-street-progress-paper-v1.png',
    'public/assets/ui/ChatGPT Image Jun 26, 2026, 02_16_44 PM (5).png',
    'Memory Street進行バー。左右札＋中央星ライン。',
  ),
  adopted(
    'battle-hud-ultimate-button-label',
    'battle-hud-ultimate-button-label-v1.png',
    'public/assets/ui/ChatGPT Image Jun 26, 2026, 02_16_44 PM (6).png',
    '必殺ボタン下の紙ラベル帯。',
  ),
  adopted(
    'battle-hud-paper-tag-lv',
    'battle-hud-paper-tag-lv-v1.png',
    'public/assets/ui/ChatGPT Image Jun 26, 2026, 02_22_23 PM (1).png',
    '左上LV吊り紙札。',
  ),
  adopted(
    'battle-hud-paper-tag-dawn',
    'battle-hud-paper-tag-dawn-v1.png',
    'public/assets/ui/ChatGPT Image Jun 26, 2026, 02_22_23 PM (2).png',
    'Dawn inタイマー紙札。',
  ),
  adopted(
    'battle-hud-paper-tag-currency',
    'battle-hud-paper-tag-currency-v1.png',
    'public/assets/ui/ChatGPT Image Jun 26, 2026, 02_22_24 PM (3).png',
    'ランタン数/Shard数の2段紙札。',
  ),
  adopted(
    'battle-hud-paper-tag-menu',
    'battle-hud-paper-tag-menu-v1.png',
    'public/assets/ui/ChatGPT Image Jun 26, 2026, 02_22_24 PM (4).png',
    '右上メニュー吊り紙札。',
  ),
  hold(
    'battle-hud-inventory-paper-slot',
    'battle-hud-inventory-paper-slot-hold-large-v1.png',
    'public/assets/ui/ChatGPT Image Jun 26, 2026, 02_16_43 PM (1).png',
    '大型吊り紙slot。縦長で余白過多のためbackup。',
  ),
  hold(
    'battle-hud-paper-tag-dawn',
    'battle-hud-paper-tag-dawn-hold-square-v1.png',
    'public/assets/ui/ChatGPT Image Jun 26, 2026, 02_16_43 PM (2).png',
    '正方形寄りの朝日紙札。Dawn札backup。',
  ),
  hold(
    'battle-hud-dual-gauge-frame',
    'battle-hud-dual-gauge-frame-hold-v1.png',
    'public/assets/ui/ChatGPT Image Jun 26, 2026, 02_16_43 PM (3).png',
    '2段ゲージ枠backup。',
  ),
  hold(
    'battle-hud-paper-tag-lv',
    'battle-hud-paper-tag-hold-dark-panel-v1.png',
    'public/assets/ui/ChatGPT Image Jun 26, 2026, 02_16_44 PM (4).png',
    '黒内枠が強い吊り紙。LV札には重いためhold。',
  ),
  hold(
    'battle-hud-memory-street-progress-frame',
    'battle-hud-memory-street-progress-hold-simple-v1.png',
    'public/assets/ui/ChatGPT Image Jun 26, 2026, 02_22_24 PM (5).png',
    'シンプルなMemory Street進行バーbackup。',
  ),
  hold(
    'battle-hud-ultimate-button-label',
    'battle-hud-paper-label-hold-simple-v1.png',
    'public/assets/ui/ChatGPT Image Jun 26, 2026, 02_22_24 PM (6).png',
    '素朴な横長紙帯。Battle label/TOP CTA placeholder。',
  ),
];

const pngFiles = walk(ROOT)
  .filter((path) => path.toLowerCase().endsWith('.png'))
  .filter((path) => !path.includes('/processed/'));

const inventoryRows = pngFiles.map((path) => {
  const info = readPng(path, { pixels: false });
  const stats = analyzePng(path);
  return {
    path,
    size: `${info.width}x${info.height}`,
    mode: info.mode,
    hasAlpha: info.hasAlpha,
    nonOpaquePct: pct(stats.nonOpaqueRatio),
    greenPct: pct(stats.greenRatio),
    greenBgLike: stats.greenRatio > 0.15,
    checkerSuspect: stats.checkerSuspect,
    action: suggestedAction(info, stats),
  };
});

const outputRows = [];
if (WRITE) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  for (const item of MANIFEST) {
    const outputPath = join(OUTPUT_DIR, item.fileName);
    if (existsSync(outputPath) && !FORCE) {
      console.warn(`Keeping existing processed output for ${item.assetKey}: ${outputPath}`);
    } else if (existsSync(item.source)) {
      const sourceInfo = readPng(item.source, { pixels: false });
      let processed;
      if (sourceInfo.hasAlpha) {
        processed = sanitizeAlphaPng(item.source);
      } else {
        processed = greenKeyPng(item.source);
      }
      if (item.width && item.height) {
        processed = resizeRgbaPng(processed, item.width, item.height);
      }
      writeFileSync(outputPath, encodeRgbaPng(processed.width, processed.height, processed.pixels));
    } else if (!existsSync(outputPath)) {
      throw new Error(`Missing source and processed output for ${item.assetKey}: ${item.source}`);
    } else {
      console.warn(`Source missing; keeping existing processed output for ${item.assetKey}: ${item.source}`);
    }
    const outInfo = analyzePng(outputPath);
    outputRows.push({
      key: item.assetKey,
      assetKey: item.assetKey,
      file: item.fileName,
      fileName: item.fileName,
      purpose: item.note.split('。')[0],
      scene: 'Battle HUD',
      source: item.source,
      status: item.status,
      variant: item.variant,
      alpha: outInfo.hasAlpha,
      size: `${outInfo.width}x${outInfo.height}`,
      mode: outInfo.mode,
      hasAlpha: outInfo.hasAlpha,
      nonOpaquePct: pct(outInfo.nonOpaqueRatio),
      greenPct: pct(outInfo.greenRatio),
      note: item.note,
      notes: item.note,
    });
  }

  writeFileSync(
    join(OUTPUT_DIR, 'battle-hud-ui-assets-manifest.json'),
    `${JSON.stringify({
      generatedAt: '2026-06-26',
      root: OUTPUT_DIR,
      note: 'Battle HUD UI asset candidates only. Runtime wiring is intentionally deferred.',
      assets: outputRows,
      missing: [
        'battle-hud-kokuyou-bottle-fill-mask',
      ],
      implementationNotes: [
        'battle-hud-kokuyou-bottle-fill-mask is planned as a Phaser Graphics/mask shape rather than a generated image asset.',
        'Runtime wiring is intentionally deferred; do not load these from hud.ts yet.',
      ],
    }, null, 2)}\n`,
  );
}

console.log(JSON.stringify({
  dryRun: !WRITE,
  force: FORCE,
  root: ROOT,
  outputDir: OUTPUT_DIR,
  totalInputPngs: inventoryRows.length,
  plannedOutputs: MANIFEST.length,
  writtenOutputs: outputRows.length,
  inventoryRows,
  outputRows,
}, null, 2));

function adopted(assetKey, fileName, source, note) {
  return { assetKey, fileName, source, note, status: 'adopted' };
}

function hold(assetKey, fileName, source, note) {
  return { assetKey, fileName, source, note, status: 'hold' };
}

function runtime(assetKey, fileName, source, note, width, height) {
  return { assetKey, fileName, source, note, status: 'adopted', variant: 'runtime', width, height };
}

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const st = statSync(path);
    if (st.isDirectory()) out.push(...walk(path));
    else if (st.isFile()) out.push(path);
  }
  return out.sort();
}

function analyzePng(path) {
  const info = readPng(path, { pixels: true });
  let nonOpaque = 0;
  let green = 0;
  let neutral = 0;
  const total = info.width * info.height;

  for (let i = 0; i < info.pixels.length; i += 4) {
    const r = info.pixels[i];
    const g = info.pixels[i + 1];
    const b = info.pixels[i + 2];
    const a = info.pixels[i + 3];
    if (a < 250) nonOpaque += 1;
    if (a > 200 && isGreenScreen(r, g, b)) green += 1;
    if (a > 200 && Math.max(r, g, b) - Math.min(r, g, b) < 18 && r > 80 && r < 235) neutral += 1;
  }

  return {
    ...info,
    nonOpaqueRatio: nonOpaque / total,
    greenRatio: green / total,
    checkerSuspect: neutral / total > 0.25 && nonOpaque / total < 0.05,
  };
}

function readPng(path, options = { pixels: true }) {
  const buffer = readFileSync(path);
  if (!buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    throw new Error(`${path} is not a PNG file`);
  }

  let offset = 8;
  let ihdr = null;
  const idat = [];
  let hasTrns = false;

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    offset += 4;
    const type = buffer.subarray(offset, offset + 4).toString('ascii');
    offset += 4;
    const data = buffer.subarray(offset, offset + length);
    offset += length + 4;

    if (type === 'IHDR') {
      ihdr = {
        width: data.readUInt32BE(0),
        height: data.readUInt32BE(4),
        bitDepth: data[8],
        colorType: data[9],
        compression: data[10],
        filter: data[11],
        interlace: data[12],
      };
    } else if (type === 'IDAT') {
      idat.push(data);
    } else if (type === 'tRNS') {
      hasTrns = true;
    } else if (type === 'IEND') {
      break;
    }
  }

  if (!ihdr) throw new Error(`${path} is missing IHDR`);
  const mode = colorTypeName(ihdr.colorType);
  const hasAlpha = ihdr.colorType === 4 || ihdr.colorType === 6 || hasTrns;
  const base = {
    path: relative('.', path),
    width: ihdr.width,
    height: ihdr.height,
    mode,
    bitDepth: ihdr.bitDepth,
    hasAlpha,
  };

  if (!options.pixels) return base;
  if (ihdr.bitDepth !== 8 || ihdr.interlace !== 0 || ![2, 6].includes(ihdr.colorType)) {
    throw new Error(`${path} uses unsupported PNG mode for pixel processing: ${mode}, bitDepth=${ihdr.bitDepth}, interlace=${ihdr.interlace}`);
  }

  const channels = ihdr.colorType === 6 ? 4 : 3;
  const raw = inflateSync(Buffer.concat(idat));
  const stride = ihdr.width * channels;
  const pixels = Buffer.alloc(ihdr.width * ihdr.height * 4);
  let pos = 0;
  let out = 0;
  let prev = Buffer.alloc(stride);

  for (let y = 0; y < ihdr.height; y += 1) {
    const filter = raw[pos];
    pos += 1;
    const scan = raw.subarray(pos, pos + stride);
    pos += stride;
    const recon = Buffer.alloc(stride);

    for (let x = 0; x < stride; x += 1) {
      const left = x >= channels ? recon[x - channels] : 0;
      const up = prev[x];
      const upLeft = x >= channels ? prev[x - channels] : 0;
      let value;
      if (filter === 0) value = scan[x];
      else if (filter === 1) value = (scan[x] + left) & 255;
      else if (filter === 2) value = (scan[x] + up) & 255;
      else if (filter === 3) value = (scan[x] + Math.floor((left + up) / 2)) & 255;
      else if (filter === 4) value = (scan[x] + paeth(left, up, upLeft)) & 255;
      else throw new Error(`${path} has unsupported PNG filter ${filter}`);
      recon[x] = value;
    }

    for (let x = 0; x < stride; x += channels) {
      pixels[out] = recon[x];
      pixels[out + 1] = recon[x + 1];
      pixels[out + 2] = recon[x + 2];
      pixels[out + 3] = channels === 4 ? recon[x + 3] : 255;
      out += 4;
    }
    prev = recon;
  }

  return { ...base, pixels };
}

function greenKeyPng(path) {
  const info = readPng(path, { pixels: true });
  const out = Buffer.from(info.pixels);

  for (let i = 0; i < out.length; i += 4) {
    const r = out[i];
    const g = out[i + 1];
    const b = out[i + 2];
    if (!greenCandidate(r, g, b)) continue;

    const distance = Math.hypot(r, 255 - g, b);
    const alpha = Math.round(255 * smoothstep(48, 150, distance));
    out[i + 3] = Math.min(out[i + 3], alpha);

    if (alpha > 0 && alpha < 255) {
      const base = Math.max(r, b);
      out[i + 1] = Math.min(g, Math.round(base * 1.05 + 18));
    }
  }

  cleanupGreenFringe(out, info.width, info.height);
  clearTransparentRgb(out);
  return { ...info, mode: 'RGBA', hasAlpha: true, pixels: out };
}

function sanitizeAlphaPng(path) {
  const info = readPng(path, { pixels: true });
  const out = Buffer.from(info.pixels);
  clearTransparentRgb(out);
  return { ...info, mode: 'RGBA', hasAlpha: true, pixels: out };
}

function resizeRgbaPng(info, targetWidth, targetHeight) {
  const out = Buffer.alloc(targetWidth * targetHeight * 4);
  const xRatio = info.width / targetWidth;
  const yRatio = info.height / targetHeight;

  for (let y = 0; y < targetHeight; y += 1) {
    const sourceY = (y + 0.5) * yRatio - 0.5;
    const y0 = clampInt(Math.floor(sourceY), 0, info.height - 1);
    const y1 = clampInt(y0 + 1, 0, info.height - 1);
    const yWeight = sourceY - Math.floor(sourceY);

    for (let x = 0; x < targetWidth; x += 1) {
      const sourceX = (x + 0.5) * xRatio - 0.5;
      const x0 = clampInt(Math.floor(sourceX), 0, info.width - 1);
      const x1 = clampInt(x0 + 1, 0, info.width - 1);
      const xWeight = sourceX - Math.floor(sourceX);
      const outputIndex = (y * targetWidth + x) * 4;

      for (let channel = 0; channel < 4; channel += 1) {
        const top = lerp(
          info.pixels[(y0 * info.width + x0) * 4 + channel],
          info.pixels[(y0 * info.width + x1) * 4 + channel],
          xWeight,
        );
        const bottom = lerp(
          info.pixels[(y1 * info.width + x0) * 4 + channel],
          info.pixels[(y1 * info.width + x1) * 4 + channel],
          xWeight,
        );
        out[outputIndex + channel] = Math.round(lerp(top, bottom, yWeight));
      }
    }
  }

  cleanupGreenFringe(out, targetWidth, targetHeight);
  clearTransparentRgb(out);
  return { ...info, width: targetWidth, height: targetHeight, mode: 'RGBA', hasAlpha: true, pixels: out };
}

function cleanupGreenFringe(pixels, width, height) {
  const originalAlpha = Buffer.alloc(width * height);
  for (let i = 0, p = 0; i < pixels.length; i += 4, p += 1) originalAlpha[p] = pixels[i + 3];

  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const p = y * width + x;
      const i = p * 4;
      if (pixels[i + 3] === 0) continue;

      let transparentNeighbors = 0;
      for (let yy = -1; yy <= 1; yy += 1) {
        for (let xx = -1; xx <= 1; xx += 1) {
          if (xx === 0 && yy === 0) continue;
          if (originalAlpha[p + yy * width + xx] < 12) transparentNeighbors += 1;
        }
      }

      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      if (transparentNeighbors >= 2 && g > r + 20 && g > b + 20) {
        const base = Math.max(r, b);
        pixels[i + 1] = Math.min(g, Math.round(base * 1.1 + 16));
        if (g > 150 && pixels[i + 3] < 220) pixels[i + 3] = Math.max(0, pixels[i + 3] - 40);
      }
    }
  }
}

function clearTransparentRgb(pixels) {
  for (let i = 0; i < pixels.length; i += 4) {
    if (pixels[i + 3] < 8) {
      pixels[i] = 0;
      pixels[i + 1] = 0;
      pixels[i + 2] = 0;
    }
  }
}

function encodeRgbaPng(width, height, pixels) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y += 1) {
    const rowStart = y * (stride + 1);
    raw[rowStart] = 0;
    pixels.copy(raw, rowStart + 1, y * stride, y * stride + stride);
  }

  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function chunk(type, data) {
  const typeBuffer = Buffer.from(type, 'ascii');
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  typeBuffer.copy(out, 4);
  data.copy(out, 8);
  out.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 8 + data.length);
  return out;
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let i = 0; i < 8; i += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function suggestedAction(info, stats) {
  if (info.hasAlpha && stats.greenRatio <= 0.01) return 'alpha-present: verify on dark/checker background';
  if (stats.greenRatio > 0.15) return 'needs-green-key: remove #00FF00-like background, then inspect edge fringe';
  if (stats.checkerSuspect) return 'checker-suspect: inspect manually before use';
  return 'manual-review';
}

function colorTypeName(type) {
  return {
    0: 'L',
    2: 'RGB',
    3: 'P',
    4: 'LA',
    6: 'RGBA',
  }[type] ?? `colorType${type}`;
}

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function clampInt(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function isGreenScreen(r, g, b) {
  return g > 180 && r < 80 && b < 100 && g - r > 120 && g - b > 90;
}

function greenCandidate(r, g, b) {
  return g > 120 && g > r + 45 && g > b + 45;
}

function smoothstep(edge0, edge1, value) {
  const x = Math.max(0, Math.min(1, (value - edge0) / (edge1 - edge0)));
  return x * x * (3 - 2 * x);
}

function pct(value) {
  return `${(value * 100).toFixed(2)}%`;
}
