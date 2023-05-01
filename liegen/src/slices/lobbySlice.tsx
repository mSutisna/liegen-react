import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { LobbyState } from '../types/redux/lobby';
import { LobbyPlayerData } from '../types/pages/lobby';

const initialState: LobbyState = {
  userID: '',
  players: []
}

export const gameStateSlice = createSlice({
  name: 'lobbyState',
  initialState,
  reducers: {
    setUserID: (state: LobbyState, action: PayloadAction<string>) => {
      state.userID = action.payload
    },
    setPlayers: (state: LobbyState, action: PayloadAction<Array<LobbyPlayerData>>) => {
      state.players = action.payload
    }
  }
})

export const {
  setUserID, 
  setPlayers, 
} = gameStateSlice.actions;

export default gameStateSlice.reducer;