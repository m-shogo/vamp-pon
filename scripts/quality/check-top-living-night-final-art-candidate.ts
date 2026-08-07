import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { inflateSync } from 'node:zlib';

type FinalArtStatus = {
  schemaVersion: number;
  candidateGenerated: boolean;
  candidatePath: string;
  expectedWidth: number;
  expectedHeight: number;
  core5ReferenceCount: number;
  core5IdentityReviewed: boolean;
  cropReviewComplete: boolean;
  motionSeparationReviewed: boolean;
  humanVisualReviewComplete: boolean;
  approvedAsFinal: boolean;
  runtimeCaptureComplete: boolean;
  runtimeApproved: boolean;
  finalApprovalBlocked: boolean;
  candidateSha256: string;
  reviewedAtUtc: string;
  notes: string;
};

type MotionStatus = {
  normalMotion: { executed: boolean; result: string; reviewDurationSeconds: number };
  reducedMotion: { executed: boolean; result: string; reviewDurationSeconds: number };
  motionApproved: boolean;
  runtimeApproved: boolean;
  finalApprovalBlocked: boolean;
};

type DecodedPng = {
  width: number;
  height: number;
  rgba: Uint8Array;
};

type PixelMetrics = {
  meanLuminance: number;
  luminanceStdDev: number;
  nearWhiteRatio: number;
  opaqueRatio: number;
};

const root = process.cwd();
const statusPath = join(
  root,
  'docs/design-targets/generated/top-living-night-v3/final-art-status.json',
);
const motionStatusPath = join(
  root,
  'docs/design-targets/generated/top-living-night-v3/motion-review-status.json',
);

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
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

function decodePng(bytes: Buffer): DecodedPng {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  invariant(bytes.subarray(0, 8).equals(signature), 'TOP final-art PNG signature mismatch');

  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = -1;
  let interlace = -1;
  const idatChunks: Buffer[] = [];

  while (offset + 12 <= bytes.length) {
    const length = bytes.readUInt32BE(offset);
    const type = bytes.toString('ascii', offset + 4, offset + 8);
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;
    invariant(dataEnd + 4 <= bytes.length, `TOP final-art PNG chunk ${type} is truncated`);

    if (type === 'IHDR') {
      width = bytes.readUInt32BE(dataStart);
      height = bytes.readUInt32BE(dataStart + 4);
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

  invariant(width > 0 && height > 0, 'TOP final-art PNG dimensions are missing');
  invariant(bitDepth === 8, `TOP final-art PNG must be 8-bit, got ${bitDepth}`);
  invariant(colorType === 2 || colorType === 6, `TOP final-art PNG must be RGB/RGBA, got color type ${colorType}`);
  invariant(interlace === 0, 'TOP final-art PNG must be non-interlaced for deterministic QA/import');
  invariant(idatChunks.length > 0, 'TOP final-art PNG has no IDAT payload');

  const channels = colorType === 6 ? 4 : 3;
  const bytesPerPixel = channels;
  const rowBytes = width * channels;
  const inflated = inflateSync(Buffer.concat(idatChunks));
  const expectedInflatedBytes = height * (rowBytes + 1);
  invariant(
    inflated.length === expectedInflatedBytes,
    `TOP final-art PNG decoded byte count mismatch: expected ${expectedInflatedBytes}, got ${inflated.length}`,
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
          throw new Error(`TOP final-art PNG uses unsupported filter ${filter}`);
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

function computePixelMetrics(image: DecodedPng): PixelMetrics {
  let luminanceSum = 0;
  let luminanceSquaredSum = 0;
  let nearWhite = 0;
  let opaque = 0;
  const pixelCount = image.width * image.height;

  for (let pixel = 0; pixel < pixelCount; pixel += 1) {
    const index = pixel * 4;
    const r = image.rgba[index] / 255;
    const g = image.rgba[index + 1] / 255;
    const b = image.rgba[index + 2] / 255;
    const a = image.rgba[index + 3] / 255;
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    luminanceSum += luminance;
    luminanceSquaredSum += luminance * luminance;
    if (a > 0.9 && r > 0.94 && g > 0.94 && b > 0.94) nearWhite += 1;
    if (a > 0.98) opaque += 1;
  }

  const meanLuminance = luminanceSum / pixelCount;
  const variance = Math.max(0, luminanceSquaredSum / pixelCount - meanLuminance ** 2);
  return {
    meanLuminance,
    luminanceStdDev: Math.sqrt(variance),
    nearWhiteRatio: nearWhite / pixelCount,
    opaqueRatio: opaque / pixelCount,
  };
}

invariant(existsSync(statusPath), 'TOP final-art status manifest is missing');
invariant(existsSync(motionStatusPath), 'TOP motion review status is missing');
const status = JSON.parse(readFileSync(statusPath, 'utf8')) as FinalArtStatus;
const motion = JSON.parse(readFileSync(motionStatusPath, 'utf8')) as MotionStatus;

invariant(status.schemaVersion === 1, 'TOP final-art status schema mismatch');
invariant(
  status.candidatePath ===
    'docs/design-targets/generated/top-living-night-v3/final/top-living-night-core5-final-430x932.png',
  'TOP final-art candidate path is not canonical',
);
invariant(status.expectedWidth === 430, 'TOP final-art expected width must be 430');
invariant(status.expectedHeight === 932, 'TOP final-art expected height must be 932');
invariant(status.core5ReferenceCount === 5, 'TOP final-art must require exactly five Core5 references');

const candidatePath = join(root, status.candidatePath);
if (!status.candidateGenerated) {
  invariant(!existsSync(candidatePath), 'TOP final-art PNG exists while candidateGenerated=false');
  invariant(status.candidateSha256 === '', 'uncreated TOP candidate must not have a SHA-256');
  invariant(!status.core5IdentityReviewed, 'uncreated TOP candidate cannot have identity review');
  invariant(!status.cropReviewComplete, 'uncreated TOP candidate cannot have crop review');
  invariant(!status.motionSeparationReviewed, 'uncreated TOP candidate cannot have motion review');
  invariant(!status.humanVisualReviewComplete, 'uncreated TOP candidate cannot have human visual review');
  invariant(!status.approvedAsFinal, 'uncreated TOP candidate cannot be final-approved');
  invariant(!status.runtimeCaptureComplete, 'uncreated TOP candidate cannot have runtime capture approval');
  invariant(!status.runtimeApproved, 'uncreated TOP candidate cannot be runtime-approved');
  invariant(status.finalApprovalBlocked, 'uncreated TOP candidate must keep final approval blocked');
  invariant(status.reviewedAtUtc === '', 'uncreated TOP candidate must not have a review timestamp');
  invariant(!motion.motionApproved, 'motion cannot be final-approved before the final TOP candidate exists');
  invariant(!motion.runtimeApproved, 'motion runtime approval cannot precede the final TOP candidate');
  invariant(motion.finalApprovalBlocked, 'motion boundary must remain blocked before final candidate generation');
  console.log('TOP Living Night final-art candidate: honest NOT_RUN boundary');
  console.log('expected: Core5-locked 430x932 final candidate at canonical path');
  process.exit(0);
}

invariant(existsSync(candidatePath), 'TOP final-art candidateGenerated=true but PNG is missing');
const png = readFileSync(candidatePath);
const image = decodePng(png);
invariant(image.width === status.expectedWidth, 'TOP final-art PNG width mismatch');
invariant(image.height === status.expectedHeight, 'TOP final-art PNG height mismatch');

const metrics = computePixelMetrics(image);
invariant(metrics.opaqueRatio > 0.98, 'TOP final-art candidate is unexpectedly transparent');
invariant(metrics.luminanceStdDev > 0.075, 'TOP final-art candidate is too flat and may be blank/single-color');
invariant(metrics.meanLuminance > 0.025, 'TOP final-art candidate is nearly black');
invariant(metrics.meanLuminance < 0.82, 'TOP final-art candidate is overwhelmingly bright');
invariant(metrics.nearWhiteRatio < 0.12, 'TOP final-art candidate contains too much near-white area');

const sha = createHash('sha256').update(png).digest('hex');
invariant(/^[0-9a-f]{64}$/.test(status.candidateSha256), 'TOP final-art SHA-256 is missing/invalid');
invariant(sha === status.candidateSha256, 'TOP final-art SHA-256 mismatch');

if (status.approvedAsFinal) {
  invariant(status.core5IdentityReviewed, 'final-approved TOP requires Core5 identity review');
  invariant(status.cropReviewComplete, 'final-approved TOP requires 3-crop review');
  invariant(status.motionSeparationReviewed, 'final-approved TOP requires motion-separation review');
  invariant(status.humanVisualReviewComplete, 'final-approved TOP requires human visual review');
  invariant(status.runtimeCaptureComplete, 'final-approved TOP requires runtime capture');
  invariant(status.runtimeApproved, 'final-approved TOP requires runtime approval');
  invariant(!status.finalApprovalBlocked, 'final-approved TOP cannot remain blocked');
  invariant(status.reviewedAtUtc.length > 0, 'final-approved TOP requires review timestamp');
  invariant(motion.motionApproved, 'final-approved TOP requires approved runtime motion');
  invariant(motion.normalMotion.executed && motion.normalMotion.result === 'PASSED', 'final-approved TOP requires passed five-minute motion review');
  invariant(motion.normalMotion.reviewDurationSeconds >= 300, 'final-approved TOP requires at least five minutes of normal-motion review');
  invariant(motion.reducedMotion.executed && motion.reducedMotion.result === 'PASSED', 'final-approved TOP requires passed Reduced Motion review');
  invariant(motion.reducedMotion.reviewDurationSeconds >= 60, 'final-approved TOP requires at least one minute of Reduced Motion review');
  invariant(motion.runtimeApproved, 'final-approved TOP requires motion runtime approval');
  invariant(!motion.finalApprovalBlocked, 'final-approved TOP cannot retain the motion approval block');
} else {
  invariant(status.finalApprovalBlocked, 'non-final TOP candidate must keep final approval blocked');
  invariant(!status.runtimeApproved, 'non-final TOP candidate cannot be runtime-approved');
}

console.log('TOP Living Night final-art candidate contract: PASS');
console.log(`candidate: ${status.candidatePath}`);
console.log(`sha256: ${sha}`);
console.log(`mean=${metrics.meanLuminance.toFixed(4)} std=${metrics.luminanceStdDev.toFixed(4)} white=${metrics.nearWhiteRatio.toFixed(4)} opaque=${metrics.opaqueRatio.toFixed(4)}`);
console.log(`approvedAsFinal: ${status.approvedAsFinal}`);
console.log(`motionApproved: ${motion.motionApproved}`);
