import { deflateSync, inflateSync } from 'node:zlib';

export type RgbaImage = { width: number; height: number; data: Uint8Array };

function paeth(a: number, b: number, c: number): number {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  return pb <= pc ? b : c;
}

export function decodePng(buffer: Buffer): RgbaImage {
  if (buffer.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') throw new Error('not a PNG');

  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  let interlace = 0;
  const idat: Buffer[] = [];
  let palette: Buffer | null = null;
  let transparency: Buffer | null = null;

  while (offset + 12 <= buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.subarray(offset + 4, offset + 8).toString('ascii');
    const data = buffer.subarray(offset + 8, offset + 8 + length);
    offset += length + 12;
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
      interlace = data[12];
    } else if (type === 'IDAT') idat.push(data);
    else if (type === 'PLTE') palette = data;
    else if (type === 'tRNS') transparency = data;
    else if (type === 'IEND') break;
  }

  if (!width || !height) throw new Error('PNG has no valid IHDR');
  if (bitDepth !== 8) throw new Error(`unsupported PNG bit depth: ${bitDepth}; expected 8`);
  if (interlace !== 0) throw new Error('interlaced PNG is not supported');

  const channelsByType: Record<number, number> = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 };
  const channels = channelsByType[colorType];
  if (!channels) throw new Error(`unsupported PNG color type: ${colorType}`);
  if (colorType === 3 && !palette) throw new Error('indexed PNG has no palette');

  const rowBytes = width * channels;
  const raw = inflateSync(Buffer.concat(idat));
  if (raw.length !== (rowBytes + 1) * height) throw new Error('unexpected inflated PNG size');

  const unfiltered = Buffer.alloc(rowBytes * height);
  for (let y = 0; y < height; y += 1) {
    const rawRow = y * (rowBytes + 1);
    const filter = raw[rawRow];
    const rowOffset = y * rowBytes;
    const previousOffset = (y - 1) * rowBytes;
    for (let x = 0; x < rowBytes; x += 1) {
      const value = raw[rawRow + 1 + x];
      const left = x >= channels ? unfiltered[rowOffset + x - channels] : 0;
      const up = y > 0 ? unfiltered[previousOffset + x] : 0;
      const upLeft = y > 0 && x >= channels ? unfiltered[previousOffset + x - channels] : 0;
      let reconstructed = value;
      if (filter === 1) reconstructed += left;
      else if (filter === 2) reconstructed += up;
      else if (filter === 3) reconstructed += Math.floor((left + up) / 2);
      else if (filter === 4) reconstructed += paeth(left, up, upLeft);
      else if (filter !== 0) throw new Error(`unsupported PNG filter: ${filter}`);
      unfiltered[rowOffset + x] = reconstructed & 0xff;
    }
  }

  const rgba = new Uint8Array(width * height * 4);
  for (let i = 0; i < width * height; i += 1) {
    const source = i * channels;
    const target = i * 4;
    if (colorType === 6) {
      rgba.set(unfiltered.subarray(source, source + 4), target);
    } else if (colorType === 2) {
      const r = unfiltered[source];
      const g = unfiltered[source + 1];
      const b = unfiltered[source + 2];
      rgba[target] = r;
      rgba[target + 1] = g;
      rgba[target + 2] = b;
      rgba[target + 3] = transparency && transparency.length >= 6 &&
        r === (transparency.readUInt16BE(0) & 0xff) &&
        g === (transparency.readUInt16BE(2) & 0xff) &&
        b === (transparency.readUInt16BE(4) & 0xff) ? 0 : 255;
    } else if (colorType === 3) {
      const index = unfiltered[source];
      const paletteOffset = index * 3;
      rgba[target] = palette?.[paletteOffset] ?? 0;
      rgba[target + 1] = palette?.[paletteOffset + 1] ?? 0;
      rgba[target + 2] = palette?.[paletteOffset + 2] ?? 0;
      rgba[target + 3] = transparency?.[index] ?? 255;
    } else if (colorType === 4) {
      const value = unfiltered[source];
      rgba[target] = value;
      rgba[target + 1] = value;
      rgba[target + 2] = value;
      rgba[target + 3] = unfiltered[source + 1];
    } else {
      const value = unfiltered[source];
      rgba[target] = value;
      rgba[target + 1] = value;
      rgba[target + 2] = value;
      rgba[target + 3] = transparency && transparency.length >= 2 &&
        value === (transparency.readUInt16BE(0) & 0xff) ? 0 : 255;
    }
  }
  return { width, height, data: rgba };
}

function crc32(buffer: Buffer): number {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let i = 0; i < 8; i += 1) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function uint32(value: number): Buffer {
  const buffer = Buffer.alloc(4);
  buffer.writeUInt32BE(value >>> 0, 0);
  return buffer;
}

function chunk(type: string, data: Buffer): Buffer {
  const typeBuffer = Buffer.from(type, 'ascii');
  return Buffer.concat([uint32(data.length), typeBuffer, data, uint32(crc32(Buffer.concat([typeBuffer, data])))]);
}

export function encodePng(image: RgbaImage): Buffer {
  const rowBytes = image.width * 4;
  const scanlines = Buffer.alloc((rowBytes + 1) * image.height);
  for (let y = 0; y < image.height; y += 1) {
    const destination = y * (rowBytes + 1);
    scanlines[destination] = 0;
    Buffer.from(image.data.subarray(y * rowBytes, (y + 1) * rowBytes)).copy(scanlines, destination + 1);
  }
  const ihdr = Buffer.concat([uint32(image.width), uint32(image.height), Buffer.from([8, 6, 0, 0, 0])]);
  return Buffer.concat([
    Buffer.from('89504e470d0a1a0a', 'hex'),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(scanlines, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

export function pixelOffset(image: RgbaImage, x: number, y: number): number {
  return (y * image.width + x) * 4;
}

export function blankImage(width: number, height: number): RgbaImage {
  return { width, height, data: new Uint8Array(width * height * 4) };
}
