const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const suits = ['Hearts', 'Clubs', 'Diamonds', 'Spades'];
const cardsInDeckAmount = 52;

function createCardNames() {
  const cardKeys = [];
  let rankIndex = 0;
  let suitIndex = 0;
  for (let i = 0; i < cardsInDeckAmount; i++) {
    if (rankIndex === ranks.length) {
      rankIndex = 0;
    }
    if (suitIndex === suits.length) {
      suitIndex = 0;
    }
    const suit = suits[suitIndex];
    const rank = ranks[rankIndex];
    const cardKey = createCardName(suit, rank);
    cardKeys.push(cardKey);
    rankIndex += 1;
    if (rankIndex === ranks.length) {
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