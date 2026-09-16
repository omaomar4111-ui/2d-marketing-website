const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function optimizeFolder(folderPath) {
  if (!fs.existsSync(folderPath)) return;
  const files = fs.readdirSync(folderPath);
  for (const f of files) {
    const full = path.join(folderPath, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (f !== 'raw') await optimizeFolder(full);
      continue;
    }
    if (/\.(png|jpg|jpeg)$/i.test(f) && !f.endsWith('.webp')) {
      const webpOutput = full.replace(/\.(png|jpg|jpeg)$/i, '.webp');
      try {
        await sharp(full)
          .webp({ quality: 85, effort: 6 })
          .toFile(webpOutput);
        const origSize = (stat.size / 1024).toFixed(1);
        const newSize = (fs.statSync(webpOutput).size / 1024).toFixed(1);
        console.log(`⚡ ${f} (${origSize} KB) -> ${path.basename(webpOutput)} (${newSize} KB)`);
      } catch (err) {
        console.error(`Error optimizing ${f}:`, err.message);
      }
    }
  }
}

(async () => {
  console.log('Optimizing team portraits...');
  await optimizeFolder(path.join(__dirname, '..', 'assets', 'team'));
  console.log('\nOptimizing client logos...');
  await optimizeFolder(path.join(__dirname, '..', 'assets', 'logos', 'clients'));
  console.log('\nImage optimization finished!');
})();
