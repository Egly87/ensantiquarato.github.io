const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const dataPath = path.join(root, 'data', 'products.json');
const templatesDir = path.join(root, 'assets', 'templates');
const outDir = path.join(root, 'assets', 'products');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const products = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

(async () => {
  try {
    for (const p of products) {
      const id = String(p.id);
      // choose template: odd -> square, even -> 4x3
      const template = (p.id % 2 === 1) ? 'template-1x1-1600x1600.png' : 'template-4x3-1600x1200.png';
      const tplPath = path.join(templatesDir, template);
      if (!fs.existsSync(tplPath)) {
        console.warn('Template missing:', tplPath);
        continue;
      }

      // generate two variations
      const out1 = path.join(outDir, `${id}_1.webp`);
      const out2 = path.join(outDir, `${id}_2.webp`);
      const thumb = path.join(outDir, `${id}_thumb.webp`);

      await sharp(tplPath)
        .resize(1200, null, { fit: 'cover' })
        .webp({ quality: 80 })
        .toFile(out1);

      await sharp(tplPath)
        .resize(1000, null, { fit: 'cover' })
        .modulate({ brightness: 0.96 })
        .webp({ quality: 78 })
        .toFile(out2);

      await sharp(tplPath)
        .resize(400, 400, { fit: 'cover' })
        .sharpen()
        .webp({ quality: 70 })
        .toFile(thumb);

      console.log('Generated for id', id, out1, out2, thumb);
    }
    console.log('Done generating placeholder product images.');
  } catch (err) {
    console.error('Error generating images', err);
    process.exit(1);
  }
})();
