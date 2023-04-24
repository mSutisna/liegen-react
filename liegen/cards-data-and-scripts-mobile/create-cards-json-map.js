const fs = require('fs') 

const suits = [
  'Diamonds',
  'Hearts',
  'Spades',
  'Clubs'
];

const ranks = [
  'A',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'J',
  'Q',
  'K',
  'question',
  'no-rank',
];

const special = [
  ['Backside'],
  ['joker-red'],
  ['joker-black'],
  ['blank']
];

let jsonMap = [];

const width = 42;
const height= 63;

const gapX = 10;
const gapY = 10;

let offsetX = 0;
let offsetY = 0;

const ranksToSkip = [
  'no-rank',
  'question',
  'joker-red',
  'joker-black',
  'blank'
];

for (let i = 0; i < suits.length; i++) {
  const suit = suits[i];
  const ranksForSuit = [...ranks, ...special[i]];
  for (const rank of ranksForSuit) {
    if (ranksToSkip.includes(rank)) {
      offsetX += width + gapX;
      continue;
    }
    const name = rank === 'Backside'
      ? 'Backside'
      : `${suit}-${rank}`;
    jsonMap.push({
      name,
      x: offsetX,
      y: offsetY,
      w: width,
      h: height
    });
    offsetX += width + gapX;
  }
  offsetX = 0;
  offsetY += height + gapY;
}

const json = JSON.stringify(jsonMap, null, 2);

fs.writeFile('card-map.json', json, err => {
  if (err) throw err;
  console.log('Saved!');
});


