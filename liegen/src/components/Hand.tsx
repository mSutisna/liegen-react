import { HandProps } from '../types/props';
import { CardUrls } from '../types/models';
import { determinePositionCoordinates } from '../utilities/player-position-determination';
import { DESKTOP_HAND_WIDTH, DESKTOP_HAND_HEIGHT, DESKTOP_CARD_WIDTH, DESKTOP_CARD_HEIGHT, DESKTOP_CARD_SCALE } from '../constants';
import { useRef, useLayoutEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { RootState } from '../store';
import Card from './Card';
import { setPlayerCenterCoordinates } from "../slices/gameSlice";

function Hand({name, index, realIndex, amountOfPlayers, gameWidth, gameHeight, cards, assignIndicatorRefToCollection}: HandProps) {
  const cardUrls: CardUrls  = useSelector(
    (state: RootState) => {
      return state.game.cardUrls;
    }
  );
  const dispatch = useDispatch();
  const currentPlayerIndex: (number) = useSelector(
    (state: RootState) => {
      return state.game.currentPlayerIndex;
    }
  );
  const mainWrapperRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (!mainWrapperRef.current) {
      return;
    }
    const position = mainWrapperRef.current.getBoundingClientRect();
    const mainX = position.left + (position.width / 2);
    const mainY = position.top + (position.height / 2);
    dispatch(setPlayerCenterCoordinates({playerIndex: realIndex, x: mainX, y: mainY}))
  }, [currentPlayerIndex]);

  const cardContainerRef = useRef<HTMLDivElement>(null);
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
    <div 
      className={`hand player-${index}`} 
      style={style} 
      ref={mainWrapperRef}
    >
      <div className="name">
        <div className="name-value">
          {name}
        </div>
        <img 
          src="" 
          className="indicator" 
          ref={element => assignIndicatorRefToCollection(element, index)}
        />
      </div>
      <div
        ref={cardContainerRef}
        className="cards"
      >
        <div className="cards-grid">
          {cards.map((card, cardIndex) => {
            let containerX = 0;
            let containerY = 0;
            if (cardContainerRef.current) {
              const position = cardContainerRef.current.getBoundingClientRect();
              containerX = position.left;
              containerY = position.top;
            }
            // const offsetData = determineXandYForCard(cards, cardIndex, DESKTOP_CARD_SCALE);
            // const left = offsetData.x;
            // const top = offsetData.y;
            let adjustedOriginPoint = null;
            if (card.originPoint) {
              adjustedOriginPoint = {...card.originPoint};
              adjustedOriginPoint.x = -containerX - card.originPoint.x;
              adjustedOriginPoint.y = -containerY - card.originPoint.y;
            }
            const delay = 0.02 + (0.06 * cardIndex);
            return <Card
              key={`cardIndex-${cardIndex}`}
              url={cardUrls['Backside']}
              width={DESKTOP_CARD_WIDTH * DESKTOP_CARD_SCALE}
              height={DESKTOP_CARD_HEIGHT * DESKTOP_CARD_SCALE}
              originPoint={adjustedOriginPoint}
              delay={delay}
              receiveAnimationStatus={card.receiveAnimationStatus}
              playerIndex={realIndex}
              cardIndex={cardIndex}
            />
          })}
        </div>
      </div>
    </div>
  )
}

export default Hand;

