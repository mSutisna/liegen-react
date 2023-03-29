import { HandProps } from '../types/props';
import { AnimationStatus, CardUrls, MiddleInterface, PlayerInterface } from '../types/models';
import { determinePositionCoordinates } from '../utilities/player-position-determination';
import { DESKTOP_PRIMARY_HAND_WIDTH, DESKTOP_PRIMARY_HAND_HEIGHT, DESKTOP_CARD_WIDTH, DESKTOP_CARD_HEIGHT, SUITS, RANKS, DESKTOP_CARD_SCALE } from '../constants';
import { createCardName } from '../utilities/card-helper-functions';
import CardPrimary from '../components/CardPrimary';
import { useEffect, useRef } from 'react';
import { determineXandYForCard } from '../utilities/card-position-determination';
import { useDispatch, useSelector } from "react-redux";
import {
  increaseRank,
  decreaseRank,
  makeSet,
  callBust,
  setPlayerCenterCoordinates,
  displayNewMessage,
} from "../slices/gameSlice";
import { RootState } from '../store';

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

  const mainContainerRef = useRef<HTMLDivElement>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);
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
    DESKTOP_PRIMARY_HAND_WIDTH,
    DESKTOP_PRIMARY_HAND_HEIGHT
  )
  const style = {
    ...position,
    width: DESKTOP_PRIMARY_HAND_WIDTH,
    height: DESKTOP_PRIMARY_HAND_HEIGHT
  }

  return (
    <div className={`primary-hand player-${index}`} style={style} ref={mainContainerRef}>
      <div className="name">
        <div className="name-value">
          {name}
        </div>
        <img 
          src=""
          ref={element => assignIndicatorRefToCollection(element, index)}
          className="indicator" 
        />
      </div>
      <div className="controls-wrapper">
        <div className="bust">
          <button
            onClick={async e => {
              e.stopPropagation();
              console.log({bustAnimation: middle.bustAnimationStatus})
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
          <div className="cards-grid">
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
              const offsetData = determineXandYForCard(cards, cardIndex, DESKTOP_CARD_SCALE);
              const left = offsetData.x;
              const top = offsetData.y;
              const delay = 0.02 + (0.06 * cardIndex);

              return <CardPrimary
                key={`cardIndex-${cardIndex}`}
                url={cardUrls[cardKey]}
                width={DESKTOP_CARD_WIDTH * DESKTOP_CARD_SCALE}
                height={DESKTOP_CARD_HEIGHT * DESKTOP_CARD_SCALE}
                startLeft={-containerX - left}
                startTop={-containerY - top}
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
              if (middle.setAnimationStatus !== AnimationStatus.IDLE || middle.bustAnimationStatus == AnimationStatus.RUNNING) {
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