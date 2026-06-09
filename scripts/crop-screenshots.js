const sharp = require('sharp');
const path = require('path');

const files = [
  '1000003938.jpg',
  '1000003940.jpg',
  '1000003942.jpg',
  '1000003944.jpg',
  '1000003946.jpg',
];

async function main() {
  const dir = '/Users/pduggal/Desktop';
  const outDir = path.join(dir, 'CafeCodex-screenshots');
  require('fs').mkdirSync(outDir, { recursive: true });

  for (const f of files) {
    const input = path.join(dir, f);
    const output = path.join(outDir, f.replace('.jpg', '-cropped.png'));
    await sharp(input)
      .extract({ left: 0, top: 0, width: 1080, height: 1920 })
      .png()
      .toFile(output);
    console.log(`✓ ${f} → cropped to 1080x1920`);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
