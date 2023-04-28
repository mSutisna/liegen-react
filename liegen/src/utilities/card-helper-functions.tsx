import { ReactNode } from "react";
import { RANKS, SUITS } from "../constants";
import { CardForPlayerInterface } from "../types/models";
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


const createCardCollectionToRender = (
  cards: Array<CardForPlayerInterface>, 
  renderCard: (card: CardForPlayerInterface, index: number, indicateAmount: number | null) => ReactNode,
) : Array<ReactNode> => {
  const cardsToDisplay : Array<ReactNode> = [];
  const displayMoreCardsIndicator = cards.length > 15;
  const leftOverCards = cards.length - 14;
  for (let i = 0; i < cards.length; i++) {
    let indicateAmount = displayMoreCardsIndicator && i === 14
      ? leftOverCards
      : null;
    const cardToDisplay = renderCard(cards[i], i, indicateAmount);
    cardsToDisplay.push(cardToDisplay);
    if (displayMoreCardsIndicator && i === 14) {
      break;
    }
  }
  return cardsToDisplay;
}

export {
  createCardName,
  createCardNames,
  createCardCollectionToRender
}