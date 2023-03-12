// Please note that this gist follows the repo available at: https://github.com/delasign/react-redux-tutorial
import InitialState, { UpdateGameAction, ReceiveCardPayload, MakeSetPayload, CallBustPayload } from "../types/redux/game";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PlayerInterface } from "../types/models";

import Hand from '../models/Hand';

const initialState: InitialState = {
  players: [],
  middle: {
    set: null,
    previousCards: []
  },
  mainPlayerIndex: null,
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
    receiveCard: (state : InitialState, action: PayloadAction<ReceiveCardPayload>) => {
      const receivingPlayerIndex = action.payload.receivingPlayerIndex;
      const originPlayerIndex = action.payload.originPlayerIndex;
      const receivingPlayer = state.players[receivingPlayerIndex];
      const hand = new Hand(receivingPlayer.name, receivingPlayer.cards);
      const card = action.payload.card;
      card.originIndex = originPlayerIndex;
      card.faceDown = state.mainPlayerIndex === receivingPlayerIndex;
      card.received = false;
      hand.receiveCard(card);
      // state.players[receivingPlayerIndex] = hand.serialize();
    },
    makeSet: (state : InitialState, action: PayloadAction<MakeSetPayload>) => {

    },
    callBust: (state, action: PayloadAction<CallBustPayload>) => {

    }
  },
});

// Action creators are generated for each case reducer function
export const { setPlayers, receiveCard, makeSet, callBust } =
  gameSlice.actions;
// You must export the reducer as follows for it to be able to be read by the store.
export default gameSlice.reducer;