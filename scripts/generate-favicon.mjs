import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import sharp from 'sharp';

// SVG definition of the "S" icon for Social Geeks SMM
// Modern, crisp, high-contrast S designed for readability at 16x16 up to 512x512.
export const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Background Gradient: Rich Electric Blue to Deep Royal Violet -->
    <linearGradient id="sgBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1d4ed8" />
      <stop offset="45%" stop-color="#2563eb" />
      <stop offset="100%" stop-color="#7c3aed" />
    </linearGradient>

    <!-- Subtle Radial Glow -->
    <radialGradient id="sgGlow" cx="45%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#60a5fa" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#1d4ed8" stop-opacity="0" />
    </radialGradient>

    <!-- Sleek Glass Border -->
    <linearGradient id="sgBorder" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.5" />
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0.1" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
    </linearGradient>

    <!-- S Upper Gradient -->
    <linearGradient id="sTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#dbeafe" />
    </linearGradient>

    <!-- Drop Shadow for S -->
    <filter id="sgShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#0f172a" flood-opacity="0.4" />
    </filter>
  </defs>

  <!-- Squircle Base -->
  <rect width="512" height="512" rx="120" fill="url(#sgBg)" />
  <rect width="512" height="512" rx="120" fill="url(#sgGlow)" />
  <rect x="8" y="8" width="496" height="496" rx="112" fill="none" stroke="url(#sgBorder)" stroke-width="8" />

  <!-- Bold Modern S Monogram -->
  <g filter="url(#sgShadow)">
    <path
      d="M 376 182
         C 376 138, 338 102, 260 102
         C 182 102, 140 144, 140 198
         C 140 244, 176 272, 238 290
         L 294 306
         C 324 315, 340 328, 340 348
         C 340 370, 318 386, 276 386
         C 244 386, 218 372, 200 352
         L 144 398
         C 176 436, 222 454, 278 454
         C 362 454, 412 410, 412 344
         C 412 296, 376 266, 310 246
         L 254 228
         C 224 218, 208 205, 208 188
         C 208 168, 228 154, 260 154
         C 290 154, 312 168, 326 188
         Z"
      fill="url(#sTopGrad)"
    />

    <!-- Cyan connectivity dots -->
    <circle cx="376" cy="138" r="16" fill="#38bdf8" />
    <circle cx="136" cy="374" r="16" fill="#818cf8" />
  </g>
</svg>`;

// Helper: pack PNG images into multi-resolution Windows ICO format
export function createIco(images) {
  const count = images.length;
  const headerSize = 6;
  const entrySize = 16;
  const dirSize = headerSize + count * entrySize;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // Reserved. Must always be 0.
  header.writeUInt16LE(1, 2); // Specifies image type: 1 for icon (.ICO) image.
  header.writeUInt16LE(count, 4); // Number of images in the file.

  const entries = [];
  let currentOffset = dirSize;

  for (const img of images) {
    const entry = Buffer.alloc(entrySize);
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0); // Width
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1); // Height
    entry.writeUInt8(0, 2); // Color palette (0 if no palette)
    entry.writeUInt8(0, 3); // Reserved (0)
    entry.writeUInt16LE(1, 4); // Color planes (1)
    entry.writeUInt16LE(32, 6); // Bits per pixel (32-bit RGBA)
    entry.writeUInt32LE(img.pngBuffer.length, 8); // Size of image data in bytes
    entry.writeUInt32LE(currentOffset, 12); // Offset of image data from beginning of file

    entries.push(entry);
    currentOffset += img.pngBuffer.length;
  }

  return Buffer.concat([header, ...entries, ...images.map((img) => img.pngBuffer)]);
}

async function main() {
  try {
    const svgBuffer = Buffer.from(svgIcon);

    // Generate PNG buffers for 16, 32, 48, 64
    const sizes = [16, 32, 48, 64];
    const images = [];

    for (const size of sizes) {
      const pngBuffer = await sharp(svgBuffer)
        .resize(size, size, { fit: 'contain' })
        .png({ compressionLevel: 9 })
        .toBuffer();
      images.push({ width: size, height: size, pngBuffer });
    }

    const icoBuffer = createIco(images);

    // Write app/favicon.ico
    const appIcoPath = path.resolve(process.cwd(), 'app/favicon.ico');
    fs.writeFileSync(appIcoPath, icoBuffer);

    // Also write public/favicon.ico if public exists or create public/
    const publicDir = path.resolve(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    const publicIcoPath = path.resolve(publicDir, 'favicon.ico');
    fs.writeFileSync(publicIcoPath, icoBuffer);

    // Also write app/icon.svg for modern browsers that support high-res SVG favicons
    const appSvgPath = path.resolve(process.cwd(), 'app/icon.svg');
    fs.writeFileSync(appSvgPath, svgIcon, 'utf8');
  } catch (err) {
    console.warn('Favicon generation note:', err?.message || err);
  }
}

void main();
