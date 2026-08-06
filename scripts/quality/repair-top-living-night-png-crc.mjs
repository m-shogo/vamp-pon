#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const repoRoot = process.cwd();
const kitRoot = join(
  repoRoot,
  'docs/design-targets/generated/top-living-night-v2',
);
const manifestPath = join(kitRoot, 'manifest.json');
const originalManifestText = readFileSync(manifestPath, 'utf8');
const manifest = JSON.parse(originalManifestText);

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

function repairPng(path) {
  const data = Buffer.from(readFileSync(path));
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (!data.subarray(0, 8).equals(signature)) {
    throw new Error(`${path}: invalid PNG signature`);
  }

  let offset = 8;
  let repairedChunks = 0;
  let sawIend = false;

  while (offset < data.length) {
    if (offset + 12 > data.length) {
      throw new Error(`${path}: truncated PNG chunk header at ${offset}`);
    }

    const length = data.readUInt32BE(offset);
    const typeStart = offset + 4;
    const payloadStart = offset + 8;
    const payloadEnd = payloadStart + length;
    const crcOffset = payloadEnd;
    const nextOffset = crcOffset + 4;

    if (nextOffset > data.length) {
      throw new Error(`${path}: truncated PNG chunk at ${offset}`);
    }

    const type = data.subarray(typeStart, typeStart + 4).toString('ascii');
    const expected = crc32(data.subarray(typeStart, payloadEnd));
    const actual = data.readUInt32BE(crcOffset);

    if (actual !== expected) {
      data.writeUInt32BE(expected, crcOffset);
      repairedChunks += 1;
      console.log(
        `${path}: repaired ${type} CRC ${actual.toString(16).padStart(8, '0')} -> ${expected.toString(16).padStart(8, '0')}`,
      );
    }

    offset = nextOffset;
    if (type === 'IEND') {
      sawIend = true;
      break;
    }
  }

  if (!sawIend) {
    throw new Error(`${path}: IEND chunk is missing`);
  }
  if (offset !== data.length) {
    throw new Error(`${path}: unexpected bytes after IEND`);
  }

  if (repairedChunks > 0) {
    writeFileSync(path, data);
  }

  return { data, repairedChunks };
}

function replaceManifestProvenance(text, asset, bytes, sha256) {
  const lines = text.split('\n');
  const idToken = `\"id\":\"${asset.id}\"`;
  const index = lines.findIndex((line) => line.includes(idToken));
  if (index < 0) {
    throw new Error(`manifest asset line not found: ${asset.id}`);
  }

  lines[index] = lines[index]
    .replace(/\"bytes\":\d+/, `\"bytes\":${bytes}`)
    .replace(/\"sha256\":\"[0-9a-f]{64}\"/, `\"sha256\":\"${sha256}\"`);
  return lines.join('\n');
}

let totalRepairs = 0;
let nextManifestText = originalManifestText;
for (const asset of manifest.assets) {
  const path = join(kitRoot, asset.file);
  const { data, repairedChunks } = repairPng(path);
  totalRepairs += repairedChunks;

  if (repairedChunks > 0) {
    const sha256 = createHash('sha256').update(data).digest('hex');
    nextManifestText = replaceManifestProvenance(
      nextManifestText,
      asset,
      data.length,
      sha256,
    );
  }
}

if (nextManifestText !== originalManifestText) {
  writeFileSync(manifestPath, nextManifestText);
}

console.log(`TOP PNG CRC repair complete: ${totalRepairs} repaired chunk(s).`);
