import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = join(__dirname, "..", "public", "icons");
mkdirSync(iconsDir, { recursive: true });

// Minimal valid PNG generator (solid gold #C9A962)
function createPng(size) {
  // PNG header + IHDR + IDAT + IEND for a solid color image
  // Using a pre-encoded minimal approach - create SVG instead and note for production
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${size * 0.18}" fill="#C9A962"/>
  <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="Georgia,serif" font-size="${size * 0.35}" fill="#1C1917" font-weight="bold">P</text>
</svg>`;
  return svg;
}

// Write SVG icons (browsers accept SVG in manifest on some platforms; also write as fallback)
writeFileSync(join(iconsDir, "icon.svg"), createPng(512));

// For PNG, write a note - we'll use a tiny valid 1x1 and rely on SVG favicon for dev
// Create simple PNG using raw buffer for 192x192 gold square
function createSimplePng(size) {
  const { createCanvas } = globalThis;
  if (createCanvas) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#C9A962";
    ctx.beginPath();
    ctx.roundRect(0, 0, size, size, size * 0.18);
    ctx.fill();
    ctx.fillStyle = "#1C1917";
    ctx.font = `bold ${size * 0.35}px Georgia`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("P", size / 2, size / 2);
    return canvas.toBuffer("image/png");
  }
  return null;
}

const sizes = [
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
  { name: "icon-maskable-512.png", size: 512 },
];

// Fallback: copy a minimal 68-byte PNG and scale via SVG reference
const minimalPng = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64"
);

for (const { name } of sizes) {
  writeFileSync(join(iconsDir, name), minimalPng);
}

console.log("Icons generated in public/icons/ (replace with proper PNGs for production)");
