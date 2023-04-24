import { HandProps } from '../types/props';
import { BaseCardInterface, CardUrls, PlayerInterface, CardPosition } from '../types/models';
import { determinePositionCoordinates } from '../utilities/player-position-determination';
import { DESKTOP_HAND_WIDTH, DESKTOP_HAND_HEIGHT, DESKTOP_CARD_WIDTH, DESKTOP_CARD_HEIGHT, DESKTOP_CARD_SCALE, GridOrientation, GridItemType } from '../constants';
import { useRef, useLayoutEffect, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { RootState } from '../store';
import Card from './Card';
import { setPlayerCenterCoordinates } from "../slices/gameSlice";
import questionMark from '../assets/icons/question-mark.svg';
import { determineGridPositionsForCards } from '../utilities/card-position-determination';

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
  const playerCards: (Array<BaseCardInterface> | null) = useSelector(
    (state: RootState) => {
      return state.game.players[realIndex]?.cards ?? null;
    }
  );
  const mainWrapperRef = useRef<HTMLDivElement>(null);
  const cardsGridRef = useRef<HTMLDivElement>(null);
  let amountOfPlayersClass = '';
  if (amountOfPlayers === 2) {
    amountOfPlayersClass = 'two-players';
  } else if (amountOfPlayers === 3) {
    amountOfPlayersClass = 'three-players';
  } else if (amountOfPlayers === 4) {
    amountOfPlayersClass = 'four-players';
  }
  const fourPlayers = amountOfPlayersClass === 'four-players';
  let rowSize = 0;
  let columnSize = 0;
  if (fourPlayers && (index === 1 || index === 3)) {
    columnSize = playerCards.length <= 5
    ? playerCards.length
    : 5;
    rowSize = Math.ceil(playerCards.length / 5);
  } else {
    rowSize = playerCards.length <= 5
      ? playerCards.length
      : 5;
    columnSize = Math.ceil(playerCards.length / 5);
  }

  let cardPositions : Array<CardPosition> = [];
  if (realIndex === 1) {
    cardPositions = determineGridPositionsForCards(
      rowSize,
      columnSize, 
      GridOrientation.REGULAR, 
      GridOrientation.REVERSE, 
      GridItemType.COLUMN
    );
  }

  useLayoutEffect(() => {
    if (!mainWrapperRef.current || !cardsGridRef.current) {
      return;
    }
    if (fourPlayers && (index === 1 || index === 3)) {
      cardsGridRef.current.style.gridTemplateRows = `repeat(${columnSize}, 1fr)`;
      cardsGridRef.current.style.gridTemplateColumns = `repeat(${rowSize}, 1fr)`
    } else {
      cardsGridRef.current.style.gridTemplateColumns = `repeat(${rowSize}, 1fr)`;
    }
    const position = mainWrapperRef.current.getBoundingClientRect();
    const mainX = position.left + (position.width / 2);
    const mainY = position.top + (position.height / 2);
    dispatch(setPlayerCenterCoordinates({playerIndex: realIndex, x: mainX, y: mainY}));
  }, [currentPlayerIndex]);

  const cardContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      className={`hand player-${index} ${amountOfPlayersClass}`} 
      ref={mainWrapperRef}
    >
      <div className="name">
        <div className="name-value">
          {name}
        </div>
        <img 
          src={questionMark} 
          className="indicator" 
          ref={element => assignIndicatorRefToCollection(element, index)}
        />
      </div>
      <div
        ref={cardContainerRef}
        className="cards"
      >
        <div 
          ref={cardsGridRef}
          className="cards-grid"
        >
          {cards.map((card, cardIndex) => {
            let containerX = 0;
            let containerY = 0;
            if (cardContainerRef.current) {
              const position = cardContainerRef.current.getBoundingClientRect();
              containerX = position.left;
              containerY = position.top;
            }
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
              cardPositions={cardPositions}
              width={DESKTOP_CARD_WIDTH * DESKTOP_CARD_SCALE}
              height={DESKTOP_CARD_HEIGHT * DESKTOP_CARD_SCALE}
              originPoint={adjustedOriginPoint}
              delay={delay}
              receiveAnimationStatus={card.receiveAnimationStatus}
              playerIndex={realIndex}
              cardIndex={cardIndex}
              fourPlayers={fourPlayers}
            />
          })}
        </div>
      </div>
    </div>
  )
}

export default Hand;

