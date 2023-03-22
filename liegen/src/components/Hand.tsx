import { HandProps } from '../types/props';
import { CardUrls } from '../types/models';
import { determinePositionCoordinates } from '../utilities/player-position-determination';
import { DESKTOP_HAND_WIDTH, DESKTOP_HAND_HEIGHT, DESKTOP_CARD_WIDTH, DESKTOP_CARD_HEIGHT, DESKTOP_CARD_SCALE } from '../constants';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { determineXandYForCard } from '../utilities/card-position-determination';
import {
  setPlayerCenterCoordinates
} from "../slices/gameSlice";
import { createCardName } from '../utilities/card-helper-functions';
import { RootState } from '../store';
import Card from './Card';

function Hand({name, index, amountOfPlayers, gameWidth, gameHeight, cards}: HandProps) {
  const cardUrls: CardUrls  = useSelector(
    (state: RootState) => {
      return state.game.cardUrls;
    }
  );
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

  const cardContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div className={`hand player-${index}`} style={style} ref={mainContainerRef}>
      <div className="name-wrapper">
        <div className="name">
          {name}
        </div>
      </div>
      <div
          ref={cardContainerRef}
          className="cards"
        >
          {cards.map((card, index) => {
            const cardKey = createCardName(card.suit ?? '', card.rank ?? '')
            if (!cardUrls[cardKey]) {
              return null;
            }
            let containerX = 0;
            let containerY = 0;
            if (cardContainerRef.current) {
              const position = cardContainerRef.current.getBoundingClientRect();
              containerX = position.left;
              containerY = position.top;
            }
            const offsetData = determineXandYForCard(cards, index, DESKTOP_CARD_SCALE);
            const left = offsetData.x;
            const top = offsetData.y;
            const delay = 0.02 + (0.06 * index);

            return <Card
              key={`cardIndex-${index}`}
              url={cardUrls[cardKey]}
              width={DESKTOP_CARD_WIDTH * DESKTOP_CARD_SCALE}
              height={DESKTOP_CARD_HEIGHT * DESKTOP_CARD_SCALE}
              left={left}
              top={top}
              startLeft={-containerX - left}
              startTop={-containerY - top}
              delay={delay}
              rank={card.rank}
              suit={card.suit}
              faceDown={card.faceDown}
            />
          })}
        </div>
    </div>
  )
}

export default Hand;

