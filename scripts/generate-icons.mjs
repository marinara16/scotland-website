// Simple SVG-based icon generator — run once with: node scripts/generate-icons.mjs
// Requires Node.js 18+ (uses built-in fs only, no canvas dep needed for SVG output)
import { writeFileSync } from 'fs';
import { join } from 'path';

const sizes = [192, 512];
const outDir = join(process.cwd(), 'public', 'icons');

function makeSVG(size) {
  const r = size / 2;
  const fontSize = size * 0.38;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="#1e3a5f"/>
  <text x="${r}" y="${r + fontSize * 0.36}" font-size="${fontSize}" text-anchor="middle" font-family="system-ui,sans-serif">🏴󠁧󠁢󠁳󠁣󠁴󠁿</text>
</svg>`;
}

for (const size of sizes) {
  const svg = makeSVG(size);
  writeFileSync(join(outDir, `icon-${size}.svg`), svg);
  console.log(`✓ Written icon-${size}.svg (use a tool like sharp or squoosh to convert to PNG)`);
}

console.log('\nNote: SVG icons work for most purposes. For full PWA compliance, convert to PNG.');
console.log('Quick conversion: npx sharp-cli -i public/icons/icon-192.svg -o public/icons/icon-192.png');
