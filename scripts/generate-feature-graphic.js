#!/usr/bin/env node
const sharp = require('sharp');
const path = require('path');

const W = 1024;
const H = 500;

const BG = '#1A0F0A';
const BG_LIGHT = '#2A1A12';
const GOLD = '#C9973A';
const GOLD_LIGHT = '#D4A94E';
const GOLD_DARK = '#8B6914';
const CREAM = '#FDF6EC';
const MUTED = '#A89080';

const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bg" cx="35%" cy="40%" r="75%">
      <stop offset="0%" stop-color="${BG_LIGHT}"/>
      <stop offset="100%" stop-color="${BG}"/>
    </radialGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${GOLD_LIGHT}"/>
      <stop offset="50%" stop-color="${GOLD}"/>
      <stop offset="100%" stop-color="${GOLD_DARK}"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
    <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="18"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <!-- Subtle border line -->
  <rect x="20" y="20" width="${W - 40}" height="${H - 40}" rx="16" fill="none" stroke="${GOLD}" stroke-width="0.5" opacity="0.2"/>

  <!-- Decorative star top-left -->
  <g transform="translate(80, 80)">
    <path d="M 0,-18 Q 4,-4 18,0 Q 4,4 0,18 Q -4,4 -18,0 Q -4,-4 0,-18 Z"
      fill="${GOLD}" opacity="0.3"/>
  </g>

  <!-- Decorative star bottom-right -->
  <g transform="translate(${W - 80}, ${H - 80})">
    <path d="M 0,-14 Q 3,-3 14,0 Q 3,3 0,14 Q -3,3 -14,0 Q -3,-3 0,-14 Z"
      fill="${GOLD}" opacity="0.25"/>
  </g>

  <!-- Small accent dots -->
  <circle cx="120" cy="120" r="2.5" fill="${GOLD}" opacity="0.2"/>
  <circle cx="${W - 120}" cy="100" r="2" fill="${GOLD}" opacity="0.15"/>
  <circle cx="${W - 160}" cy="${H - 60}" r="1.5" fill="${GOLD}" opacity="0.2"/>

  <!-- Serif C monogram (left side) -->
  <g filter="url(#glow)">
    <text x="200" y="295" text-anchor="middle" dominant-baseline="central"
      font-family="Georgia, 'Times New Roman', serif" font-size="320" font-weight="bold"
      fill="${GOLD}" opacity="0.06" filter="url(#softGlow)">C</text>
    <text x="200" y="295" text-anchor="middle" dominant-baseline="central"
      font-family="Georgia, 'Times New Roman', serif" font-size="320" font-weight="bold"
      fill="url(#goldGrad)">C</text>
  </g>

  <!-- Star accent at C opening -->
  <g transform="translate(310, 295)">
    <path d="M 0,-22 Q 4,-4 22,0 Q 4,4 0,22 Q -4,4 -22,0 Q -4,-4 0,-22 Z"
      fill="${GOLD_LIGHT}"/>
  </g>

  <!-- App name -->
  <text x="520" y="200" font-family="Georgia, 'Times New Roman', serif" font-size="64" font-weight="bold"
    fill="${CREAM}" letter-spacing="2">Café Codex</text>

  <!-- Tagline -->
  <text x="522" y="260" font-family="-apple-system, 'Helvetica Neue', sans-serif" font-size="18"
    fill="${MUTED}" letter-spacing="0.5">Your record of the world's best cups</text>

  <!-- Divider line -->
  <rect x="522" y="285" width="50" height="2" rx="1" fill="${GOLD}" opacity="0.6"/>

  <!-- Feature highlights -->
  <text x="522" y="330" font-family="-apple-system, 'Helvetica Neue', sans-serif" font-size="16"
    fill="${CREAM}" opacity="0.7">450+ hand-curated cafes</text>
  <text x="522" y="358" font-family="-apple-system, 'Helvetica Neue', sans-serif" font-size="16"
    fill="${CREAM}" opacity="0.7">Coffee &amp; matcha worldwide</text>
  <text x="522" y="386" font-family="-apple-system, 'Helvetica Neue', sans-serif" font-size="16"
    fill="${CREAM}" opacity="0.7">Never crowdsourced. Always honest.</text>
</svg>`;

async function main() {
  const outPath = path.join(__dirname, '..', 'assets', 'feature-graphic.png');
  await sharp(Buffer.from(svg))
    .resize(W, H)
    .png()
    .toFile(outPath);
  console.log(`✓ Feature graphic generated: ${outPath}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
