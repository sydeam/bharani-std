import sharp from 'sharp';
import fs from 'node:fs/promises';
for(const file of (await fs.readdir('public/images')).filter(f=>f.endsWith('.webp')&&!f.includes('-small')&&!f.startsWith('brand'))){
 const input=await fs.readFile('public/images/'+file);
 await sharp(input).resize({width:1500,withoutEnlargement:true}).webp({quality:85}).toFile('public/images/'+file);
 await sharp(input).resize({width:650,withoutEnlargement:true}).webp({quality:80}).toFile('public/images/'+file.replace('.webp','-small.webp'));
}
// Preserve the supplied artwork; only crop the surrounding empty space.
await sharp('D:/LIGHT.jpg.jpeg').extract({left:2310,top:1815,width:1380,height:1695}).resize({width:180}).webp({quality:95}).toFile('public/images/brand-mark.webp');
await sharp('D:/LIGHT.jpg.jpeg').extract({left:2290,top:3590,width:1440,height:600}).resize({width:420}).webp({quality:95}).toFile('public/images/brand-wordmark.webp');
await sharp('D:/LIGHT.jpg.jpeg').extract({left:2300,top:1790,width:1420,height:1740}).resize(64,64,{fit:'contain',background:'#f8f5ec'}).png().toFile('public/favicon.png');
console.log('Responsive photographs and original brand artwork prepared.');
