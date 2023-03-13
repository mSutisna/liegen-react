import { useSelector } from "react-redux";
import { RootState } from '../store';
import { BaseCardInterface, MiddleInterface, PlayerInterface } from "../types/models";
import { createCardName } from "../utilities/card-helper-functions";
import { useState, useEffect, useRef } from "react";
import { getImageUrls } from "../utilities/image-store/image-urls";
import CardMiddle from "./CardMiddle";
import { DESKTOP_CARD_HEIGHT, DESKTOP_CARD_WIDTH, DESKTOP_CARD_SCALE, DESKTOP_GAME_WIDTH, DESKTOP_GAME_HEIGHT, DESKTOP_PRIMARY_HAND_HEIGHT, DESKTOP_PRIMARY_HAND_WIDTH, DESKTOP_HAND_WIDTH, DESKTOP_HAND_HEIGHT } from "../constants";
import { determineXandYForCard } from "../utilities/card-position-determination";
import { LayoutGroup } from "framer-motion"

interface MiddleProps {
  width: number,
  height: number,
  left: number,
  top: number
}

function Middle({width, height, left, top} : MiddleProps) {
  const [cardUrls, setCardUrls] = useState<{[k: string]: string}>({});
  useEffect(() => {
    const setImageUrls = async () => {
      const imageUrls = await getImageUrls();
      setCardUrls(imageUrls);
    }
    setImageUrls();
  }, []);

  const middle: MiddleInterface = useSelector(
    (state: RootState) => {
      return state.game.middle;
    }
  );
  const players: Array<PlayerInterface> = useSelector(
    (state: RootState) => {
      return state.game.players;
    }
  );

  const mainContainerRef = useRef<HTMLDivElement>(null);
  const supposedCardsContainerRef = useRef<HTMLDivElement>(null);
  const realCardsContainerRef = useRef<HTMLDivElement>(null);

  const getTopAndLeftForContainer = (element: HTMLDivElement | null) => {
    let elementLeft = 0;
    let elementTop = 0;
    if (element) {
      const position = element.getBoundingClientRect();
      elementLeft = position.left;
      elementTop = position.top;
    }
    return [
      elementLeft,
      elementTop
    ]
  }


  const determineKeyFramesForCard = (
    type: string, 
    mainContainer: HTMLDivElement | null,
    supposedCardsContainer: HTMLDivElement | null,
    realCardsContainer: HTMLDivElement | null,
    cards: Array<BaseCardInterface>,
    index: number,
    playerX: number,
    playerY: number
  ): {
    xKeyFrames: Array<number>,
    yKeyFrames: Array<number>,
    endX: number,
    endY: number,
    delay: number
  } => {

    const [mainLeft, mainTop] = getTopAndLeftForContainer(mainContainer);
    const [supposedCardsLeft, supposedCardsTop] = getTopAndLeftForContainer(supposedCardsContainer)
    const [realCardsLeft, realCardsTop] = getTopAndLeftForContainer(realCardsContainer);

    const supposedCardsX = supposedCardsLeft - mainLeft;
    const supposedCardsY = supposedCardsTop - mainTop;

    const realCardsX = realCardsLeft - mainLeft;
    const realCardsY = realCardsTop - mainTop;

  
    const offsetData = determineXandYForCard(cards, index, DESKTOP_CARD_SCALE);
    const delay = type === 'supposedCards' ? 0.5 : 0;
    const originX = - mainLeft + playerX;
    const originY = - mainTop + playerY;
    let xKeyFrames = [originX];
    let yKeyFrames = [originY];
    let otherKeyFramesX;
    let otherKeyFramesY;
    let endX;
    let endY;
    if (type === 'supposedCards') {
      otherKeyFramesX = [0];
      otherKeyFramesY = [0];
      endX = supposedCardsX + offsetData.x;
      endY = supposedCardsY + offsetData.y;
    } else {
      otherKeyFramesX = [supposedCardsX + offsetData.x, 0];
      otherKeyFramesY = [supposedCardsY + offsetData.y, 0];
      endX = realCardsX + offsetData.x;
      endY = realCardsY + offsetData.x;
    }
    return {
      xKeyFrames: [...xKeyFrames, ...otherKeyFramesX],
      yKeyFrames: [...yKeyFrames, ...otherKeyFramesY],
      endX,
      endY, 
      delay
    };
  }

  let supposedCards : Array<JSX.Element | null> = [];
  let realCards : Array<JSX.Element | null> = [];
  const middleSet = middle.set;

  if (middleSet) {
    const playerX = players[middleSet.playerIndex].xPoint;
    const playerY = players[middleSet.playerIndex].yPoint;
    supposedCards = middleSet.supposedCards.map((card, index) => {
      const cardKey = createCardName(card.suit ?? '', card.rank ?? '')
      if (!cardUrls[cardKey]) {
        return null;
      }
      const {
        xKeyFrames,
        yKeyFrames,
        endX,
        endY,
        delay
      } = determineKeyFramesForCard(
        'supposedCards',
        mainContainerRef.current,
        supposedCardsContainerRef.current,
        realCardsContainerRef.current,
        middleSet.supposedCards,
        index,
        playerX,
        playerY
      )
      return <CardMiddle
        key={`supposedCard-${index}`}
        url={!card.faceDown ? cardUrls[cardKey] : cardUrls['Backside']}
        width={DESKTOP_CARD_WIDTH * DESKTOP_CARD_SCALE}
        height={DESKTOP_CARD_HEIGHT * DESKTOP_CARD_SCALE}
        left={endX}
        top={endY}
        xKeyFrames={xKeyFrames}
        yKeyFrames={yKeyFrames}
        rank={card.rank}
        suit={card.suit}
        faceDown={card.faceDown}
        delay={0}
      />
    })

    realCards = middleSet.realCards.map((card, index) => {
      const cardKey = createCardName(card.suit ?? '', card.rank ?? '')
      if (!cardUrls[cardKey]) {
        return null;
      }
      const {
        xKeyFrames,
        yKeyFrames,
        endX,
        endY,
        delay
      } = determineKeyFramesForCard(
        'realCards',
        mainContainerRef.current,
        supposedCardsContainerRef.current,
        realCardsContainerRef.current,
        middleSet.supposedCards,
        index,
        playerX,
        playerY
      )
      return <CardMiddle
        key={`realCard-${index}`}
        url={!card.faceDown ? cardUrls[cardKey] : cardUrls['Backside']}
        width={DESKTOP_CARD_WIDTH * DESKTOP_CARD_SCALE}
        height={DESKTOP_CARD_HEIGHT * DESKTOP_CARD_SCALE}
        left={endX}
        top={endY}
        xKeyFrames={xKeyFrames}
        yKeyFrames={yKeyFrames}
        rank={card.rank}
        suit={card.suit}
        faceDown={card.faceDown}
        delay={0}
      />
    })
  }

  return (
    <div 
      className="middle"
      style={{
        width,
        height,
        left,
        top
      }}
    >
      <div className="card-count">
        Cards: {middle.previousCards.length}
      </div>
      <div className="middle-cards" ref={mainContainerRef}>
        {/* <LayoutGroup> */}
          <div key="topkek1" className="supposed-cards" ref={supposedCardsContainerRef}>
            {supposedCards}
          </div>
          <div key="topkek2" className="real-cards" ref={realCardsContainerRef}>
            {realCards}
          </div>
        {/* </LayoutGroup> */}
      </div>
    </div>
  )
}

export default Middle;