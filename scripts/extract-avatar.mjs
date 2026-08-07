/**
 * Pulls the portrait out of the source résumé PDF.
 *
 * `info.pdf` stores the photo as two objects: a DCTDecode (JPEG) colour image
 * and a matching FlateDecode DeviceGray `/SMask` holding its alpha channel.
 * Decoding the JPEG to bake in the alpha would need an image library we do not
 * have, so instead we emit both pieces and let CSS recombine them:
 *
 *   public/avatar.jpg       — the JPEG stream, byte-for-byte
 *   public/avatar-mask.png  — the alpha channel as an 8-bit grayscale PNG
 *
 * The mask is applied with `mask-image` in `Hero`, which reproduces the exact
 * silhouette from the original document.
 *
 * Also copies the PDF itself to public/ so the site can offer it for download.
 *
 * Usage: npm run extract:avatar
 */
import { deflateSync, inflateSync } from 'node:zlib';
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PDF = join(ROOT, 'info.pdf');
const PUBLIC = join(ROOT, 'public');

/** Resolve `N 0 obj <number> endobj`, used for indirect /Length values. */
function readIndirectNumber(pdf, objNum) {
  const re = new RegExp(`(?:^|[^0-9])${objNum}\\s+0\\s+obj\\s+(\\d+)\\s*endobj`, 's');
  const match = re.exec(pdf.toString('latin1'));
  if (!match) throw new Error(`could not resolve object ${objNum} as a number`);
  return Number(match[1]);
}

/**
 * Locate an image XObject and return its dictionary plus raw (still encoded)
 * stream bytes.
 */
function readImageObject(pdf, objNum) {
  const latin = pdf.toString('latin1');
  const re = new RegExp(`(?:^|[^0-9])${objNum}\\s+0\\s+obj\\s*(<<.*?>>)\\s*stream\\r?\\n`, 's');
  const match = re.exec(latin);
  if (!match) throw new Error(`image object ${objNum} not found`);

  const dict = match[1];
  const start = match.index + match[0].length;

  // /Length is an indirect reference in this file; fall back to a literal.
  const lengthRef = /\/Length\s+(\d+)\s+0\s+R/.exec(dict);
  const length = lengthRef
    ? readIndirectNumber(pdf, Number(lengthRef[1]))
    : Number(/\/Length\s+(\d+)/.exec(dict)[1]);

  const width = Number(/\/Width\s+(\d+)/.exec(dict)[1]);
  const height = Number(/\/Height\s+(\d+)/.exec(dict)[1]);

  return { dict, width, height, data: pdf.subarray(start, start + length) };
}

/* --- minimal PNG writer (8-bit grayscale, no dependencies) --------------- */

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function pngChunk(type, body) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(body.length);
  const typed = Buffer.concat([Buffer.from(type, 'latin1'), body]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typed));
  return Buffer.concat([length, typed, crc]);
}

/**
 * Write the mask as white RGBA with the mask value in the *alpha* channel.
 *
 * A grayscale PNG would be the obvious encoding, but CSS `mask-image` defaults
 * to `mask-mode: match-source`, which for an image with no alpha channel means
 * "fully opaque" — the mask would have no effect at all. Carrying the value in
 * alpha makes it work everywhere without relying on `mask-mode: luminance`.
 *
 * @param {Buffer} gray one byte per pixel, row-major
 */
function alphaMaskPng(gray, width, height) {
  const stride = width * 4;
  // Prefix every scanline with filter type 0 (None).
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    const rowStart = y * (stride + 1);
    raw[rowStart] = 0;
    for (let x = 0; x < width; x++) {
      const o = rowStart + 1 + x * 4;
      raw[o] = 255;
      raw[o + 1] = 255;
      raw[o + 2] = 255;
      raw[o + 3] = gray[y * width + x];
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // colour type: RGBA
  ihdr[10] = 0; // deflate
  ihdr[11] = 0; // adaptive filtering
  ihdr[12] = 0; // no interlace

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', deflateSync(raw, { level: 9 })),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

/* --- run ----------------------------------------------------------------- */

const pdf = readFileSync(PDF);
mkdirSync(PUBLIC, { recursive: true });

// Object 6 is the 809x1080 JPEG portrait; object 1 is its alpha /SMask.
const photo = readImageObject(pdf, 6);
if (!photo.dict.includes('/DCTDecode')) {
  throw new Error('expected object 6 to be a DCTDecode (JPEG) image');
}
writeFileSync(join(PUBLIC, 'avatar.jpg'), photo.data);
console.log(`avatar.jpg      ${photo.width}x${photo.height}, ${photo.data.length} bytes`);

const mask = readImageObject(pdf, 1);
const gray = inflateSync(mask.data);
const expected = mask.width * mask.height;
if (gray.length !== expected) {
  throw new Error(`mask is ${gray.length} bytes, expected ${expected}`);
}
const png = alphaMaskPng(gray, mask.width, mask.height);
writeFileSync(join(PUBLIC, 'avatar-mask.png'), png);
console.log(`avatar-mask.png ${mask.width}x${mask.height}, ${png.length} bytes`);

copyFileSync(PDF, join(PUBLIC, 'Egor_Morozov_CV.pdf'));
console.log('Egor_Morozov_CV.pdf copied');
