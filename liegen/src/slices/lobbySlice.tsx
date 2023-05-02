import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { LobbyState } from '../types/redux/lobby';
import { LobbyPlayerData } from '../types/pages/lobby';

const initialState: LobbyState = {
  userID: '',
  players: [],
  gameStarted: false,
}

export const lobbySlice = createSlice({
  name: 'lobbyState',
  initialState,
  reducers: {
    setUserID: (state: LobbyState, action: PayloadAction<string>) => {
      state.userID = action.payload
    },
    setPlayers: (state: LobbyState, action: PayloadAction<Array<LobbyPlayerData>>) => {
      state.players = action.payload
    },
    setGameStarted: (state: LobbyState, action: PayloadAction<boolean>) => {
      state.gameStarted = action.payload;
    }
  }
})

export const {
  setUserID, 
  setPlayers, 
  setGameStarted,
} = lobbySlice.actions;

export default lobbySlice.reducer;