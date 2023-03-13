// Please note that this gist follows the repo available at: https://github.com/delasign/react-redux-tutorial
import InitialState, { UpdateGameAction, ReceiveCardPayload, MakeSetPayload, CallBustPayload } from "../types/redux/game";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PlayerInterface } from "../types/models";
import { RANKS, SUITS } from "../constants";
import { createCardName } from "../utilities/card-helper-functions";

import Hand from '../models/Hand';

const initialState: InitialState = {
  players: [],
  middle: {
    set: null,
    previousCards: []
  },
  mainPlayerIndex: 0,
  currentPlayerIndex: 0,
  previousPlayerIndex: null,
};

export const gameSlice = createSlice({
  name: UpdateGameAction,
  initialState: initialState,
  reducers: {
    setPlayers: (state : InitialState, action: PayloadAction<Array<PlayerInterface>>) => {
      state.players = action.payload;
    },
    setPlayerCenterCoordinates: (state: InitialState, action: PayloadAction<{playerIndex: number, x: number, y: number}>) => {
      const player = state.players[action.payload.playerIndex]
      player.xPoint = action.payload.x;
      player.yPoint = action.payload.y;
    },
    increaseRank: (state: InitialState) => {
      const player = state.players[state.mainPlayerIndex];
      let selectedRank = player.selectedRank += 1;
      if (selectedRank > (RANKS.length - 1)) {
        selectedRank = 0;
      }
      player.selectedRank = selectedRank;
    },
    decreaseRank: (state: InitialState) => {
      const player = state.players[state.mainPlayerIndex];
      let selectedRank = player.selectedRank -= 1;
      if (selectedRank < 0) {
        selectedRank = RANKS.length - 1;
      }
      player.selectedRank = selectedRank;
    },
    toggleCardSelected: (state: InitialState, action: PayloadAction<string>) => {
      const cards = state.players[state.mainPlayerIndex].cards;
      const index = cards.findIndex(card => createCardName(card.suit, card.rank) === action.payload);
      if (index === -1) {
        return;
      }
      cards[index].selected = !cards[index].selected;
    },
    receiveCard: (state : InitialState, action: PayloadAction<ReceiveCardPayload>) => {
      const receivingPlayerIndex = action.payload.receivingPlayerIndex;
      const originPlayerIndex = action.payload.originPlayerIndex;
      const receivingPlayer = state.players[receivingPlayerIndex];
      const hand = new Hand(
        receivingPlayer.name, 
        receivingPlayer.cards, 
        receivingPlayer.selectedRank, 
        receivingPlayer.xPoint, 
        receivingPlayer.yPoint
      );
      const card = action.payload.card;
      card.originIndex = originPlayerIndex;
      card.faceDown = state.mainPlayerIndex === receivingPlayerIndex;
      card.received = false;
      hand.receiveCard(card);
      // state.players[receivingPlayerIndex] = hand.serialize();
    },
    makeSet: (state : InitialState) => {
      const player = state.players[state.mainPlayerIndex];
      const playerCards = player.cards;
      const selectedCards = playerCards.filter(playerCard => playerCard.selected);
      const leftOverCards = playerCards.filter(playerCard => !playerCard.selected);
      
      const rankIndex = player.selectedRank;
      const rank = RANKS[rankIndex];
      const amount = selectedCards.length;
      const realCards = selectedCards.map(selectedCard => {
        return {
          rank: selectedCard.rank,
          suit: selectedCard.suit,
          faceDown: true
        }
      });
      const supposedCards = [];
      for (let i = 0; i < amount; i++) {
        const suit = SUITS[i];
        supposedCards.push({
          rank,
          suit,
          faceDown: false,
        })
      }
      const previousMiddleSet = state.middle.set;
      if (previousMiddleSet) {
        for (const setCard of previousMiddleSet.realCards) {
          state.middle.previousCards.push({
            rank: setCard.rank,
            suit: setCard.suit,
            faceDown: true
          })
        }
      }
      state.players[state.mainPlayerIndex].cards = leftOverCards;
      state.middle.set = {
        rank,
        amount,
        playerIndex: state.mainPlayerIndex,
        realCards,
        supposedCards
      }
    },
    callBust: (state : InitialState) => {

    }
  },
});

// Action creators are generated for each case reducer function
export const { 
  setPlayers, 
  setPlayerCenterCoordinates,
  receiveCard, 
  makeSet, 
  callBust, 
  increaseRank, 
  decreaseRank, 
  toggleCardSelected 
} =
  gameSlice.actions;
// You must export the reducer as follows for it to be able to be read by the store.
export default gameSlice.reducer;