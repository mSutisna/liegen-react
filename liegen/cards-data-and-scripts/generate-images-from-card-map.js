const canvasPkg = require('canvas');
const { createCanvas, loadImage } = canvasPkg;
const canvas = createCanvas(170, 255);
const ctx = canvas.getContext('2d');
const fs = require('fs');

const cardMapData = require('./cards.json');
const { createCardNames } = require('./create-card-names.js');
const path = require('path');

let directory = '../src/assets/card_images';
fs.readdir(directory, (err, files) => {
  if (err) throw err;
  for (const file of files) {
    fs.unlink(path.join(directory, file), (err) => {
      if (err) throw err;
    });
  }
});

const cardMapPath = './cards.png';

fs.readFile(cardMapPath, (err, cardMap) => {
  if (err) throw err;
  loadImage(cardMap).then((cardMapImage) =>
    convertToIndividualCardImages(cardMapImage)
  );
});

function convertToIndividualCardImages(image) {
  let fileNames = createCardNames();
  let index = 0;
  for (const cardFrame of cardMapData.card_frames) {
    const fileName = fileNames[index];
    if (!fileName) {
      continue;
    }
    const frame = cardFrame.frame;
    ctx.drawImage(
      image,
      frame.x,
      frame.y,
      frame.w,
      frame.h,
      0,
      0,
      frame.w,
      frame.h
    );
    const buffer = canvas.toDataURL();
    const base64png = buffer.toString();
    fs.writeFileSync(
      `../src/assets/card_images/${fileName}.svg`,
      generateSvg(base64png)
    );
    index++;
  }
}

function generateSvg(base64png) {
  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
    <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="170px" height="255px" viewBox="0 0 170 255" enable-background="new 0 0 170 255" xml:space="preserve">  
      <image id="image0" width="170" height="255" x="0" y="0" href="${base64png}" />
    </svg>`;
}