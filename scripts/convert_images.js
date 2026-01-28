#!/usr/bin/env node
/**
 * convert_images.js
 * Usage: node convert_images.js <srcDir> <outDir>
 * - srcDir: folder with original images (e.g. assets/products/originals)
 * - outDir: destination folder (e.g. assets/products)
 *
 * For each image in srcDir named like `<id>_*.ext` the script will generate:
 * - <id>_1.webp  (1200x1200 fit center)
 * - <id>_2.webp  (1600x1200 fit cover)
 * - <id>_thumb.webp (400x300)
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function processFile(srcPath, outDir){
  const base = path.basename(srcPath);
  const idMatch = base.match(/^([0-9A-Za-z-]+)_/);
  const id = idMatch ? idMatch[1] : path.parse(base).name;

  const out1 = path.join(outDir, `${id}_1.webp`);
  const out2 = path.join(outDir, `${id}_2.webp`);
  const outThumb = path.join(outDir, `${id}_thumb.webp`);

  console.log(`Processing ${base} -> ${id}_1.webp ${id}_2.webp ${id}_thumb.webp`);

  try{
    await sharp(srcPath)
      .resize(1200, 1200, {fit:'contain', background:{r:20,g:20,b:20}})
      .webp({quality:80})
      .toFile(out1);

    await sharp(srcPath)
      .resize(1600, 1200, {fit:'cover'})
      .webp({quality:80})
      .toFile(out2);

    await sharp(srcPath)
      .resize(400, 300, {fit:'cover'})
      .webp({quality:70})
      .toFile(outThumb);

  }catch(err){
    console.error('Error processing', srcPath, err);
  }
}

async function main(){
  const src = process.argv[2] || './assets/products/originals';
  const out = process.argv[3] || './assets/products';

  if(!fs.existsSync(src)){
    console.error('Source directory does not exist:', src);
    process.exit(1);
  }
  if(!fs.existsSync(out)) fs.mkdirSync(out, {recursive:true});

  const files = fs.readdirSync(src).filter(f => /\.(jpe?g|png|webp)$/i.test(f));
  for(const f of files){
    const full = path.join(src,f);
    await processFile(full, out);
  }
}

main();
