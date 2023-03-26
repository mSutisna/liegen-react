import { useSelector, useDispatch } from "react-redux";
import { Dispatch } from 'react'; 
import { RootState } from '../store';
import { MiddleInterface, PlayerInterface, SetInterface } from "../types/models";
import { createCardName } from "../utilities/card-helper-functions";
import { useState, useRef, useLayoutEffect } from "react";
import { getImageUrls } from "../utilities/image-store/image-urls";
import CardCombinationMiddle from "./CardCombinationMiddle";
import { Point, AnimationChain } from '../types/models'
import { DESKTOP_CARD_HEIGHT, DESKTOP_CARD_WIDTH, DESKTOP_CARD_SCALE } from "../constants";
import { playAnimationChains } from "../utilities/animation/play-animation";
import { setSetAnimationFinished } from "../slices/gameSlice";

interface MiddleProps {
  width: number,
  height: number,
  left: number,
  top: number
}

interface cardsRefInterface {
  supposedCardRef: HTMLElement | null,
  realCardRef: HTMLElement | null
}

interface refCollectionInterface {
  newSet: Array<cardsRefInterface>,
  previousSet: Array<cardsRefInterface>
}

function Middle({width, height, left, top} : MiddleProps) {  
  const [cardUrls, setCardUrls] = useState<{[k: string]: string}>({});
  const dispatch = useDispatch();
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
  const previousMiddleSet = middle.previousSet;

  const refCollection = useRef<refCollectionInterface>({
    newSet: [],
    previousSet: []
  })

  const refCardsBurned = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const setImageUrls = async () => {
      const imageUrls = await getImageUrls();
      setCardUrls(imageUrls);
    }
    setImageUrls();

    if (!middleSet || middleSet.animationFinished) {
      return;
    }

    const playAnimation = async () => {
      const newSetRefs = refCollection.current.newSet;
      const previousSetRefs = refCollection.current.previousSet;
      if (previousSetRefs.length === 0) {
        await playAnimationOnlyNewSet(
          newSetRefs, 
          players, 
          middleSet, 
          cardWidth, 
          cardHeight
        )
      } else {
        const newSetData = {
          newSetCardRefs: newSetRefs, 
          players, 
          middleSet,
        };
        await playAnimationPreviousSetAndNewSet(
          previousSetRefs,
          refCardsBurned.current,
          cardWidth, 
          cardHeight,
          newSetData
        )
      }
      dispatch(setSetAnimationFinished());
    }
    playAnimation();
  }, [middle])


  if (middleSet) {
    const supposedCards = middleSet.supposedCards;
    const realCards = middleSet.realCards;

    const createCardElement = (refCollectionType: string, type: string, url: string, index: number, visibilityHideType = 'visibility')  => {
      const style : {[k: string]: string | number} = {
        width: cardWidth,
        height: cardHeight,
      }
      if (visibilityHideType === 'visibility')  {
        style.visibility = 'hidden';
      } else if (visibilityHideType === 'display') {
        style.display = 'none';
      }
      const refCollectionData = refCollection.current;
      const refCollectionDataChosen = refCollectionType === 'newSet' 
        ? refCollectionData.newSet
        : refCollectionData.previousSet;
      return <img 
        ref={el => {
          let refMiddleCardPair = refCollectionDataChosen[index]
          if (!refMiddleCardPair) {
            refMiddleCardPair = {
              realCardRef: null,
              supposedCardRef: null
            };
          }
          if (type === 'supposedCard') {
            refMiddleCardPair.supposedCardRef = el 
          } else {
            refMiddleCardPair.realCardRef = el
          }
          refCollectionDataChosen[index] = refMiddleCardPair;
        }}
        src={url} 
        className="card"
        style={style}
      />
    }
    for (let i = 0; i < supposedCards.length; i++) {
      const supposedCard = supposedCards[i];
      const realCard = realCards[i];
      const supposedCardKey = !supposedCard.faceDown ? createCardName(supposedCard.suit ?? '', supposedCard.rank ?? '') : 'Backside';
      const realCardKey = !realCard.faceDown ? createCardName(realCard.suit ?? '', realCard.rank ?? '') : 'Backside';
      cardsToDisplay.push(<div key={`middle-cards-container-new-${i}-${middleSet.playerIndex}`} className="middle-cards-container">
        {createCardElement('newSet', 'supposedCard', cardUrls[supposedCardKey], i, previousMiddleSet ? 'display' : 'visibility')}
        {createCardElement('newSet', 'realCard', cardUrls[realCardKey], i, previousMiddleSet ? 'display' : 'visibility')}
      </div>)
    }
    if (previousMiddleSet) {
      const previousSupposedCards = previousMiddleSet.supposedCards;
      const previousMiddleCards = previousMiddleSet.realCards;
      for (let i = 0; i < previousSupposedCards.length; i++) {
        const supposedCard = previousSupposedCards[i];
        const realCard = previousMiddleCards[i];
        const supposedCardKey = !supposedCard.faceDown ? createCardName(supposedCard.suit ?? '', supposedCard.rank ?? '') : 'Backside';
        const realCardKey = !realCard.faceDown ? createCardName(realCard.suit ?? '', realCard.rank ?? '') : 'Backside';
        cardsToDisplay.push(<div key={`middle-cards-container-previous-${i}-${middleSet.playerIndex}`} className="middle-cards-container">
          {createCardElement('previousSet', 'supposedCard', cardUrls[supposedCardKey], i, 'noHide')}
          {createCardElement('previousSet', 'realCard', cardUrls[realCardKey], i, 'noHide')}
        </div>)
      }
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
      <div className="card-count" ref={refCardsBurned}>
        Cards: {middle.burnedCards.length}
      </div>
      <div className="middle-cards">
        {cardsToDisplay}
      </div>
    </div>
  )
}

const makeSetAnimationChain = (
  newSetCardRefs: Array<cardsRefInterface>, 
  players: Array<PlayerInterface>,
  middleSet: SetInterface,
  cardWidth: number,
  cardHeight: number 
) : Array<AnimationChain[]> => {
  let animationChains = [];
  for (const cardsRef of newSetCardRefs) {
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
      endPoint: {x: 0, y: 0},
    })

    const realCardRect = realCard?.getBoundingClientRect();

    const secondStartY = (supposedCardRect?.top ?? 0) - (realCardRect?.top ?? 0);
    const secondStartX = (supposedCardRect?.left ?? 0) - (realCardRect?.left ?? 0);

    animationChain.push({
      element: realCard,
      startPoint: {x: secondStartX, y: secondStartY},
      endPoint: {x: 0, y: 0},
    })

    animationChains.push(animationChain);      
  }
  return animationChains;
}

const playAnimationOnlyNewSet = async (
  newSetCardRefs: Array<cardsRefInterface>, 
  players: Array<PlayerInterface>,
  middleSet: SetInterface,
  cardWidth: number,
  cardHeight: number
) => {
  const animationChains = makeSetAnimationChain(
    newSetCardRefs, 
    players, 
    middleSet, 
    cardWidth, 
    cardHeight
  )
  await playAnimationChains(animationChains);
}

const playAnimationPreviousSetAndNewSet = async (
  previousSetCardRefs: Array<cardsRefInterface>, 
  cardsBurnedRef: HTMLDivElement | null,
  cardWidth: number,
  cardHeight: number,
  newSetData: {
    newSetCardRefs: Array<cardsRefInterface>, 
    players: Array<PlayerInterface>,
    middleSet: SetInterface,
  }
) => {
  let animationChains = [];
  for (const cardsRef of previousSetCardRefs) {
    const supposedCard = cardsRef?.supposedCardRef;
    const realCard = cardsRef?.realCardRef;
    const supposedCardRect = supposedCard?.getBoundingClientRect();

    let realCardRect = realCard?.getBoundingClientRect();
    const secondStartY = (supposedCardRect?.top ?? 0) - (realCardRect?.top ?? 0);
    const secondStartX = (supposedCardRect?.left ?? 0) - (realCardRect?.left ?? 0);
    

    let animationChain : Array<AnimationChain> = []

    animationChain.push({
      element: realCard,
      startPoint: {x: 0, y: 0},
      endPoint: {x: secondStartX, y: secondStartY},
      afterAnimationChain: () : AnimationChain[] => {
        if (supposedCard?.style) {
          supposedCard.style.visibility = 'hidden';
        }
        const cardsBurnedRect = cardsBurnedRef?.getBoundingClientRect();
        realCardRect = realCard?.getBoundingClientRect();
        const targetX = ((cardsBurnedRect?.left ?? 0)) - (realCardRect?.left ?? 0) + (realCardRect?.width ?? 0 / 2) - ((cardsBurnedRect?.width ?? 0) / 2)
        const targetY = ((cardsBurnedRect?.top ?? 0)) - (realCardRect?.top ?? 0) + (realCardRect?.height ?? 0 / 2);
        // const targetX = ((cardsBurnedRect?.left ?? 0)) - (realCardRect?.left ?? 0) + ((cardsBurnedRect?.width ?? 0) / 2)
        // const targetY = ((cardsBurnedRect?.top ?? 0)) - (realCardRect?.top ?? 0) + ((cardsBurnedRect?.height ?? 0) / 2);
        return [
          {
            element: realCard,
            startPoint: {x: secondStartX, y: secondStartY},
            endPoint: {x: targetX, y: targetY},
            dontMakeVisible: true,
          }
        ];
      }
    })


    // animationChain.push({
    //   element: supposedCard,
    //   startPoint: {x: secondStartX, y: secondStartY},
    //   endPoint: {x: targetX, y: targetY}
    // })

    animationChains.push(animationChain);      
  }

  await playAnimationChains(animationChains);

  for (const ref of previousSetCardRefs) {
    if (ref?.realCardRef?.style) {
      ref.realCardRef.style.display = 'none';
    }
    if (ref?.supposedCardRef?.style) {
      ref.supposedCardRef.style.display = 'none';
    }
  }

  for (const ref of newSetData.newSetCardRefs) {
    if (ref?.realCardRef?.style) {
      ref.realCardRef.style.display = 'block';
      ref.realCardRef.style.visibility = 'hidden';
    }
    if (ref?.supposedCardRef?.style) {
      ref.supposedCardRef.style.display = 'block';
      ref.supposedCardRef.style.display = 'hidden';
    }
  }

  const makeSetAnimation = makeSetAnimationChain(
    newSetData.newSetCardRefs, 
    newSetData.players, 
    newSetData.middleSet, 
    cardWidth, 
    cardHeight
  );

  await playAnimationChains(makeSetAnimation);
}

export default Middle;