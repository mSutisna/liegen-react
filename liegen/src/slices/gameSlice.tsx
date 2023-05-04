import InitialState, { UpdateGameAction, ReceiveCardPayload, ToggleCardSelectedPayload, MakeSetPayload, CallBustPayload } from "../types/redux/game";
import { createSlice, PayloadAction, Dispatch, AnyAction, current } from "@reduxjs/toolkit";
import { 
  PlayerInterface,
  CardUrls,
  CardForPlayerInterface,
  CardUrlsComplete,
  InitGameData,
  MiddleInterface,
  BaseCardInterface,
  SerializedMiddle,
  SetInterface
} from "../types/models";
import { RANKS, SUITS, BurnType, CardRanks, CardSuits, CardUrlType, RANKS_INDEXES, SUITS_INDEXES } from "../constants";
import { createCardName } from "../utilities/card-helper-functions";
import { MessageModalPayload, ModalAnimationType } from "../types/redux/game";
import { AnimationStatus } from "../types/models";
import { createPlayersOrder } from "../utilities/general-helper-functions";
import { Player } from "../types/props";
import { LobbyPlayerData } from "../types/pages/lobby";
import { CallBustResponse, MakeSetDataResponse } from "../types/pages/game";

const initialState: InitialState = {
  players: [],
  playersOrder: [],
  userID: '',
  middle: {
    set: null,
    previousSet: null,
    burnedCards: [],
    playerToCallBust: null,
    setAnimationStatus: AnimationStatus.IDLE,
    bustAnimationStatus: AnimationStatus.IDLE,
    callBustResponse: null,
  },
  // middle: {
  //   set: {
  //     playerIndex: 0,
  //     realCards: [
  //       {suitIndex: CardSuits.HEARTS, rankIndex: CardRanks.KING, faceDown: true},
  //       {suitIndex: CardSuits.DIAMONDS, rankIndex: CardRanks.ACE, faceDown: true},
  //       {suitIndex: CardSuits.SPADES, rankIndex: CardRanks.ACE, faceDown: true},
  //     ],
  //     supposedCards: [
  //       {suitIndex: CardSuits.DIAMONDS, rankIndex: CardRanks.ACE, faceDown: false},
  //       {suitIndex: CardSuits.DIAMONDS, rankIndex: CardRanks.ACE, faceDown: false},
  //       {suitIndex: CardSuits.DIAMONDS, rankIndex: CardRanks.ACE, faceDown: false},
  //     ],
  //     rank: CardRanks.ACE,
  //     amount: 3,
  //   },
  //   previousSet: null,
  //   burnedCards: [],
  //   playerToCallBust: null,
  //   setAnimationStatus: AnimationStatus.FINISHED,
  //   bustAnimationStatus: AnimationStatus.IDLE,
  // },
  mainPlayerIndex: 0,
  currentPlayerIndex: 0,
  previousPlayerIndex: null,
  cardUrls: {},
  cardUrlsRegular: {},
  cardUrlsMobile: {},
  messageModal: {
    visible: false,
    message: '',
    modalAnimation: ModalAnimationType.REGULAR,
    disableCloseButton: false
  },
  clockwise: true,
  allCardsModalVisible: false,
  playerIndexWhoWon: null,
  gameOver: false
};

export const gameSlice = createSlice({
  name: UpdateGameAction,
  initialState: initialState,
  reducers: {
    setUserID: (state: InitialState, action: PayloadAction<string>) => {
      state.userID = action.payload;
    },
    setPlayers: (state: InitialState, action: PayloadAction<Array<LobbyPlayerData>>) => {
      const players = action.payload;
      for (let i = 0; i < players.length; i++) {
        const player = players[i] as PlayerInterface
        player.name = player.username;
        player.originPoint = {
          x: 0,
          y: 0
        };
        player.index = i;
        player.cards = [];
        player.selectedRank = 0;
      }
      const newPlayers = players as Array<PlayerInterface>;
      state.players = newPlayers;
    },
    setMainPlayerIndex: (state: InitialState, action: PayloadAction<Array<LobbyPlayerData>>) => {
      let mainPlayerIndex = 0;
      const players = action.payload;
      for (let i = 0; i < players.length; i++) {
        const player = players[i];
        if (player.userID === state.userID) {
          mainPlayerIndex = i;
          break;
        }
      }
      state.mainPlayerIndex = mainPlayerIndex;
      const playersOrder = createPlayersOrder(state.players, state.mainPlayerIndex);
      state.playersOrder = playersOrder;
    },
    initGame: (state: InitialState, action: PayloadAction<InitGameData>) => {
      const payload = action.payload;
      const players = payload.players;
      const adjustedPlayers: Array<PlayerInterface> = []
      for (let i = 0; i < players.length; i++) {
        const player = players[i];
        const convertedCards: Array<CardForPlayerInterface> = [];
        for (const card of player.cards) {
          const convertedCard: CardForPlayerInterface = {
            selected: false,
            originPoint: {
              x: 0,
              y: 0
            },
            receiveAnimationStatus: AnimationStatus.FINISHED,
            rankIndex: RANKS_INDEXES[card.rank],
            suitIndex: SUITS_INDEXES[card.suit],
            faceDown: player.sessionData.userID !== payload.userID
          }
          convertedCards.push(convertedCard);
        }
        const adjustedPlayer = {
          name: player.sessionData.username,
          userID: player.sessionData.userID,
          connected: player.sessionData.connected,
          ready: player.sessionData.ready,
          originPoint: {
            x: 0,
            y: 0
          },
          index: i,
          cards: convertedCards,
          selectedRank: 0
        } as PlayerInterface;
        adjustedPlayers.push(adjustedPlayer);
      }
      const adjustMiddle = (serializedMiddle: SerializedMiddle) : MiddleInterface => {
        let adjustedSet: SetInterface | null = null;
        if (serializedMiddle.set) {
          const middleSet = serializedMiddle.set;
          const playerIndex = state.players.findIndex(player => player.userID === middleSet.player.sessionData.userID);
          const rankIndex = middleSet.rank;
          const amount = middleSet.amount;
          const realCards = middleSet.actualCards.map(selectedCard => {
            return {
              rankIndex: RANKS_INDEXES[selectedCard.rank],
              suitIndex: SUITS_INDEXES[selectedCard.suit],
              faceDown: true
            }
          });
          const supposedCards = [];
          for (let suitIndex = 0; suitIndex < amount; suitIndex++) {
            supposedCards.push({
              rankIndex,
              suitIndex,
              faceDown: false,
            })
          }
          adjustedSet = {
            rank: middleSet.rank,
            amount: middleSet.amount,
            playerIndex,
            realCards,
            supposedCards
          }
        }
      
        const adjustedCards: Array<BaseCardInterface> = [];
        for (const card of serializedMiddle.cards) {
          adjustedCards.push({
            rankIndex: RANKS_INDEXES[card.rank],
            suitIndex: SUITS_INDEXES[card.suit],
            faceDown: true
          })
        }
        return {
          set: adjustedSet,
          previousSet: null,
          burnedCards: adjustedCards,
          playerToCallBust: null,
          setAnimationStatus: AnimationStatus.FINISHED,
          bustAnimationStatus: AnimationStatus.IDLE,
          callBustResponse: null
        };
      }
  
      const adjustedMiddle = adjustMiddle(payload.middleData);
      const data = action.payload;
      state.players = adjustedPlayers;
      state.middle = adjustedMiddle;
      state.currentPlayerIndex = data.selectedPlayerIndex;
      state.mainPlayerIndex = data.playerIndex;
      state.userID = data.userID;
      state.gameOver = data.gameOver;
      state.playerIndexWhoWon = data.playerIndexWhoWon;
      state.playersOrder = createPlayersOrder(state.players, state.mainPlayerIndex);
    },
    setPlayersOrder: (state: InitialState, action: PayloadAction<Array<number>>) => {
      state.playersOrder = action.payload;
    },
    setCardUrls: (state: InitialState, action: PayloadAction<CardUrlsComplete>) => {
      for (const [cardName, urls] of Object.entries(action.payload)) {
        state.cardUrlsRegular[cardName] = urls.regular;
        state.cardUrlsMobile[cardName] = urls.mobile;
      }
    },
    setCardUrlsToUse: (state: InitialState, action: PayloadAction<CardUrlType>) => {
      let newCardUrls;
      if (action.payload === CardUrlType.REGULAR) {
        newCardUrls = state.cardUrlsRegular;
      } else {
        newCardUrls = state.cardUrlsMobile;
      }
      newCardUrls = JSON.parse(JSON.stringify(newCardUrls)) as CardUrls;
      state.cardUrls = newCardUrls;
    },
    setCardReceivedAnimationStatus: (state: InitialState, action: PayloadAction<{playerIndex: number, cardIndex: number, status: AnimationStatus}>) => {
      const player = state.players[action.payload.playerIndex];
      const card = player.cards[action.payload.cardIndex];
      if (!card) {
        return;
      }
      card.receiveAnimationStatus = action.payload.status;
    },
    setSetAnimationStatus: (state: InitialState, action: PayloadAction<AnimationStatus>) => {
      state.middle.setAnimationStatus = action.payload;
    },
    setBustAnimationStatus: (state: InitialState, action: PayloadAction<AnimationStatus>) => {
      state.middle.bustAnimationStatus = action.payload;
    },
    setPlayerCenterCoordinates: (state: InitialState, action: PayloadAction<{playerIndex: number, x: number, y: number}>) => {
      const player = state.players[action.payload.playerIndex]
      player.originPoint = {
        x: action.payload.x,
        y: action.payload.y
      }
    },
    burnCards: (state: InitialState, action: PayloadAction<BurnType>) => {
      const setKey = action.payload === BurnType.CURRENT_SET
        ? 'set'
        : 'previousSet';
      const set = state.middle[setKey];
      if (!set) {
        return;
      }
      let cardsToBurn = [];
      for (const cardToBurn of set.realCards) {
        cardsToBurn.push({...cardToBurn});
      }
      state.middle.burnedCards = [...state.middle.burnedCards, ...cardsToBurn];
      state.middle[setKey] = null;
    },
    afterBustResetMiddle: (state: InitialState) => {
      state.middle.set = null;
      state.middle.previousSet = null;
      state.middle.burnedCards = [];
      state.middle.playerToCallBust = null;
      state.middle.callBustResponse = null;
      state.middle.setAnimationStatus = AnimationStatus.IDLE;
      state.middle.bustAnimationStatus = AnimationStatus.IDLE;
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
    toggleCardSelected: (state: InitialState, action: PayloadAction<ToggleCardSelectedPayload>) => {
      const cards = state.players[action.payload.playerIndex].cards;
      const index = cards.findIndex(card => createCardName(SUITS[card.suitIndex ?? -1], RANKS[card.rankIndex ?? -1]) === action.payload.cardName);
      if (index === -1) {
        return;
      }
      cards[index].selected = !cards[index].selected;
    },
    receiveCard: (state : InitialState, action: PayloadAction<ReceiveCardPayload>) => {
      const receivingPlayerIndex = action.payload.receivingPlayerIndex;
      const receivingPlayer = state.players[receivingPlayerIndex];
      const payloadCard = action.payload.card;
      const card : CardForPlayerInterface = {
        rankIndex: RANKS_INDEXES[payloadCard.rank],
        suitIndex: SUITS_INDEXES[payloadCard.suit],
        faceDown: payloadCard.faceDown ?? receivingPlayer.userID !== state.userID,
        selected: false,
        originPoint: {x: 0, y: 0},
        receiveAnimationStatus: AnimationStatus.IDLE
      }
      receivingPlayer.cards.push(card);
    },
    makeSet: (state : InitialState, action: PayloadAction<MakeSetDataResponse>) => {
      const payload = action.payload;
      const player = state.players[payload.prevPlayerIndex];
      const payloadSelectedCards = payload.cardsData;
      const selectedCards: Array<BaseCardInterface> = [];
      const createCardKey = (card: BaseCardInterface) => {
        return `${card.suitIndex}-${card.rankIndex}`;
      }
      const keysSelectedCards: Array<String> = [];
      for (const payloadSelectedCard of payloadSelectedCards) {
        const selectedCard: BaseCardInterface = {
          rankIndex: RANKS_INDEXES[payloadSelectedCard.rank],
          suitIndex: SUITS_INDEXES[payloadSelectedCard.suit],
          faceDown: true,
        }
        keysSelectedCards.push(createCardKey(selectedCard));
        selectedCards.push(selectedCard);
      }

      let leftOverCards: Array<CardForPlayerInterface> = [];
      if (payload.prevPlayerIndex === state.mainPlayerIndex) {
        leftOverCards = player.cards.filter(playerCard => !keysSelectedCards.includes(createCardKey(playerCard)));
      } else {
        leftOverCards = player.cards;
        for (let i = 0; i < keysSelectedCards.length; i++) {
          leftOverCards.pop();
        }
      }
      const rankIndex = RANKS_INDEXES[payload.rank];
      const amount = payload.amount;
      const realCards = selectedCards.map(selectedCard => {
        return {
          rankIndex: selectedCard.rankIndex,
          suitIndex: selectedCard.suitIndex,
          faceDown: true
        }
      });
      const supposedCards = [];
      for (let suitIndex = 0; suitIndex < amount; suitIndex++) {
        supposedCards.push({
          rankIndex,
          suitIndex,
          faceDown: false,
        })
      }
      player.cards = leftOverCards;
      player.selectedRank = 0;
      state.middle.previousSet = state.middle.set;
      state.middle.set = {
        rank: rankIndex,
        amount,
        playerIndex: payload.prevPlayerIndex,
        realCards,
        supposedCards,
      }
      state.middle.setAnimationStatus = AnimationStatus.IDLE;
      state.middle.bustAnimationStatus = AnimationStatus.IDLE;
    },
    callBust: (state : InitialState, action: PayloadAction<CallBustResponse>) => {
      state.middle.callBustResponse = action.payload;
      // state.middle.playerToCallBust = state.callBustResponse.playerToCallBustIndex;
    },
    switchToNextPlayer: (state: InitialState, action: PayloadAction<number | null>) => {
      const endPlayerIndex = state.players.length - 1;
      if (action.payload !== null) {
        state.currentPlayerIndex = action.payload;
      } else {
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
      }
    },
    callBustFinished: (state: InitialState) => {
      state.middle.playerToCallBust = null;
    },
    setMessageModalMessage: (state: InitialState, action: PayloadAction<MessageModalPayload>) => {
      const data = action.payload;
      state.messageModal.visible = true;
      state.messageModal.message = data.message;
      state.messageModal.disableCloseButton = data.disableCloseButton ?? false;
      state.messageModal.modalAnimation = data.modalAnimation ?? ModalAnimationType.REGULAR;
    },
    setVisibilityMessageModal: (state: InitialState, action: PayloadAction<boolean>) => {
      state.messageModal.visible = action.payload;
    },
    setVisibilityAllCardsModal: (state: InitialState, action: PayloadAction<boolean>) => {
      state.allCardsModalVisible = action.payload;
    }
  },
});

// Action creators are generated for each case reducer function
export const {
  setUserID,
  setPlayers,
  setMainPlayerIndex,
  initGame,
  setPlayersOrder,
  setCardUrls,
  setCardUrlsToUse,
  setPlayerCenterCoordinates,
  receiveCard,
  setCardReceivedAnimationStatus, 
  setSetAnimationStatus,
  setBustAnimationStatus,
  afterBustResetMiddle,
  makeSet,
  switchToNextPlayer,
  burnCards, 
  callBust,
  increaseRank, 
  decreaseRank, 
  toggleCardSelected,
  setMessageModalMessage,
  setVisibilityMessageModal,
  setVisibilityAllCardsModal
} = gameSlice.actions;

const helpFunctions = {
  displayNewMessage: async (
    dispatch: Dispatch<AnyAction>,
    message: string,
    modalAnimation: ModalAnimationType = ModalAnimationType.REGULAR,
    disableCloseButton: boolean = false
  ) => {
    await dispatch(gameSlice.actions.setVisibilityMessageModal(true));
    dispatch(gameSlice.actions.setMessageModalMessage({
      message,
      modalAnimation,
      disableCloseButton
    }))
  }
};

export const {
  displayNewMessage
} = helpFunctions;


// You must export the reducer as follows for it to be able to be read by the store.
export default gameSlice.reducer;