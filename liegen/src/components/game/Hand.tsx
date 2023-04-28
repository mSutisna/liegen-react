import { HandProps } from '../../types/props';
import { BaseCardInterface, CardUrls, PlayerInterface, CardPosition, CardForPlayerInterface } from '../../types/models';
import { determinePositionCoordinates } from '../../utilities/player-position-determination';
import { DESKTOP_HAND_WIDTH, DESKTOP_HAND_HEIGHT, DESKTOP_CARD_WIDTH, DESKTOP_CARD_HEIGHT, DESKTOP_CARD_SCALE, GridOrientation, GridItemType, PlayerOrientations } from '../../constants';
import React, { useRef, useLayoutEffect, useEffect, useState, ReactNode } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { RootState } from '../../store';
import Card from './Card';
import { setPlayerCenterCoordinates } from "../../slices/gameSlice";
import questionMark from '../../assets/icons/question-mark.svg';
import { determineGridPositionsForCards } from '../../utilities/card-position-determination';
import { createCardCollectionToRender } from '../../utilities/card-helper-functions';

function Hand({name, index, realIndex, amountOfPlayers, gameWidth, gameHeight, cards, assignIndicatorRefToCollection}: HandProps) {
  const cardUrls: CardUrls  = useSelector(
    (state: RootState) => {
      return state.game.cardUrls;
    }
  );

  const dispatch = useDispatch();

  const [cardDimensions, setCardDimensions] = useState<{
    width: number,
    height: number,
  }>({
    width: 0,
    height: 0,
  })
  const currentPlayerIndex: (number) = useSelector(
    (state: RootState) => {
      return state.game.currentPlayerIndex;
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
  
  const cardContainerRef = useRef<HTMLDivElement>(null);

  const cardsAmount = cards.length <= 15
    ? cards.length
    : 15; 

  const columnSize = cardsAmount <= 5
    ? cardsAmount
    : 5;
  const rowSize = Math.ceil(cardsAmount / 5);

  let cardPositions : Array<CardPosition> = determineCardPositions(amountOfPlayers, index, rowSize, columnSize);

  let cardsGridClasses = 'cards-grid';
  const negativeMarginClass = determineCardGridNegativeMarginClass(amountOfPlayers, index, rowSize);
  if (negativeMarginClass) {
    cardsGridClasses += ` ${negativeMarginClass}`;
  }

  const renderCard = (card: CardForPlayerInterface, index: number, indicateAmount: number | null): ReactNode => {
    const delay = 0.02 + (0.06 * index);  
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
    return <Card
      key={`cardIndex-${index}`}
      url={cardUrls['Backside']}
      cardPositions={cardPositions}
      width={DESKTOP_CARD_WIDTH * DESKTOP_CARD_SCALE}
      height={DESKTOP_CARD_HEIGHT * DESKTOP_CARD_SCALE}
      originPoint={adjustedOriginPoint}
      delay={delay}
      receiveAnimationStatus={card.receiveAnimationStatus}
      playerIndex={realIndex}
      cardIndex={index}
      fourPlayers={fourPlayers}
      indicateAmount={indicateAmount}
    />
  }

  const cardsToRender = createCardCollectionToRender(
    cards, 
    renderCard
  );

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
          className={cardsGridClasses}
        >
          {cardsToRender}
        </div>
      </div>
    </div>
  )
}


const determineCardGridNegativeMarginClass = (amountOfPlayers: number, playerIndex: number, rows: number) : string => {
  let negativeMarginClass = '';
  if (amountOfPlayers === 2) {
    negativeMarginClass = determineNegativeMarginClassForOrientation(PlayerOrientations.TOP, rows);
  } else if (amountOfPlayers === 3) {
    negativeMarginClass = determineNegativeMarginClassForOrientation(PlayerOrientations.TOP, rows);
  } else if (amountOfPlayers === 4) {
    if ([1, 3].includes(playerIndex)) {
      negativeMarginClass = determineNegativeMarginClassForOrientation(PlayerOrientations.LEFT, rows);
    } else {
      negativeMarginClass = determineNegativeMarginClassForOrientation(PlayerOrientations.TOP, rows);
    }
  }
  return negativeMarginClass;
}

const determineNegativeMarginClassForOrientation = (orientation: PlayerOrientations, rows: number) : string => {
  let negativeMarginClass = '';
  if (orientation === PlayerOrientations.TOP) {
    if (rows === 2) {
      negativeMarginClass = 'one-extra-row'
    } else if (rows === 3) {
      negativeMarginClass = 'two-extra-rows'
    } else if (rows === 4) {
      negativeMarginClass = 'three-extra-rows'
    } else if (rows === 5) {
      negativeMarginClass = 'four-extra-rows'
    }
  } else {
    if (rows === 3) {
      negativeMarginClass = 'one-extra-row'
    } else if (rows === 4) {
      negativeMarginClass = 'two-extra-rows'
    } else if (rows === 5) {
      negativeMarginClass = 'three-extra-rows'
    }
  }
  return negativeMarginClass;
}

const determineCardPositions = (amountOfPlayers: number, playerIndex: number, rowSize: number, columnSize: number) : Array<CardPosition> => {
  let cardPositions : Array<CardPosition> = [];
  if (amountOfPlayers === 2 || amountOfPlayers === 3) {
      cardPositions = determineGridPositionsForCards(
        rowSize,
        columnSize, 
        GridOrientation.REVERSE, 
        GridOrientation.REVERSE, 
        GridItemType.ROW
      );
  } else if (amountOfPlayers === 4) {
    if (playerIndex === 1) {
      cardPositions = determineGridPositionsForCards(
        rowSize,
        columnSize, 
        GridOrientation.REGULAR, 
        GridOrientation.REVERSE, 
        GridItemType.COLUMN
      );
    } else if (playerIndex === 2) {
      cardPositions = determineGridPositionsForCards(
        rowSize,
        columnSize, 
        GridOrientation.REVERSE, 
        GridOrientation.REVERSE, 
        GridItemType.ROW
      );
    } else if (playerIndex === 3) {
      cardPositions = determineGridPositionsForCards(
        rowSize,
        columnSize, 
        GridOrientation.REVERSE, 
        GridOrientation.REGULAR, 
        GridItemType.COLUMN
      );
    }
  }
  return cardPositions;
}

export default Hand;

