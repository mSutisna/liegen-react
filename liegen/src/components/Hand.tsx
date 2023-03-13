import { HandProps } from '../types/props';
import { determinePositionCoordinates } from '../utilities/player-position-determination';
import { DESKTOP_HAND_WIDTH, DESKTOP_HAND_HEIGHT } from '../constants';
import { useEffect, useRef } from 'react';
import { useDispatch } from "react-redux";
import {
  setPlayerCenterCoordinates
} from "../slices/gameSlice";

function Hand({name, index, amountOfPlayers, gameWidth, gameHeight}: HandProps) {
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  useEffect(() => {
    let mainX = 0;
    let mainY = 0;
    if (mainContainerRef.current) {
      const position = mainContainerRef.current.getBoundingClientRect();
      mainX = position.left + (position.width / 2);
      mainY = position.top + (position.height / 2);
    }
    dispatch(setPlayerCenterCoordinates({playerIndex: index, x: mainX, y: mainY}))
  }, []);
  const position = determinePositionCoordinates(
    index,
    amountOfPlayers,
    gameWidth,
    gameHeight,
    DESKTOP_HAND_WIDTH,
    DESKTOP_HAND_HEIGHT
  )
  const style = {
    ...position,
    width: DESKTOP_HAND_WIDTH,
    height: DESKTOP_HAND_HEIGHT
  }
  return (
    <div className="hand" style={style} ref={mainContainerRef}>
      {name}
    </div>
  )
}

export default Hand;

