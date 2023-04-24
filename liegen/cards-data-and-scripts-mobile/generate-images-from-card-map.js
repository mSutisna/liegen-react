const canvasPkg = require('canvas');
const { createCanvas, loadImage } = canvasPkg;
const canvas = createCanvas(42, 63);
const ctx = canvas.getContext('2d');
const fs = require('fs');

const cardMapData = require('./card-map.json');
const path = require('path');

let directory = '../src/assets/card_images/mobile/normal';
fs.readdir(directory, (err, files) => {
  if (err) throw err;
  for (const file of files) {
    fs.unlink(path.join(directory, file), (err) => {
      if (err) throw err;
    });
  }
});

const cardMapPath = './small_playing_cards.png';

fs.readFile(cardMapPath, (err, cardMap) => {
  if (err) throw err;
  loadImage(cardMap).then((cardMapImage) =>
    convertToIndividualCardImages(cardMapImage)
  );
});

// console.log({cardMapData})

// return;

function convertToIndividualCardImages(image) {
  for (const card of cardMapData) {
    // ctx.strokeStyle = '#2465D3'
    // ctx.stroke()
    // roundedImage(ctx, 0, 0, card.w, card.h, 14);
    // ctx.clip();
    // ctx.restore();
    ctx.drawImage(
      image,
      card.x,
      card.y,
      card.w,
      card.h,
      0,
      0,
      card.w,
      card.h
    );
    // ctx.drawImage(image, frame.x, frame.y, frame.w, frame.h);
    const buffer = canvas.toDataURL();
    const base64png = buffer.toString();
    fs.writeFileSync(
      `../src/assets/card_images/mobile/normal/${card.name}.svg`,
      generateSvg(base64png, card)
    );
    // ctx.restore();
  }
}

function roundedImage(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function generateSvg(base64png, card) {
  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
    <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="${card.w}px" height="${card.h}px" viewBox="0 0 ${card.w} ${card.h}" enable-background="new 0 0 ${card.w} ${card.h}" xml:space="preserve">  
      <image id="image0" width="${card.w}" height="${card.h}" x="0" y="0" href="${base64png}" />
    </svg>`;
}