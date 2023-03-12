import { HandProps } from '../types/props';
import { determinePositionCoordinates } from '../utilities/player-position-determination';
import { DESKTOP_HAND_WIDTH, DESKTOP_HAND_HEIGHT } from '../constants';

function Hand({name, index, amountOfPlayers, gameWidth, gameHeight}: HandProps) {
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
    <div className="hand" style={style}>
      {name}
    </div>
  )
}

export default Hand;

