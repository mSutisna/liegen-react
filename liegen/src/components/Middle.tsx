import { useSelector } from "react-redux";
import { RootState } from '../store';
import { BaseCardInterface, MiddleInterface, PlayerInterface } from "../types/models";
import { createCardName } from "../utilities/card-helper-functions";
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { getImageUrls } from "../utilities/image-store/image-urls";
import CardCombinationMiddle from "./CardCombinationMiddle";
import { Point, AnimationChain } from '../types/models'
import { DESKTOP_CARD_HEIGHT, DESKTOP_CARD_WIDTH, DESKTOP_CARD_SCALE } from "../constants";

interface MiddleProps {
  width: number,
  height: number,
  left: number,
  top: number
}

function Middle({width, height, left, top} : MiddleProps) {  
  const [cardUrls, setCardUrls] = useState<{[k: string]: string}>({});
  // useEffect(() => {
  //   const setImageUrls = async () => {
  //     const imageUrls = await getImageUrls();
  //     setCardUrls(imageUrls);
  //   }
  //   setImageUrls();
  // }, []);
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

  const cardWidth = DESKTOP_CARD_WIDTH * DESKTOP_CARD_SCALE;
  const cardHeight = DESKTOP_CARD_HEIGHT * DESKTOP_CARD_SCALE;

  let cardsToDisplay : Array<JSX.Element | null> = [];
  const middleSet = middle.set;

  const refCollection = useRef<Array<{
    supposedCardRef: HTMLElement | null,
    realCardRef: HTMLElement | null
  }>>([])

  console.log({refCollectionInRender: refCollection})

  // let refs = [];
  // if (middleSet) {
  //   console.log('super weird...')
  //   for (let i = 0; i < middleSet.amount; i++) {
  //     refs.push({
  //       supposedCardRef: React.createRef<HTMLImageElement>(),
  //       realCardRef: React.createRef<HTMLImageElement>()
  //     })
  //   }
  // }

  // console.log({refs})

  // const refCollection = useRef<Array<{
  //   supposedCardRef: React.RefObject<HTMLImageElement>
  //   realCardRef: React.RefObject<HTMLImageElement>
  // }>>(refs);

  useLayoutEffect(() => {
    console.log(refCollection);
    const setImageUrls = async () => {
      const imageUrls = await getImageUrls();
      setCardUrls(imageUrls);
    }
    setImageUrls();

    if (!middleSet) {
      return;
    }

    let animationChains = [];

    for (const cardsRef of refCollection.current) {
      const supposedCard = cardsRef?.supposedCardRef;
      const realCard = cardsRef?.realCardRef;
      const supposedCardRect = supposedCard?.getBoundingClientRect();
      const originPlayer = players[middleSet.playerIndex];
      const originX = originPlayer.xPoint;
      const originY = originPlayer.yPoint;
        
      const startX = (originX - (cardWidth / 2)) - (supposedCardRect?.left ?? 0);
      const startY = (originY - (cardHeight / 2)) - (supposedCardRect?.top ?? 0);

      let animationChain : Array<AnimationChain> = []

      animationChain.push({
        element: supposedCard,
        startPoint: {x: startX, y: startY},
        endPoint: {x: 0, y: 0}
      })

      const realCardRect = realCard?.getBoundingClientRect();

      const secondStartY = (supposedCardRect?.top ?? 0) - (realCardRect?.top ?? 0);
      const secondStartX = (supposedCardRect?.left ?? 0) - (realCardRect?.left ?? 0);

      animationChain.push({
        element: realCard,
        startPoint: {x: secondStartX, y: secondStartY},
        endPoint: {x: 0, y: 0}
      })

      animationChains.push(animationChain);      
    }

    const playAnimation = async ({element, startPoint, endPoint} : AnimationChain) => {
      if (!element) {
        return;
      }
      const animations = [
          { transform: `translate(${startPoint.x}px, ${startPoint.y}px)` },
          { transform: `translate(${endPoint.x}px, ${endPoint.y}px)` },
        ];
        const animationSettings = {
          duration: 500,
          iterations: 1,
        };
        
        const animationObject = element.animate(animations, animationSettings);
        return animationObject.finished;
    }
  
    const playAnimations = async (animationChain: AnimationChain[]) => {
      console.log('play animations')
      for (const animationData of animationChain) {
        console.log({animationData})
        if (!animationData.element) {
          break;
        }
        animationData.element.style.visibility = 'visible';
        await playAnimation({
          element: animationData.element, 
          startPoint: animationData.startPoint, 
          endPoint: animationData.endPoint
        });
      }
    }

    console.log('before play animations', animationChains)

    for (const animationChain of animationChains) {
      playAnimations(animationChain)
    }

  }, [middle])


  if (middleSet) {
    const supposedCards = middleSet.supposedCards;
    const realCards = middleSet.realCards;
    for (let i = 0; i < supposedCards.length; i++) {
      const supposedCard = supposedCards[i];
      const realCard = realCards[i];
      const supposedCardKey = !supposedCard.faceDown ? createCardName(supposedCard.suit ?? '', supposedCard.rank ?? '') : 'Backside';
      const realCardKey = !realCard.faceDown ? createCardName(realCard.suit ?? '', realCard.rank ?? '') : 'Backside';
      cardsToDisplay.push(<div key={`middle-cards-container-${i}`} className="middle-cards-container">
        <img 
          ref={el => {
            let refMiddleCardPair = refCollection.current[i]
            if (!refMiddleCardPair) {
              refMiddleCardPair = {
                realCardRef: null,
                supposedCardRef: null
              };
            }
            refMiddleCardPair.supposedCardRef = el 
            refCollection.current[i] = refMiddleCardPair;
          }}
          src={cardUrls[supposedCardKey]} 
          className="card"
          style={{
            width: cardWidth,
            height: cardHeight
          }}
        />
        <img
          ref={el => {
            let refMiddleCardPair = refCollection.current[i]
            if (!refMiddleCardPair) {
              refMiddleCardPair = {
                realCardRef: null,
                supposedCardRef: null
              };
            }
            refMiddleCardPair.realCardRef = el 
            refCollection.current[i] = refMiddleCardPair;
          }}
          src={cardUrls[realCardKey]} 
          className="card"
          style={{
            width: cardWidth,
            height: cardHeight
          }}
        />
      </div>)
      // cardsToDisplay.push(<CardCombinationMiddle
      //   key={`cardCombination-${i}`}
      //   supposedCardUrl={cardUrls[supposedCardKey]}
      //   realCardUrl={cardUrls[realCardKey]}
      //   cardsWidth={cardWidth}
      //   cardsHeight={cardHeight}
      //   refs={refs}
      // />)
    }
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
      <div className="middle-cards">
        {cardsToDisplay}
      </div>
    </div>
  )
}

export default Middle;