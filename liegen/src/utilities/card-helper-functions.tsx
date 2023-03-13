import { RANKS, SUITS } from "../constants";
const cardsInDeckAmount = 52;

function createCardNames() {
  const cardKeys = [];
  let rankIndex = 0;
  let suitIndex = 0;
  for (let i = 0; i < cardsInDeckAmount; i++) {
    if (rankIndex === RANKS.length) {
      rankIndex = 0;
    }
    if (suitIndex === SUITS.length) {
      suitIndex = 0;
    }
    const suit = SUITS[suitIndex];
    const rank = RANKS[rankIndex];
    const cardKey = createCardName(suit, rank);
    cardKeys.push(cardKey);
    rankIndex += 1;
    if (rankIndex === RANKS.length) {
      suitIndex += 1;
    }
  }
  cardKeys.push('Backside')
  return cardKeys;
}

function createCardName(suit : string, rank: string) {
  return `${suit}-${rank}`;
}

export {
  createCardName,
  createCardNames
}