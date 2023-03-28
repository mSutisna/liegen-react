import InitialState, { UpdateGameAction, ReceiveCardPayload } from "../types/redux/game";
import { createSlice, PayloadAction, current, Dispatch, AnyAction } from "@reduxjs/toolkit";
import { PlayerInterface, CardUrls } from "../types/models";
import { RANKS, SUITS, MESSAGE_MODAL_REGULAR_DISPLAY_ANIMATION } from "../constants";
import { createCardName } from "../utilities/card-helper-functions";
import { MessageModalPayload } from "../types/redux/game";
import { AnimationStatus } from "../types/models";

const initialState: InitialState = {
  players: [],
  middle: {
    set: null,
    previousSet: null,
    burnedCards: [],
    playerToCallBust: null,
    setAnimationStatus: AnimationStatus.IDLE,
    bustAnimationStatus: AnimationStatus.IDLE,
  },
  // middle: {
  //   set: {
  //     playerIndex: 0,
  //     realCards: [
  //       {suit: 'Diamonds', rank: '3', faceDown: true},
  //       {suit: 'Diamonds', rank: '4', faceDown: true},
  //       {suit: 'Diamonds', rank: '5', faceDown: true},
  //     ],
  //     supposedCards: [
  //       {suit: 'Diamonds', rank: 'A', faceDown: false},
  //       {suit: 'Diamonds', rank: 'A', faceDown: false},
  //       {suit: 'Diamonds', rank: 'A', faceDown: false},
  //     ],
  //     rank: 'A',
  //     amount: 3,
  //   },
  //   previousSet: null,
  //   burnedCards: [],
  //   playerToCallBust: null,
  //   setAnimationStatus: AnimationStatus.FINISHED,
  //   bustAnimationStatus: AnimationStatus.IDLE,
  // },
  mainPlayerIndex: 0,
  currentPlayerIndex: 1,
  previousPlayerIndex: null,
  cardUrls: {},
  messageModal: {
    visible: false,
    message: '',
    modalAnimation: MESSAGE_MODAL_REGULAR_DISPLAY_ANIMATION,
    disableCloseButton: false
  },
  clockwise: true
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
    setCardUrls: (state: InitialState, action: PayloadAction<CardUrls>) => {
      state.cardUrls = action.payload;
    },
    setCardReceivedAnimationFinished: (state: InitialState, action: PayloadAction<{playerIndex: number, cardIndex: number}>) => {
      const player = state.players[action.payload.playerIndex];
      const card = player.cards[action.payload.cardIndex];
      if (!card) {
        return;
      }
      card.receiveAnimationPlayed = true;
    },
    setSetAnimationFinished: (state: InitialState) => {
      if (!state.middle.set) {
        return;
      }
      state.middle.setAnimationStatus = AnimationStatus.FINISHED;
    },
    increaseRank: (state: InitialState) => {
      const player = state.players[state.currentPlayerIndex];
      let selectedRank = player.selectedRank += 1;
      if (selectedRank > (RANKS.length - 1)) {
        selectedRank = 0;
      }
      player.selectedRank = selectedRank;
    },
    decreaseRank: (state: InitialState) => {
      const player = state.players[state.currentPlayerIndex];
      let selectedRank = player.selectedRank -= 1;
      if (selectedRank < 0) {
        selectedRank = RANKS.length - 1;
      }
      player.selectedRank = selectedRank;
    },
    toggleCardSelected: (state: InitialState, action: PayloadAction<string>) => {
      const cards = state.players[state.currentPlayerIndex].cards;
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
      const card = action.payload.card;
      card.originIndex = originPlayerIndex;
      card.faceDown = state.mainPlayerIndex === receivingPlayerIndex;
      card.received = false;
      receivingPlayer.cards.push(card);
    },
    makeSet: (state : InitialState) => {
      const player = state.players[state.currentPlayerIndex];
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
          state.middle.burnedCards.push({
            rank: setCard.rank,
            suit: setCard.suit,
            faceDown: true
          })
        }
      }
      player.cards = leftOverCards;
      player.selectedRank = 0;
      state.middle.previousSet = state.middle.set;
      state.middle.set = {
        rank,
        amount,
        playerIndex: state.currentPlayerIndex,
        realCards,
        supposedCards,
      }
      state.middle.setAnimationStatus = AnimationStatus.IDLE;
      const endPlayerIndex = state.players.length - 1;
      if (state.clockwise) {
        state.currentPlayerIndex -= 1;
        if (state.currentPlayerIndex < 0) {
          state.currentPlayerIndex = endPlayerIndex;
        }
      } else {
        state.currentPlayerIndex += 1;
        if (state.currentPlayerIndex > endPlayerIndex) {
          state.currentPlayerIndex = 0;
        }
      }
    },
    callBust: (state : InitialState) => {
      state.middle.playerToCallBust = state.currentPlayerIndex;
    },
    callBustFinished: (state: InitialState) => {
      state.middle.playerToCallBust = null;
    },
    setMessageModalMessage: (state: InitialState, action: PayloadAction<MessageModalPayload>) => {
      const data = action.payload;
      state.messageModal.visible = true;
      state.messageModal.message = data.message;
      state.messageModal.disableCloseButton = data.disableCloseButton ?? false;
      state.messageModal.modalAnimation = data.modalAnimation ?? MESSAGE_MODAL_REGULAR_DISPLAY_ANIMATION;
    },
    hideMessageModal: (state: InitialState ) => {
      state.messageModal.visible = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { 
  setPlayers, 
  setPlayerCenterCoordinates,
  setCardUrls,
  receiveCard,
  setCardReceivedAnimationFinished, 
  setSetAnimationFinished,
  makeSet, 
  callBust, 
  increaseRank, 
  decreaseRank, 
  toggleCardSelected,
  setMessageModalMessage,
  hideMessageModal
} = gameSlice.actions;


const helpFunctions = {
  displayNewMessage: async (
    dispatch: Dispatch<AnyAction>,
    message: string
  ) => {
    await dispatch(gameSlice.actions.hideMessageModal());
    dispatch(gameSlice.actions.setMessageModalMessage({
      message,
    }))
  }
};

export const {
  displayNewMessage
} = helpFunctions;


// You must export the reducer as follows for it to be able to be read by the store.
export default gameSlice.reducer;