import { arrayFlip } from "./utils/helper-function.js";

export const MAX_AMOUNT_OF_PLAYERS = 4;

export enum GameStates {
  IDLE = 'idle',
  STARTED = 'started',
  PLAYING = 'playing',
  GAME_OVER = 'gameOver'
}

export enum CardSuits {
  HEARTS = 'Hearts',
  CLUBS = 'Clubs',
  DIAMONDS = 'Diamonds',
  SPADES = 'Spades',
}

export enum CardRanks {
  ACE = 'A',
  TWO = '2',
  THREE = '3',
  FOUR = '4',
  FIVE = '5',
  SIX = '6',
  SEVEN = '7',
  EIGHT = '8',
  NINE = '9',
  TEN = '10',
  JACK = 'J',
  QUEEN = 'Q',
  KING = 'K'
}

export const SUITS = [
  CardSuits.HEARTS, 
  CardSuits.CLUBS, 
  CardSuits.DIAMONDS, 
  CardSuits.SPADES
];

export const SUITS_INDEXES = arrayFlip(SUITS);

export const RANKS = [
  CardRanks.ACE, 
  CardRanks.TWO, 
  CardRanks.THREE, 
  CardRanks.FOUR, 
  CardRanks.FIVE, 
  CardRanks.SIX, 
  CardRanks.SEVEN, 
  CardRanks.EIGHT, 
  CardRanks.NINE, 
  CardRanks.TEN, 
  CardRanks.JACK, 
  CardRanks.QUEEN, 
  CardRanks.KING
];

export const RANKS_INDEXES = arrayFlip(RANKS);