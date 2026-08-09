import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { inflateSync } from 'node:zlib';

const root = process.cwd();
const captureRoot = join(
  root,
  'docs/design-targets/generated/loading-seasonal-v1/runtime-captures',
);
const manifestPath = join(
  root,
  'docs/design-targets/generated/loading-seasonal-v1/runtime-capture-manifest.json',
);

type Capture = {
  id: string;
  kind: 'loading' | 'top';
  season: string;
  file: string;
  width: number;
  height: number;
  sha256: string;
};

type Manifest = {
  executed: boolean;
  result: string;
  expectedCaptureCount: number;
  captureCount: number;
  captures: Capture[];
};

type DecodedPng = {
  width: number;
  height: number;
  rgba: Uint8Array;
};

type Metrics = {
  meanLuminance: number;
  luminanceStdDev: number;
  nearWhiteRatio: number;
  centralNearWhiteRatio: number;
  opaqueRatio: number;
  centralOpaqueRatio: number;
};

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

function readUInt32BE(bytes: Buffer, offset: number): number {
  return bytes.readUInt32BE(offset);
}

function paethPredictor(a: number, b: number, c: number): number {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

function decodePng(path: string): DecodedPng {
  const bytes = readFileSync(path);
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  invariant(bytes.subarray(0, 8).equals(signature), `invalid PNG signature: ${path}`);

  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = -1;
  let interlace = -1;
  const idatChunks: Buffer[] = [];

  while (offset + 12 <= bytes.length) {
    const length = readUInt32BE(bytes, offset);
    const type = bytes.toString('ascii', offset + 4, offset + 8);
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;
    invariant(dataEnd + 4 <= bytes.length, `truncated PNG chunk ${type}: ${path}`);

    if (type === 'IHDR') {
      width = readUInt32BE(bytes, dataStart);
      height = readUInt32BE(bytes, dataStart + 4);
      bitDepth = bytes[dataStart + 8];
      colorType = bytes[dataStart + 9];
      interlace = bytes[dataStart + 12];
    } else if (type === 'IDAT') {
      idatChunks.push(bytes.subarray(dataStart, dataEnd));
    } else if (type === 'IEND') {
      break;
    }

    offset = dataEnd + 4;
  }

  invariant(width > 0 && height > 0, `PNG dimensions missing: ${path}`);
  invariant(bitDepth === 8, `only 8-bit PNG is supported: ${path}`);
  invariant(colorType === 2 || colorType === 6, `unsupported PNG color type ${colorType}: ${path}`);
  invariant(interlace === 0, `interlaced PNG is not supported: ${path}`);
  invariant(idatChunks.length > 0, `PNG IDAT missing: ${path}`);

  const channels = colorType === 6 ? 4 : 3;
  const bytesPerPixel = channels;
  const rowBytes = width * channels;
  const inflated = inflateSync(Buffer.concat(idatChunks));
  const expectedInflatedBytes = height * (rowBytes + 1);
  invariant(
    inflated.length === expectedInflatedBytes,
    `unexpected inflated PNG size for ${path}: expected ${expectedInflatedBytes}, actual ${inflated.length}`,
  );

  const reconstructed = Buffer.alloc(height * rowBytes);
  let inputOffset = 0;

  for (let y = 0; y < height; y += 1) {
    const filter = inflated[inputOffset];
    inputOffset += 1;
    const rowOffset = y * rowBytes;
    const previousRowOffset = (y - 1) * rowBytes;

    for (let x = 0; x < rowBytes; x += 1) {
      const raw = inflated[inputOffset + x];
      const left = x >= bytesPerPixel ? reconstructed[rowOffset + x - bytesPerPixel] : 0;
      const up = y > 0 ? reconstructed[previousRowOffset + x] : 0;
      const upLeft = y > 0 && x >= bytesPerPixel
        ? reconstructed[previousRowOffset + x - bytesPerPixel]
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
          value = raw + paethPredictor(left, up, upLeft);
          break;
        default:
          throw new Error(`unsupported PNG filter ${filter}: ${path}`);
      }
      reconstructed[rowOffset + x] = value & 0xff;
    }

    inputOffset += rowBytes;
  }

  const rgba = new Uint8Array(width * height * 4);
  for (let pixel = 0; pixel < width * height; pixel += 1) {
    const source = pixel * channels;
    const target = pixel * 4;
    rgba[target] = reconstructed[source];
    rgba[target + 1] = reconstructed[source + 1];
    rgba[target + 2] = reconstructed[source + 2];
    rgba[target + 3] = channels === 4 ? reconstructed[source + 3] : 255;
  }

  return { width, height, rgba };
}

function computeMetrics(image: DecodedPng): Metrics {
  let luminanceSum = 0;
  let luminanceSquaredSum = 0;
  let nearWhite = 0;
  let opaque = 0;
  let centralNearWhite = 0;
  let centralOpaque = 0;
  let centralCount = 0;
  const pixelCount = image.width * image.height;

  const minX = Math.floor(image.width * 0.1);
  const maxX = Math.ceil(image.width * 0.9);
  const minY = Math.floor(image.height * 0.1);
  const maxY = Math.ceil(image.height * 0.85);

  for (let y = 0; y < image.height; y += 1) {
    for (let x = 0; x < image.width; x += 1) {
      const index = (y * image.width + x) * 4;
      const r = image.rgba[index] / 255;
      const g = image.rgba[index + 1] / 255;
      const b = image.rgba[index + 2] / 255;
      const a = image.rgba[index + 3] / 255;
      const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      const isNearWhite = a > 0.9 && r > 0.94 && g > 0.94 && b > 0.94;
      const isOpaque = a > 0.98;

      luminanceSum += luminance;
      luminanceSquaredSum += luminance * luminance;
      if (isNearWhite) nearWhite += 1;
      if (isOpaque) opaque += 1;

      if (x >= minX && x < maxX && y >= minY && y < maxY) {
        centralCount += 1;
        if (isNearWhite) centralNearWhite += 1;
        if (isOpaque) centralOpaque += 1;
      }
    }
  }

  const meanLuminance = luminanceSum / pixelCount;
  const variance = Math.max(0, luminanceSquaredSum / pixelCount - meanLuminance ** 2);
  return {
    meanLuminance,
    luminanceStdDev: Math.sqrt(variance),
    nearWhiteRatio: nearWhite / pixelCount,
    centralNearWhiteRatio: centralNearWhite / centralCount,
    opaqueRatio: opaque / pixelCount,
    centralOpaqueRatio: centralOpaque / centralCount,
  };
}

function format(value: number): string {
  return value.toFixed(4);
}

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as Manifest;
invariant(manifest.executed, 'render-content QA requires an executed capture manifest');
invariant(manifest.result === 'PASSED', 'render-content QA requires PASSED capture manifest');
invariant(manifest.captureCount === 15, 'render-content QA requires 15 captures');
invariant(manifest.captures.length === 15, 'render-content QA requires 15 capture records');

for (const capture of manifest.captures) {
  const path = join(captureRoot, capture.file);
  const image = decodePng(path);
  invariant(
    image.width === capture.width && image.height === capture.height,
    `${capture.id}: decoded dimensions do not match manifest`,
  );

  const metrics = computeMetrics(image);
  invariant(metrics.opaqueRatio > 0.98, `${capture.id}: capture is unexpectedly transparent`);
  invariant(metrics.centralOpaqueRatio > 0.98, `${capture.id}: central capture area is unexpectedly transparent`);
  invariant(metrics.luminanceStdDev > 0.075, `${capture.id}: image lacks visual variation and may be blank`);
  invariant(metrics.meanLuminance > 0.025, `${capture.id}: image is nearly black`);
  invariant(metrics.meanLuminance < 0.86, `${capture.id}: image is overwhelmingly bright`);

  if (capture.kind === 'top') {
    invariant(metrics.nearWhiteRatio < 0.12, `${capture.id}: TOP contains too much near-white area`);
    invariant(
      metrics.centralNearWhiteRatio < 0.14,
      `${capture.id}: TOP central area is too white and may have regressed to the blank screen`,
    );
  } else {
    invariant(metrics.nearWhiteRatio < 0.32, `${capture.id}: Loading image contains too much near-white area`);
    invariant(metrics.centralNearWhiteRatio < 0.38, `${capture.id}: Loading central area is unexpectedly white`);
  }

  console.log(
    `${capture.id}: mean=${format(metrics.meanLuminance)} ` +
      `std=${format(metrics.luminanceStdDev)} ` +
      `white=${format(metrics.nearWhiteRatio)} ` +
      `centralWhite=${format(metrics.centralNearWhiteRatio)} ` +
      `opaque=${format(metrics.opaqueRatio)}`,
  );
}

console.log('Loading/TOP render-content QA: PASS');
console.log('guarded: decoded pixels / white-screen regression / blank or flat captures / opacity');
