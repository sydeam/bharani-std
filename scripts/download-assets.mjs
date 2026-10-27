import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
const html = await fs.readFile('references/source.html','utf8');
const images = [...new Set([...html.matchAll(/<img[^>]+src="([^"]+)"/g)].map(m=>m[1]))];
for (const url of images) {
  execFileSync('curl.exe',['-fsSL','https://bharanistudio.lovable.app'+url,'-o','public/images/'+path.basename(url)]);
}
const fontSources = {
 'cormorant-regular.ttf':'https://fonts.gstatic.com/s/cormorantgaramond/v21/co3umX5slCNuHLi8bLeY9MK7whWMhyjypVO7abI26QOD_v86GnM.ttf',
 'cormorant-italic.ttf':'https://fonts.gstatic.com/s/cormorantgaramond/v21/co3smX5slCNuHLi8bLeY9MK7whWMhyjYrGFEsdtdc62E6zd58jDOjw.ttf',
 'manrope-regular.ttf':'https://fonts.gstatic.com/s/manrope/v20/xn7_YHE41ni1AdIRqAuZuw1Bx9mbZk79FO_F.ttf',
 'manrope-semibold.ttf':'https://fonts.gstatic.com/s/manrope/v20/xn7_YHE41ni1AdIRqAuZuw1Bx9mbZk4jE-_F.ttf'
};
for (const [name,url] of Object.entries(fontSources)) execFileSync('curl.exe',['-fsSL',url,'-o','public/fonts/'+name]);
console.log(`Downloaded ${images.length} original studio images and 4 fonts.`);
