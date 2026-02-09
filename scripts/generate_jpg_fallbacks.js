#!/usr/bin/env node
/**
 * generate_jpg_fallbacks.js
 *
 * Creates .jpg fallbacks next to existing .webp images.
 * This improves compatibility on older mobile browsers that don't support WebP.
 *
 * Usage:
 *   node scripts/generate_jpg_fallbacks.js
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const cwd = path.resolve(__dirname, '..');
const productsDir = path.join(cwd, 'assets', 'products');

function listWebpFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((name) => name.toLowerCase().endsWith('.webp'))
    .map((name) => path.join(dir, name))
    .filter((fullPath) => fs.statSync(fullPath).isFile());
}

async function ensureJpgFallback(webpPath) {
  const jpgPath = webpPath.replace(/\.webp$/i, '.jpg');
  if (fs.existsSync(jpgPath)) return { webpPath, jpgPath, created: false };

  await sharp(webpPath)
    .jpeg({ quality: 82, progressive: true })
    .toFile(jpgPath);

  return { webpPath, jpgPath, created: true };
}

async function main() {
  const files = listWebpFiles(productsDir);
  if (!files.length) {
    console.log('No .webp files found in', productsDir);
    return;
  }

  let created = 0;
  for (const f of files) {
    try {
      const res = await ensureJpgFallback(f);
      if (res.created) {
        created += 1;
        console.log('Created', path.relative(cwd, res.jpgPath));
      }
    } catch (err) {
      console.error('Failed for', path.relative(cwd, f), '-', err.message);
    }
  }

  console.log(`Done. New JPG files: ${created}.`);
}

main();

