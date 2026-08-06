#!/usr/bin/env node
import { createHash } from 'node:crypto';
import {
  readFileSync,
  writeFileSync,
  renameSync,
  rmSync,
} from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

const repoRoot = process.cwd();
const kitRoot = join(
  repoRoot,
  'docs/design-targets/generated/top-living-night-v2',
);
const manifestPath = join(kitRoot, 'manifest.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

const pngSignature = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);

const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n += 1) {
  let c = n;
  for (let k = 0; k < 8; k += 1) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c >>> 0;
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function inspectPngStrict(path) {
  const data = readFileSync(path);
  if (!data.subarray(0, 8).equals(pngSignature)) {
    throw new Error('invalid PNG signature');
  }

  let offset = 8;
  let sawIhdr = false;
  let sawIdat = false;
  let sawIend = false;
  let width = 0;
  let height = 0;
  let colorType = -1;

  while (offset < data.length) {
    if (offset + 12 > data.length) {
      throw new Error(`truncated PNG chunk header at byte ${offset}`);
    }

    const length = data.readUInt32BE(offset);
    const typeStart = offset + 4;
    const payloadStart = offset + 8;
    const payloadEnd = payloadStart + length;
    const crcOffset = payloadEnd;
    const nextOffset = crcOffset + 4;

    if (nextOffset > data.length) {
      throw new Error(`truncated PNG chunk at byte ${offset}`);
    }

    const type = data.subarray(typeStart, typeStart + 4).toString('ascii');
    const expected = crc32(data.subarray(typeStart, payloadEnd));
    const actual = data.readUInt32BE(crcOffset);
    if (actual !== expected) {
      throw new Error(
        `${type} CRC mismatch ${actual.toString(16).padStart(8, '0')} != ${expected.toString(16).padStart(8, '0')}`,
      );
    }

    if (type === 'IHDR') {
      if (sawIhdr || length !== 13 || offset !== 8) {
        throw new Error('invalid IHDR placement or length');
      }
      sawIhdr = true;
      width = data.readUInt32BE(payloadStart);
      height = data.readUInt32BE(payloadStart + 4);
      colorType = data.readUInt8(payloadStart + 9);
    } else if (type === 'IDAT') {
      sawIdat = true;
    } else if (type === 'IEND') {
      if (length !== 0) throw new Error('invalid IEND length');
      sawIend = true;
      offset = nextOffset;
      break;
    }

    offset = nextOffset;
  }

  if (!sawIhdr) throw new Error('IHDR is missing');
  if (!sawIdat) throw new Error('IDAT is missing');
  if (!sawIend) throw new Error('IEND is missing');
  if (offset !== data.length) throw new Error('unexpected bytes after IEND');

  return { data, width, height, colorType };
}

function runDecoder(label, command, args, outputPath) {
  rmSync(outputPath, { force: true });
  const result = spawnSync(command, args, {
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
  });

  if (result.error) {
    return { ok: false, message: `${label}: ${result.error.message}` };
  }
  if (result.status !== 0) {
    const detail = `${result.stderr ?? ''}\n${result.stdout ?? ''}`.trim();
    return {
      ok: false,
      message: `${label}: exit ${result.status}${detail ? `: ${detail}` : ''}`,
    };
  }
  return { ok: true, message: label };
}

function normalizePng(path, asset) {
  const outputPath = `${path}.normalized.tmp.png`;
  const pythonScript = [
    'import sys',
    'from PIL import Image, ImageFile',
    'ImageFile.LOAD_TRUNCATED_IMAGES = True',
    'with Image.open(sys.argv[1]) as image:',
    '    image.load()',
    '    image.save(sys.argv[2], format="PNG", optimize=False)',
  ].join('\n');

  const attempts = [
    {
      label: 'macOS sips',
      command: '/usr/bin/sips',
      args: ['-s', 'format', 'png', path, '--out', outputPath],
    },
    {
      label: 'Python Pillow tolerant decode',
      command: 'python3',
      args: ['-c', pythonScript, path, outputPath],
    },
    {
      label: 'ffmpeg',
      command: 'ffmpeg',
      args: ['-v', 'error', '-y', '-i', path, '-frames:v', '1', outputPath],
    },
    {
      label: 'ImageMagick',
      command: 'magick',
      args: [path, outputPath],
    },
  ];

  const failures = [];
  try {
    for (const attempt of attempts) {
      const result = runDecoder(
        attempt.label,
        attempt.command,
        attempt.args,
        outputPath,
      );
      if (!result.ok) {
        failures.push(result.message);
        continue;
      }

      try {
        const normalized = inspectPngStrict(outputPath);
        if (normalized.width !== asset.width || normalized.height !== asset.height) {
          throw new Error(
            `dimension changed to ${normalized.width}x${normalized.height}`,
          );
        }
        if (asset.alphaRequired && ![4, 6].includes(normalized.colorType)) {
          throw new Error(
            `required alpha channel was lost (color type ${normalized.colorType})`,
          );
        }

        renameSync(outputPath, path);
        return attempt.label;
      } catch (error) {
        failures.push(`${attempt.label}: ${error.message}`);
      }
    }
  } finally {
    rmSync(outputPath, { force: true });
  }

  throw new Error(
    `${asset.file}: no installed decoder could safely normalize the PNG\n${failures.join('\n')}`,
  );
}

let normalizedCount = 0;
let manifestChanged = false;
for (const asset of manifest.assets) {
  const path = join(kitRoot, asset.file);
  let png;

  try {
    png = inspectPngStrict(path);
  } catch (error) {
    console.log(`${asset.file}: strict PNG validation failed: ${error.message}`);
    const decoder = normalizePng(path, asset);
    console.log(`${asset.file}: safely re-encoded with ${decoder}`);
    normalizedCount += 1;
    png = inspectPngStrict(path);
  }

  if (png.width !== asset.width || png.height !== asset.height) {
    throw new Error(
      `${asset.file}: expected ${asset.width}x${asset.height}, got ${png.width}x${png.height}`,
    );
  }
  if (asset.alphaRequired && ![4, 6].includes(png.colorType)) {
    throw new Error(`${asset.file}: required alpha channel is missing`);
  }

  const sha256 = createHash('sha256').update(png.data).digest('hex');
  if (asset.bytes !== png.data.length || asset.sha256 !== sha256) {
    asset.bytes = png.data.length;
    asset.sha256 = sha256;
    manifestChanged = true;
  }
}

if (manifestChanged) {
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
}

console.log(
  `TOP PNG normalization complete: ${normalizedCount} file(s) re-encoded, manifest ${manifestChanged ? 'updated' : 'unchanged'}.`,
);
