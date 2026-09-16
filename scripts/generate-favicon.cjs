const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const pngToIcoModule = require('png-to-ico');
const pngToIco = pngToIcoModule.default || pngToIcoModule;

const root = path.join(__dirname, '..');
const SOURCE = path.join(root, 'favicon-source.png');

async function generateFavicons() {
  if (!fs.existsSync(SOURCE)) {
    console.error('❌ favicon-source.png not found');
    process.exit(1);
  }

  try {
    const meta = await sharp(SOURCE).metadata();
    console.log(`Source: ${meta.width}x${meta.height}`);

    // Crop letter 'D' with the red cinema lens
    const dCrop = await sharp(SOURCE)
      .extract({ left: 512, top: 195, width: 410, height: 518 })
      .toBuffer();

    // Fit inside square canvas with balanced padding (460x460 inside 512x512)
    const resizedD = await sharp(dCrop)
      .resize(460, 460, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toBuffer();

    // Master 512x512 icon on dark background #040000
    const master512 = await sharp({
      create: {
        width: 512,
        height: 512,
        channels: 4,
        background: { r: 4, g: 0, b: 0, alpha: 1 }
      }
    })
      .composite([{ input: resizedD, gravity: 'center' }])
      .png()
      .toBuffer();

    // Write all required sizes
    const sizes = [
      { name: 'favicon-16x16.png', size: 16 },
      { name: 'favicon-32x32.png', size: 32 },
      { name: 'favicon-48x48.png', size: 48 },
      { name: 'apple-touch-icon.png', size: 180 },
      { name: 'android-chrome-192x192.png', size: 192 },
      { name: 'android-chrome-512x512.png', size: 512 },
      { name: 'favicon.png', size: 512 }
    ];

    for (const item of sizes) {
      const outPath = path.join(root, item.name);
      await sharp(master512)
        .resize(item.size, item.size, { fit: 'cover' })
        .toFile(outPath);
      console.log(`✅ Generated: ${item.name} (${item.size}x${item.size})`);
    }

    // Generate multi-size favicon.ico
    const icoFiles = [
      path.join(root, 'favicon-16x16.png'),
      path.join(root, 'favicon-32x32.png'),
      path.join(root, 'favicon-48x48.png')
    ];
    const icoBuffer = await pngToIco(icoFiles);
    fs.writeFileSync(path.join(root, 'favicon.ico'), icoBuffer);
    console.log('✅ Generated: favicon.ico (16, 32, 48 multiresolution)');

    console.log('\n🎉 All favicons generated successfully!');
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

generateFavicons();
