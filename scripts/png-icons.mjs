import sharp from 'sharp';
import { join } from 'path';

const sizes = [192, 512];
const iconsDir = join(process.cwd(), 'public', 'icons');

for (const size of sizes) {
  // Navy blue square with rounded corners — simple, readable icon
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" rx="${Math.round(size * 0.18)}" fill="#1e3a5f"/>
    <text x="${size/2}" y="${Math.round(size * 0.66)}" font-size="${Math.round(size * 0.42)}" text-anchor="middle" font-family="Apple Color Emoji,Segoe UI Emoji,sans-serif">✈</text>
    <text x="${size/2}" y="${Math.round(size * 0.88)}" font-size="${Math.round(size * 0.14)}" text-anchor="middle" fill="#7ba3cc" font-family="system-ui,sans-serif" font-weight="500" letter-spacing="1">SCOTLAND</text>
  </svg>`;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(join(iconsDir, `icon-${size}.png`));

  console.log(`✓ icon-${size}.png`);
}
