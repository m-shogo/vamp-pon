import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { inflateSync } from 'node:zlib';

type AlphaMetrics = {
  width: number;
  height: number;
  transparentRatio: number;
  opaqueRatio: number;
  meanAlpha: number;
};

const root = process.cwd();
const layerRoot = join(
  root,
  'docs/design-targets/generated/top-living-night-v2/layers',
);

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

function paeth(a: number, b: number, c: number): number {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

function decodeAlpha(path: string): AlphaMetrics {
  const bytes = readFileSync(path);
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  invariant(bytes.subarray(0, 8).equals(signature), `${path}: invalid PNG signature`);

  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = -1;
  let colorType = -1;
  let interlace = -1;
  const idat: Buffer[] = [];

  while (offset + 12 <= bytes.length) {
    const length = bytes.readUInt32BE(offset);
    const type = bytes.toString('ascii', offset + 4, offset + 8);
    const start = offset + 8;
    const end = start + length;
    invariant(end + 4 <= bytes.length, `${path}: truncated PNG chunk ${type}`);

    if (type === 'IHDR') {
      width = bytes.readUInt32BE(start);
      height = bytes.readUInt32BE(start + 4);
      bitDepth = bytes[start + 8];
      colorType = bytes[start + 9];
      interlace = bytes[start + 12];
    } else if (type === 'IDAT') {
      idat.push(bytes.subarray(start, end));
    } else if (type === 'IEND') {
      break;
    }
    offset = end + 4;
  }

  invariant(width === 852 && height === 1846, `${path}: sky overlay must stay aligned at 852x1846`);
  invariant(bitDepth === 8, `${path}: only 8-bit PNG is supported`);
  invariant(colorType === 6, `${path}: sky overlay must remain RGBA`);
  invariant(interlace === 0, `${path}: interlaced sky overlay is unsupported`);
  invariant(idat.length > 0, `${path}: PNG IDAT missing`);

  const channels = 4;
  const rowBytes = width * channels;
  const inflated = inflateSync(Buffer.concat(idat));
  invariant(
    inflated.length === height * (rowBytes + 1),
    `${path}: unexpected inflated PNG length`,
  );

  const reconstructed = Buffer.alloc(height * rowBytes);
  let input = 0;
  for (let y = 0; y < height; y += 1) {
    const filter = inflated[input];
    input += 1;
    const row = y * rowBytes;
    const previous = (y - 1) * rowBytes;

    for (let x = 0; x < rowBytes; x += 1) {
      const raw = inflated[input + x];
      const left = x >= channels ? reconstructed[row + x - channels] : 0;
      const up = y > 0 ? reconstructed[previous + x] : 0;
      const upLeft = y > 0 && x >= channels
        ? reconstructed[previous + x - channels]
        : 0;
      let value: number;
      switch (filter) {
        case 0:
          value = raw;
          break;
        case 1:
          value = raw + left;
          break;
        case 2:
          value = raw + up;
          break;
        case 3:
          value = raw + Math.floor((left + up) / 2);
          break;
        case 4:
          value = raw + paeth(left, up, upLeft);
          break;
        default:
          throw new Error(`${path}: unsupported PNG filter ${filter}`);
      }
      reconstructed[row + x] = value & 0xff;
    }
    input += rowBytes;
  }

  let transparent = 0;
  let opaque = 0;
  let alphaSum = 0;
  const pixels = width * height;
  for (let pixel = 0; pixel < pixels; pixel += 1) {
    const alpha = reconstructed[pixel * 4 + 3];
    alphaSum += alpha;
    if (alpha === 0) transparent += 1;
    if (alpha === 255) opaque += 1;
  }

  return {
    width,
    height,
    transparentRatio: transparent / pixels,
    opaqueRatio: opaque / pixels,
    meanAlpha: alphaSum / pixels,
  };
}

const rules = [
  {
    file: '01-stars.png',
    minTransparentRatio: 0.99,
    maxOpaqueRatio: 0.002,
    maxMeanAlpha: 1.0,
  },
  {
    file: '02-clouds-far.png',
    minTransparentRatio: 0.95,
    maxOpaqueRatio: 0.001,
    maxMeanAlpha: 4.0,
  },
  {
    file: '03-clouds-near.png',
    minTransparentRatio: 0.80,
    maxOpaqueRatio: 0.001,
    maxMeanAlpha: 20.0,
  },
] as const;

for (const rule of rules) {
  const metrics = decodeAlpha(join(layerRoot, rule.file));
  invariant(
    metrics.transparentRatio >= rule.minTransparentRatio,
    `${rule.file}: transparent ratio regressed (${metrics.transparentRatio.toFixed(4)})`,
  );
  invariant(
    metrics.opaqueRatio <= rule.maxOpaqueRatio,
    `${rule.file}: opaque ratio is too high (${metrics.opaqueRatio.toFixed(4)})`,
  );
  invariant(
    metrics.meanAlpha <= rule.maxMeanAlpha,
    `${rule.file}: mean alpha is too high (${metrics.meanAlpha.toFixed(2)})`,
  );
  console.log(
    `${rule.file}: transparent=${metrics.transparentRatio.toFixed(4)} ` +
      `opaque=${metrics.opaqueRatio.toFixed(4)} meanAlpha=${metrics.meanAlpha.toFixed(2)}`,
  );
}

console.log('TOP Living Night transparent sky overlays: PASS');
console.log('guarded: Stars / CloudsFar / CloudsNear stay sparse enough to animate safely over the V3 base composite');
