import { useEffect } from 'react';
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { PlayerInterface } from "../../types/models";
import InitialState from "../../types/redux/game";
// import { initialState } from "../../types/redux/lobby";

function Game() {
  const game: InitialState = useSelector(
    (state: RootState) => {
      return state.game;
    }
  );

  // const gameState: initialState = useSelector(
  //   (state: RootState) => {
  //     return state.gameState;
  //   }
  // )
  
  return (
    <>
      <div>
        OH HI
      </div>
    </>
  );
}
export default Game;