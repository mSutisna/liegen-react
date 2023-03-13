import { DESKTOP_CARD_HEIGHT, DESKTOP_CARD_WIDTH, DESKTOP_CARD_GUTTER_SIZE } from "../constants";
import { BaseCardInterface } from "../types/models";

export interface CardOffsetData {
  x: number,
  y: number,
  depth: number
}

export function determineXandYForCard(
  cards : Array<BaseCardInterface>, 
  index : number,
  scale : number
) {
  const cardWidth = DESKTOP_CARD_WIDTH * scale;
  const cardHeight = DESKTOP_CARD_HEIGHT * scale;
  const gutterSize = DESKTOP_CARD_GUTTER_SIZE * scale;
  const maxRows = Math.ceil(cards.length / 5);
  const currentRow = Math.floor(index / 5);
  const currentColumn = index % 5;
  let cardsWithGutter = cards.length - 1;
  if (cardsWithGutter > 4) {
    cardsWithGutter = 4;
  }
  const width = cardWidth + (cardsWithGutter * gutterSize);
  let xOffset = currentColumn * gutterSize;
  // if (cards.length - 1) {
  //   xOffset -= width / 2;
  // }
  // if (cards.length > 1) {
  //   xOffset += (cardWidth / 2);
  // }
  const offsetYGutterSize = 50;
  let yOffset = 0;
  if (maxRows > 1) {
    yOffset = (currentRow * offsetYGutterSize) / 2;
  }
  return {
    x: xOffset,
    y: yOffset,
    depth: currentRow
  }
}