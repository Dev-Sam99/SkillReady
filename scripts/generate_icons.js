const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicDir = path.join(__dirname, '../public');
const iconsDir = path.join(publicDir, 'icons');

if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

// SkillReady SVG Icon markup (1024x1024 vector)
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024" fill="none">
  <rect width="1024" height="1024" rx="224" fill="#1C1917"/>
  <rect x="32" y="32" width="960" height="960" rx="192" stroke="#292524" stroke-width="16"/>
  <!-- Glowing subtle gradient backplate -->
  <circle cx="512" cy="512" r="360" fill="url(#glow)" opacity="0.15"/>
  <!-- SkillReady logo elements: Checklist / Target / Book mark -->
  <path d="M312 360 C312 333.49 333.49 312 360 312 L664 312 C690.51 312 712 333.49 712 360 L712 664 C712 690.51 690.51 712 664 712 L360 712 C333.49 712 312 690.51 312 664 Z" stroke="#E7E5E4" stroke-width="36" stroke-linecap="round"/>
  <!-- Accent checkmark -->
  <path d="M412 512 L482 582 L622 422" stroke="#10B981" stroke-width="48" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Sub-accent dots for interview cards -->
  <circle cx="412" cy="380" r="16" fill="#F59E0B"/>
  <circle cx="468" cy="380" r="16" fill="#10B981"/>
  <circle cx="524" cy="380" r="16" fill="#6366F1"/>
  <defs>
    <radialGradient id="glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(512 512) rotate(90) scale(360)">
      <stop stop-color="#10B981"/>
      <stop offset="1" stop-color="#10B981" stop-opacity="0"/>
    </radialGradient>
  </defs>
</svg>`;

const svgPath = path.join(iconsDir, 'icon.svg');
fs.writeFileSync(svgPath, svgIcon, 'utf8');
console.log('Saved icon.svg');

async function generatePngs() {
  const svgBuffer = Buffer.from(svgIcon);

  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(iconsDir, 'icon-192.png'));
  console.log('Generated icon-192.png');

  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(iconsDir, 'icon-512.png'));
  console.log('Generated icon-512.png');

  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(iconsDir, 'apple-touch-icon.png'));
  console.log('Generated apple-touch-icon.png');

  await sharp(svgBuffer)
    .resize(64, 64)
    .png()
    .toFile(path.join(publicDir, 'favicon.ico'));
  console.log('Generated favicon.ico');
}

generatePngs().catch(console.error);
