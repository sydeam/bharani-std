import sharp from 'sharp';
await sharp('qa/1440-full.png').resize({width:800}).toFile('qa/desktop-overview.jpg');
await sharp('qa/1440-full.png').extract({left:0,top:0,width:1440,height:1000}).toFile('qa/desktop-top.png');
await sharp('qa/390-full.png').extract({left:0,top:0,width:390,height:1100}).toFile('qa/mobile-top.png');
