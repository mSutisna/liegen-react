export const DESKTOP_GAME_WIDTH = 1200;
export const DESKTOP_GAME_HEIGHT = 800;


export const DESKTOP_PRIMARY_HAND_WIDTH = 600;
export const DESKTOP_PRIMARY_HAND_HEIGHT = 150;

export const DESKTOP_HAND_WIDTH = 400;
export const DESKTOP_HAND_HEIGHT = 150;

export const DESKTOP_MIDDLE_WIDTH = 400;
export const DESKTOP_MIDDLE_HEIGHT = 250;


export const DESKTOP_CARD_WIDTH = 170;
export const DESKTOP_CARD_HEIGHT = 255;

export const DESKTOP_CARD_GUTTER_SIZE = 200;

export const DESKTOP_CARD_SCALE = 0.35;


export const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
export const SUITS = ['Hearts', 'Clubs', 'Diamonds', 'Spades'];

export enum CardUrlType {
  REGULAR = 'regular',
  MOBILE = 'mobile'
}

export enum CardSuits {
  HEARTS = 0,
  CLUBS = 1,
  DIAMONDS = 2,
  SPADES = 3,
}

export enum BurnType {
  CURRENT_SET = 'current_set',
  PREVIOUS_SET = 'previous_set',
}

export enum CardRanks {
  ACE = 0,
  TWO = 1,
  THREE = 2,
  FOUR = 3,
  FIVE = 4,
  SIX = 5,
  SEVEN = 6,
  EIGHT = 7,
  NINE = 8,
  TEN = 9,
  JACK = 10,
  QUEEN = 11,
  KING = 12
}

export enum GridOrientation {
  REGULAR = 'regular',
  REVERSE = 'reverse'
}

export enum GridItemType {
  ROW = 'row',
  COLUMN = 'column'
}

export enum PlayerOrientations {
  TOP = 'top',
  LEFT = 'left',
  RIGHT = 'right'
}

export enum ModalAnimationStyles {
  WIN = 'one',
  REGULAR = 'three'
}