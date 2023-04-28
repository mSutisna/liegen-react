import { configureStore } from "@reduxjs/toolkit";
// This is how you import a reducer, based on the prior export.
import counterReducer from "./slices/counterSlice";
import gameReducer from './slices/gameSlice';
import gameStateReducer from './slices/gameStateSlice';

const store = configureStore({
  reducer: {
    // You are free to call the LHS what you like, but it must have a reducer on the RHS.
    counter: counterReducer,
    game: gameReducer,
    gameState: gameStateReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;