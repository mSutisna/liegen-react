import { HandProps } from '../types/props';
import { AnimationStatus, BaseCardInterface, CardUrls, MiddleInterface, PlayerInterface } from '../types/models';
import {
  DESKTOP_CARD_WIDTH, 
  DESKTOP_CARD_HEIGHT, 
  SUITS, 
  RANKS, 
  DESKTOP_CARD_SCALE 
} from '../constants';
import { createCardName } from '../utilities/card-helper-functions';
import CardPrimary from '../components/CardPrimary';
import { useRef, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import {
  setPlayerCenterCoordinates,
  increaseRank,
  decreaseRank,
  makeSet,
  callBust,
  displayNewMessage,
} from "../slices/gameSlice";
import { RootState } from '../store';
import questionMark from '../assets/icons/question-mark.svg';

function PrimaryHand({name, index, realIndex, amountOfPlayers, gameWidth, gameHeight, cards, selectedRank, assignIndicatorRefToCollection} : HandProps) {
  const cardUrls: CardUrls  = useSelector(
    (state: RootState) => {
      return state.game.cardUrls;
    }
  );
  const middle: MiddleInterface = useSelector(
    (state: RootState) => {
      return state.game.middle;
    }
  );
  const currentPlayerIndex: (number) = useSelector(
    (state: RootState) => {
      return state.game.currentPlayerIndex;
    }
  );
  const players: (Array<PlayerInterface> | null) = useSelector(
    (state: RootState) => {
      return state.game.players;
    }
  );
  const playerCards: (Array<BaseCardInterface> | null) = useSelector(
    (state: RootState) => {
      return state.game.players[realIndex]?.cards ?? null;
    }
  );
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const mainWrapperRef = useRef<HTMLDivElement>(null);
  const cardsGridRef = useRef<HTMLDivElement>(null);
  const mainWrapperWidthAndHeight = useRef<{
    width: number | null,
    height: number | null
  }>({
    width: null,
    height: null
  });
  const [screenSize, setScreenSize] = useState<{
    width: number,
    height: number,
  }>({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  useLayoutEffect(() => {
    if (!mainWrapperRef.current || !mainWrapperWidthAndHeight.current || !cardsGridRef.current) {
      return;
    }
    const columns = playerCards.length <= 5
      ? playerCards.length
      : 5;
    cardsGridRef.current.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    const handleWindowResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
    window.addEventListener('resize', handleWindowResize);
    const position = mainWrapperRef.current.getBoundingClientRect();
    const mainX = position.left + (position.width / 2);
    const mainY = position.top + (position.height / 2);
    dispatch(setPlayerCenterCoordinates({playerIndex: realIndex, x: mainX, y: mainY}))
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    }
  }, [currentPlayerIndex, screenSize.width, screenSize.height]);

  const dispatch = useDispatch();

  return (
    <div 
      className={`primary-hand player-${index}`}
      ref={mainWrapperRef}
    >
      <div className="name">
        <div className="name-value">
          {name}
        </div>
        <img 
          src={questionMark}
          ref={element => assignIndicatorRefToCollection(element, index)}
          className="indicator" 
        />
      </div>
      <div className="controls-wrapper">
        <div className="bust">
          <button
            onClick={async e => {
              e.stopPropagation();
              if (middle.bustAnimationStatus !== AnimationStatus.IDLE || middle.setAnimationStatus == AnimationStatus.RUNNING) {
                return;
              }
              if (!middle.set) {
                displayNewMessage(dispatch, 'You can\'t call bust because there is no set in the middle.');
                return;
              }
              if (middle.set.playerIndex === realIndex) {
                displayNewMessage(dispatch, 'You can\'t call bust on your own set.');
                return;
              }
              dispatch(callBust())
            }}
          >
            Bust
          </button>
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
              const cardKey = createCardName(SUITS[card.suitIndex] ?? '', RANKS[card.rankIndex] ?? '')
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
              let adjustedOriginPoint = null;
              if (card.originPoint) {
                adjustedOriginPoint = {...card.originPoint};
                adjustedOriginPoint.x = -containerX - card.originPoint.x;
                adjustedOriginPoint.y = -containerY - card.originPoint.y;
              }
              const delay = 0.02 + (0.06 * cardIndex);
              return <CardPrimary
                key={`cardIndex-${cardIndex}`}
                url={cardUrls[cardKey]}
                width={DESKTOP_CARD_WIDTH * DESKTOP_CARD_SCALE}
                height={DESKTOP_CARD_HEIGHT * DESKTOP_CARD_SCALE}
                originPoint={adjustedOriginPoint}
                delay={delay}
                rank={RANKS[card.rankIndex]}
                suit={SUITS[card.suitIndex]}
                selected={card.selected}
                faceDown={card.faceDown}
                playerIndex={realIndex}
                cardIndex={cardIndex}
                receiveAnimationStatus={card.receiveAnimationStatus}
              />
            })}
          </div>
        </div>
        <div className="make-set">
          <div className="rank-control-wrapper"> 
            <button className="triangle-buttons" onClick={() => dispatch(increaseRank())}>
                <div className="triangle-buttons__triangle triangle-buttons__triangle--t"></div>
            </button>
            <div className="rank">{RANKS[selectedRank]}</div>
            <button className="triangle-buttons" onClick={() => dispatch(decreaseRank())}>
                <div className="triangle-buttons__triangle triangle-buttons__triangle--b"></div>
            </button>
          </div>
          <button
            onClick={e => {
              e.stopPropagation();
              if (middle.setAnimationStatus === AnimationStatus.RUNNING || middle.bustAnimationStatus === AnimationStatus.RUNNING) {
                return;
              }
              const player = players[realIndex];
              if (currentPlayerIndex !== realIndex) {
                displayNewMessage(dispatch, 'You can\'t make a set because it is not your turn.');
                return;
              }
              for (const player of players) {
                if (player.cards.length === 0) {
                  displayNewMessage(dispatch, `Player '${player.name}' has no more cards left. Someone must call bust on ${player.name}'s set!`);
                  return;
                }
              }
              if (!player || player.cards.filter(card => card.selected).length === 0) {
                displayNewMessage(dispatch, 'You must select at least one card to make a set.');
                return;
              }
              if (middle.set) {
                const belowRank = (middle.set.rank - 1) >= 0 
                  ? middle.set.rank - 1
                  : RANKS.length - 1;
                const aboveRank = (middle.set.rank + 1) <= (RANKS.length - 1)
                  ? middle.set.rank + 1
                  : 0;
  
                const validRankIndexes = [
                  belowRank,
                  middle.set.rank,
                  aboveRank
                ];

                const rankLabels = validRankIndexes.map(index => {
                  return RANKS[index];
                })

                if (!validRankIndexes.includes(player.selectedRank)) {
                  displayNewMessage(dispatch, `You can only select one of the following ranks '${rankLabels.join(', ')}' because the rank of the current set is '${RANKS[middle.set.rank]}'.`);
                  return;
                }
              }
              dispatch(makeSet())
            }}
          >
            Make set
          </button>
        </div>
      </div>
    </div>
  )
}

export default PrimaryHand;