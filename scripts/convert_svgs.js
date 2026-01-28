#!/usr/bin/env node
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const cwd = path.resolve(__dirname, '..');
const brand = path.join(cwd, 'assets', 'brand');

const tasks = [
  { src: path.join(brand, 'og-1200x630.svg'), outWebp: path.join(brand, 'og-1200x630.webp'), outJpg: path.join(brand, 'og-1200x630.jpg'), w:1200, h:630 },
  { src: path.join(brand, 'hero-1920x1080.svg'), outWebp: path.join(brand, 'hero-1920x1080.webp'), outJpg: path.join(brand, 'hero-1920x1080.jpg'), w:1920, h:1080 },
  { src: path.join(brand, 'favicon.svg'), outPng: path.join(brand, 'favicon-512.png'), w:512, h:512 },
  { src: path.join(brand, 'logo.svg'), outPng: path.join(brand, 'logo-800.png'), w:800, h:800 },
  { src: path.join(brand, 'logo-horizontal.svg'), outPng: path.join(brand, 'logo-horizontal-1600x400.png'), w:1600, h:400 },
  // templates
  { src: path.join(cwd, 'assets', 'templates', 'template-4x3-1600x1200.svg'), outPng: path.join(cwd, 'assets', 'templates', 'template-4x3-1600x1200.png'), w:1600, h:1200 },
  { src: path.join(cwd, 'assets', 'templates', 'template-1x1-1600x1600.svg'), outPng: path.join(cwd, 'assets', 'templates', 'template-1x1-1600x1600.png'), w:1600, h:1600 }
];

async function run(){
  for(const t of tasks){
    if(!fs.existsSync(t.src)){
      console.warn('Source not found, skipping:', t.src);
      continue;
    }
    try{
      const svgBuffer = fs.readFileSync(t.src);
      if(t.outWebp){
        await sharp(svgBuffer).resize(t.w, t.h, {fit:'cover'}).webp({quality:80}).toFile(t.outWebp);
        console.log('Written', t.outWebp);
      }
      if(t.outJpg){
        await sharp(svgBuffer).resize(t.w, t.h, {fit:'cover'}).jpeg({quality:80}).toFile(t.outJpg);
        console.log('Written', t.outJpg);
      }
      if(t.outPng){
        await sharp(svgBuffer).resize(t.w, t.h, {fit:'cover'}).png({quality:100}).toFile(t.outPng);
        console.log('Written', t.outPng);
      }
    }catch(err){
      console.error('Error converting', t.src, err.message);
    }
  }
}

run();
