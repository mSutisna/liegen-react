import { useRef, useEffect, useLayoutEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ReactDOM from "react-dom";
import {
  setVisibilityMessageModal
} from "../../slices/gameSlice";
import {
  increaseRank,
  decreaseRank,
  makeSet,
  displayNewMessage,
} from "../../slices/gameSlice";
import {
  SUITS,
  RANKS, 
} from '../../constants';
import React from "react";
import { AnimationStatus, CardUrls, MiddleInterface, PlayerInterface } from "../../types/models";
import { RootState } from "../../store";
import { makeSetLogic } from "./PrimaryHand";
import { createCardName } from '../../utilities/card-helper-functions';
import CardPrimary from "./CardPrimary";

const AllCardsModal = ({
  allCardsVisible, 
  closeExecution,
  players,
  currentPlayerIndex,
  mainPlayerIndex,
  middle
}: {
  allCardsVisible: boolean, 
  closeExecution: (type: string) => void, 
  players: Array<PlayerInterface>,
  currentPlayerIndex: number,
  mainPlayerIndex: number,
  middle: MiddleInterface
}) => {
  const cardUrls: CardUrls  = useSelector(
    (state: RootState) => {
      return state.game.cardUrls;
    }
  );
  const modalRef = useRef<HTMLDivElement>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const cardsGridRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const closeFunction = () => {
    closeExecution('allCardsModal');
  }
  const playerData = players[mainPlayerIndex];
  useEffect(() => {
    const listenToClicks = (e: MouseEvent) => {
      const target = e.target as Node;
      if (modalRef.current && !modalRef.current.contains(target)) {
        closeFunction();
      }
    }
    document.addEventListener('click', listenToClicks);
    return () => {
      document.removeEventListener('click', listenToClicks);
    }
  }, []);

  useLayoutEffect(() => {
    if (!cardsGridRef.current || !playerData?.cards) {
      return;
    }
    const columns = playerData.cards.length <= 5
      ? playerData.cards.length
      : 5;
    cardsGridRef.current.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
  }, [playerData?.cards?.length, allCardsVisible])

  const body = <div className="all-cards-body">
    <div className="bottom">
      <div className="cards-section">
        <div ref={cardsGridRef} className="cards-grid"> 
          {playerData?.cards?.map?.((card, index) => {
            const cardKey = createCardName(SUITS[card.suitIndex ?? -1] ?? '', RANKS[card.rankIndex ?? -1] ?? '')
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
              adjustedOriginPoint = {x: 0, y: 0};
              adjustedOriginPoint.x = -containerX - card.originPoint.x;
              adjustedOriginPoint.y = -containerY - card.originPoint.y;
            }
            const delay = 0.02 + (0.06 * index);
            return <CardPrimary
              key={`cardIndex-${index}`}
              url={cardUrls[cardKey]}
              onClick={null}
              originPoint={adjustedOriginPoint}
              delay={delay}
              rank={RANKS[card.rankIndex ?? -1]}
              suit={SUITS[card.suitIndex ?? -1]}
              selected={card.selected}
              faceDown={card.faceDown}
              playerIndex={mainPlayerIndex}
              cardIndex={index}
              receiveAnimationStatus={card.receiveAnimationStatus}
              indicateAmount={null}
            />
          })}
        </div>
      </div>
      <div className="controls-section">
        <div className="control-section-inner">
          <div className="rank-control-wrapper"> 
            <button className="triangle-buttons" onClick={() => dispatch(increaseRank())}>
                <div className="triangle-buttons__triangle triangle-buttons__triangle--t"></div>
            </button>
            <div className="rank">{RANKS[playerData?.selectedRank]}</div>
            <button className="triangle-buttons" onClick={() => dispatch(decreaseRank())}>
                <div className="triangle-buttons__triangle triangle-buttons__triangle--b"></div>
            </button>
          </div>
          <button
            onClick={e => {
              e.stopPropagation();
              makeSetLogic(middle, players, mainPlayerIndex, currentPlayerIndex, dispatch);
            }}
          >
            Make set
          </button>
        </div>
      </div>
    </div>
  </div>

  return allCardsVisible ? ReactDOM.createPortal(
    <React.Fragment>
      <div className="modal-container all-cards-modal three">
        <div className="modal-background">
          <div className="modal" ref={modalRef}>
            {body}
            <span id="modal-close-button" onClick={closeFunction}>&times;</span>
          </div>
        </div>
      </div>
    </React.Fragment>,
    document.body
  ) : null;
}

export default AllCardsModal;
