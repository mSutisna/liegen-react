
export const MAX_AMOUNT_OF_PLAYERS = 4;

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

export const SUITS = [CardSuits.HEARTS, CardSuits.CLUBS, CardSuits.DIAMONDS, CardSuits.SPADES];

export const EVENT_START_GAME = 'start_game';
export const EVENT_RECEIVE_CARD = 'receive_card';
export const EVENT_MAKE_SET = 'make_set';
export const EVENT_MAKE_SET_RESPONSE = 'make_set_response';
export const EVENT_CALL_BUST = 'call_bust';
export const EVENT_CALL_BUST_RESPONSE = 'call_bust_response';
export const EVENT_SET_PLAYER_TURN = 'set_player_turn';
export const EVENT_MOVE_SET_TO_MIDDLE = 'move_set_to_middle';
export const EVENT_RESET_TO_LOBBY = 'reset_to_lobby';

export enum GameStates {
  IDLE = 'idle',
  PLAYING = 'playing'
}

export enum StartGameTypes {
  START_GAME = 'startGame',
  CONTINUE_GAME = 'continueGame'
}

