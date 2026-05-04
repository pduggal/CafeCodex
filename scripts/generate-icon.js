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
const GOLD_DARK = '#8B6914';
const CREAM = '#FDF6EC';

const svg = `<svg width="${SIZE}" height="${SIZE}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bg" cx="50%" cy="38%" r="72%">
      <stop offset="0%" stop-color="${BG_LIGHT}"/>
      <stop offset="100%" stop-color="${BG}"/>
    </radialGradient>
    <linearGradient id="goldGrad" x1="30%" y1="0%" x2="70%" y2="100%">
      <stop offset="0%" stop-color="${GOLD_LIGHT}"/>
      <stop offset="50%" stop-color="${GOLD}"/>
      <stop offset="100%" stop-color="${GOLD_DARK}"/>
    </linearGradient>
    <filter id="glow" x="-15%" y="-15%" width="130%" height="130%">
      <feGaussianBlur stdDeviation="12" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
    <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="25"/>
    </filter>
  </defs>

  <!-- Background with rounded corners -->
  <rect width="${SIZE}" height="${SIZE}" fill="url(#bg)" rx="220"/>

  <!-- Subtle outer ring -->
  <circle cx="${cx}" cy="${cy}" r="440" fill="none" stroke="${GOLD}" stroke-width="1" opacity="0.15"/>

  <!-- Serif C letterform -->
  <g filter="url(#glow)">
    <!-- Glow behind the C -->
    <text x="${cx}" y="${cy + 55}" text-anchor="middle" dominant-baseline="central"
      font-family="Georgia, 'Times New Roman', serif" font-size="620" font-weight="bold"
      fill="${GOLD}" opacity="0.08" filter="url(#softGlow)">C</text>

    <!-- Main C -->
    <text x="${cx}" y="${cy + 55}" text-anchor="middle" dominant-baseline="central"
      font-family="Georgia, 'Times New Roman', serif" font-size="620" font-weight="bold"
      fill="url(#goldGrad)">C</text>
  </g>

  <!-- Four-point star accent (✦) at the opening of the C -->
  <g transform="translate(${cx + 175}, ${cy + 55})">
    <!-- Star glow -->
    <path d="M 0,-42 Q 8,-8 42,0 Q 8,8 0,42 Q -8,8 -42,0 Q -8,-8 0,-42 Z"
      fill="${GOLD}" opacity="0.15" filter="url(#softGlow)"/>
    <!-- Star -->
    <path d="M 0,-42 Q 8,-8 42,0 Q 8,8 0,42 Q -8,8 -42,0 Q -8,-8 0,-42 Z"
      fill="${GOLD_LIGHT}"/>
  </g>

  <!-- Small decorative star top-right -->
  <g transform="translate(${cx + 260}, ${cy - 175})">
    <path d="M 0,-12 Q 2.5,-2.5 12,0 Q 2.5,2.5 0,12 Q -2.5,2.5 -12,0 Q -2.5,-2.5 0,-12 Z"
      fill="${GOLD}" opacity="0.5"/>
  </g>

  <!-- Tiny accent dot -->
  <circle cx="${cx + 290}" cy="${cy - 130}" r="3" fill="${GOLD}" opacity="0.35"/>
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
