#!/usr/bin/env node
const sharp = require('sharp');
const path = require('path');

const SIZE = 1024;
const cx = SIZE / 2;
const cy = SIZE / 2;

const BG = '#1A0F0A';
const BG_LIGHT = '#2A1A12';
const GOLD = '#C9973A';
const GOLD_LIGHT = '#D4A94E';
const GOLD_DARK = '#A87B2A';
const CREAM = '#FDF6EC';

function star(cx, cy, outerR, innerR, points = 4) {
  const pts = [];
  for (let i = 0; i < points * 2; i++) {
    const angle = (Math.PI * i) / points - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }
  return pts.join(' ');
}

function fourPointStar(cx, cy, longR, shortR, waist) {
  const top = `${cx},${cy - longR}`;
  const right = `${cx + shortR},${cy}`;
  const bottom = `${cx},${cy + longR}`;
  const left = `${cx - shortR},${cy}`;

  const trI = `${cx + waist},${cy - waist}`;
  const brI = `${cx + waist},${cy + waist}`;
  const blI = `${cx - waist},${cy + waist}`;
  const tlI = `${cx - waist},${cy - waist}`;

  return `M ${top}
    Q ${cx + waist * 0.6},${cy - waist * 0.6} ${right}
    Q ${cx + waist * 0.6},${cy + waist * 0.6} ${bottom}
    Q ${cx - waist * 0.6},${cy + waist * 0.6} ${left}
    Q ${cx - waist * 0.6},${cy - waist * 0.6} ${top}
    Z`;
}

const mainStar = fourPointStar(cx, cy, 360, 280, 85);
const innerStar = fourPointStar(cx, cy, 280, 220, 70);

const smallDotCount = 24;
const smallDots = Array.from({ length: smallDotCount }, (_, i) => {
  const angle = (2 * Math.PI * i) / smallDotCount;
  const r = 420;
  const x = cx + r * Math.cos(angle);
  const y = cy + r * Math.sin(angle);
  const dotR = i % 3 === 0 ? 6 : 3.5;
  return `<circle cx="${x}" cy="${y}" r="${dotR}" fill="${GOLD}" opacity="${i % 3 === 0 ? 0.7 : 0.35}"/>`;
}).join('\n    ');

const svg = `<svg width="${SIZE}" height="${SIZE}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bg" cx="50%" cy="40%" r="70%">
      <stop offset="0%" stop-color="${BG_LIGHT}"/>
      <stop offset="100%" stop-color="${BG}"/>
    </radialGradient>
    <radialGradient id="starGlow" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="${GOLD_LIGHT}"/>
      <stop offset="60%" stop-color="${GOLD}"/>
      <stop offset="100%" stop-color="${GOLD_DARK}"/>
    </radialGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="18" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
    <filter id="outerGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="35"/>
    </filter>
    <linearGradient id="sheen" x1="30%" y1="0%" x2="70%" y2="100%">
      <stop offset="0%" stop-color="${CREAM}" stop-opacity="0.25"/>
      <stop offset="50%" stop-color="${CREAM}" stop-opacity="0"/>
      <stop offset="100%" stop-color="${CREAM}" stop-opacity="0.08"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${SIZE}" height="${SIZE}" fill="url(#bg)" rx="220"/>

  <!-- Outer decorative ring -->
  <circle cx="${cx}" cy="${cy}" r="445" fill="none" stroke="${GOLD}" stroke-width="1.5" opacity="0.2"/>
  <circle cx="${cx}" cy="${cy}" r="435" fill="none" stroke="${GOLD}" stroke-width="0.8" opacity="0.12"/>

  <!-- Decorative dots around ring -->
  ${smallDots}

  <!-- Inner ring -->
  <circle cx="${cx}" cy="${cy}" r="395" fill="none" stroke="${GOLD}" stroke-width="2" opacity="0.3"/>

  <!-- Star glow (behind) -->
  <path d="${mainStar}" fill="${GOLD}" opacity="0.15" filter="url(#outerGlow)"/>

  <!-- Main four-pointed star -->
  <path d="${mainStar}" fill="url(#starGlow)" filter="url(#glow)"/>

  <!-- Sheen overlay on star -->
  <path d="${mainStar}" fill="url(#sheen)"/>

  <!-- Center circle accent -->
  <circle cx="${cx}" cy="${cy}" r="38" fill="${BG}" opacity="0.5"/>
  <circle cx="${cx}" cy="${cy}" r="28" fill="${GOLD}" opacity="0.12"/>
  <circle cx="${cx}" cy="${cy}" r="6" fill="${GOLD_LIGHT}" opacity="0.6"/>
</svg>`;

async function main() {
  const iconPath = path.join(__dirname, '..', 'assets', 'icon.png');
  const adaptivePath = path.join(__dirname, '..', 'assets', 'adaptive-icon.png');

  await sharp(Buffer.from(svg))
    .resize(SIZE, SIZE)
    .png()
    .toFile(iconPath);

  console.log(`✓ Icon generated: ${iconPath}`);

  await sharp(Buffer.from(svg))
    .resize(SIZE, SIZE)
    .png()
    .toFile(adaptivePath);

  console.log(`✓ Adaptive icon generated: ${adaptivePath}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
