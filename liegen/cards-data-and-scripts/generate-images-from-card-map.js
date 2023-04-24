const canvasPkg = require('canvas');
const { createCanvas, loadImage } = canvasPkg;
const fs = require('fs');

const cardWidth = 170;
const cardHeight = 255;

const mobileCardWidth = 42;
const mobileCardHeight = 63;

const cardMapData = require('./cards.json');
const { createCardNames } = require('./regular/create-card-names.js');
const path = require('path');

const cardMapDataMobile = require('./mobile-card-map.json');

const validTypeOfCardsToRenderValues = [
  'mobile',
  'regular',
];

const validOrientationFolderValues = [
  null,
  'normal',
  'sideways_left',
  'sideways_right',
];

const sideWaysOrientationValues = [
  'sideways_left',
  'sideways_right'
];

const typeOfCardsFolder = process.argv[2] ?? null

let orientationFolder = process.argv[3] ?? null;

if (!validTypeOfCardsToRenderValues.includes(typeOfCardsFolder)) {
  throw new Error(`Invalid type of cards to render value: ${typeOfCardsFolder}`);
}

if (!validOrientationFolderValues.includes(orientationFolder)) {
  throw new Error(`Invalid orientation value: ${orientationFolder}`);
}

if (orientationFolder === null) {
  orientationFolder = 'normal';
}

const renderSideWays = sideWaysOrientationValues.includes(orientationFolder);

let canvasCardWidth = typeOfCardsFolder === 'regular'
  ? cardWidth
  : mobileCardWidth;

let canvasCardHeight = typeOfCardsFolder === 'regular'
  ? cardHeight
  : mobileCardHeight;

 if (renderSideWays) {
  const tempWidth = canvasCardHeight;
  canvasCardWidth = canvasCardHeight;
  canvasCardHeight = tempWidth; 
 } 

const canvas = createCanvas(canvasCardWidth, canvasCardHeight);
const ctx = canvas.getContext('2d');

const directory = `../src/assets/card_images/${typeOfCardsFolder}`;


fs.readdir(directory, (err, files) => {
  if (err) throw err;
  for (const file of files) {
    fs.unlink(path.join(directory, file), (err) => {
      if (err) throw err;
    });
  }
});

const cardMapPath = typeOfCardsFolder === 'regular'
  ? './cards.png'
  : './small_playing_cards.png';

fs.readFile(cardMapPath, (err, cardMap) => {
  if (err) throw err;
  loadImage(cardMap).then((cardMapImage) =>
    convertToIndividualCardImages(cardMapImage)
  );
});

function convertToIndividualCardImages(image) {
  if (typeOfCardsFolder === 'regular') {
    createRegularImages(image)
  } else {
    createMobileImages(image);
  }
}

function createRegularImages(image) {
  let fileNames = createCardNames();
  let index = 0;
  for (const cardFrame of cardMapData.card_frames) {
    const fileName = fileNames[index];
    if (!fileName) {
      continue;
    }
    const frame = cardFrame.frame;
    if (!renderSideWays) {
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
    } else {
      const rotation = orientationFolder === 'sideways_right'
        ? 90
        : 270;
      const tX = frame.h / 2;
      const tY = frame.w / 2;
      ctx.translate(tX, tY)
      ctx.rotate(rotation * Math.PI / 180);
      ctx.drawImage(image, 0, 0, frame.w, frame.h, -frame.w / 2, -frame.h / 2, frame.w, frame.h);
    }
    const buffer = canvas.toDataURL();
    const base64png = buffer.toString();
    if (renderSideWays) {
      let tempWidth = frame.w;
      frame.w = frame.h;
      frame.h = tempWidth; 
    }
    fs.writeFileSync(
      `../src/assets/card_images/regular/${fileName}.svg`,
      generateSvg(base64png, frame)
    );
    index++;
  }
}

function createMobileImages(image) {
  for (const card of cardMapDataMobile) {
    // ctx.strokeStyle = '#2465D3'
    // ctx.stroke()
    roundedImage(ctx, 0, 0, card.w, card.h, 14);
    ctx.clip();
    ctx.restore();
    if (!renderSideWays) {
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
    } else {
      const rotation = orientationFolder === 'sideways_right'
        ? 90
        : 270;
      const tX = card.h / 2;
      const tY = card.w / 2;
      ctx.translate(tX, tY)
      ctx.rotate(rotation * Math.PI / 180);
      ctx.drawImage(image, 0, 0, card.w, card.h, -card.w / 2, -card.h / 2, card.w, card.h);
    }
    const buffer = canvas.toDataURL();
    const base64png = buffer.toString();
    fs.writeFileSync(
      `../src/assets/card_images/mobile/${card.name}.svg`,
      generateSvg(base64png, card)
    );
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