import { createSlice } from '@reduxjs/toolkit';
import { initialState as initialStateType } from '../types/redux/gameState';

const initialState: initialStateType = {
  userData: {},
  gameData: {
    players: [],
  },
  connectedWithServer: null
}

export const gameStateSlice = createSlice({
  name: 'gameState',
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.connectedWithServer = true;
      state.userData = action.payload;
    },
    setGameData: (state, action) => {
      state.gameData = action.payload;
    },
    setPlayers: (state, action) => {
      state.gameData.players = action.payload;
    },
    setPlayingGame: (state, action) => {
      state.gameData.playingGame = action.payload;
    },
  }
})

export const { 
  setUserData, 
  setGameData, 
  setPlayers,
  setPlayingGame 
} = gameStateSlice.actions;

export default gameStateSlice.reducer;