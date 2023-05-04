import { useSelector, useDispatch } from "react-redux";
import { RootState } from '../../store';
import { CardUrls, MiddleInterface, PlayerInterface, SetInterface } from "../../types/models";
import { createCardName } from "../../utilities/card-helper-functions";
import React, { useState, useRef, useLayoutEffect } from "react";
import { getImageUrls } from "../../utilities/image-store/image-urls";
import { 
  AnimationChain, 
  AnimationChainMultipleImplelmentations, 
  AnimationStatus 
} from '../../types/models'
import { 
  DESKTOP_CARD_HEIGHT, 
  DESKTOP_CARD_WIDTH, 
  DESKTOP_CARD_SCALE,
  RANKS,
  SUITS, 
  BurnType
} from "../../constants";
import { playAnimationChains } from "../../utilities/animation/play-animation";
import { 
  setSetAnimationStatus, 
  setBustAnimationStatus, 
  receiveCard,
  afterBustResetMiddle,
  burnCards,
  switchToNextPlayer,
  displayNewMessage
} from "../../slices/gameSlice";
import exclamationMark from '../../assets/icons/exclamation-mark.svg';
import questionMark from '../../assets/icons/question-mark.svg';
import crossMark from '../../assets/icons/cross-mark.svg';
import checkMark from '../../assets/icons/check-mark.svg';
import smileyFace from '../../assets/icons/smiley-face.svg';
import frownFace from '../../assets/icons/frown-face.svg';
import { determineSetIsALieAndGetIndexes } from "../../utilities/general-helper-functions";
import { Dispatch, AnyAction } from "@reduxjs/toolkit";
import { ModalAnimationType } from "../../types/redux/game";
import { CallBustResponse } from "../../types/pages/game";

interface MiddleProps {
  width: number,
  height: number,
  left: number,
  top: number,
  playerIndicatorCollection: React.RefObject<(HTMLImageElement | null)[]>
}

interface cardSetsRefCollectionInterface {
  currentSetCardsRef: HTMLElement | null,
  previousSetCardsRef: HTMLElement | null
}

interface cardsRefInterface {
  supposedCardRef: HTMLElement | null,
  realCardRef: HTMLElement | null,
  innerSupposedCardRef: HTMLElement | null,
  innerRealCardRef: HTMLElement | null,
}

interface refCollectionInterface {
  newSet: Array<cardsRefInterface>,
  previousSet: Array<cardsRefInterface>
}

function Middle({width, height, left, top, playerIndicatorCollection} : MiddleProps) {  
  const cardUrls: CardUrls  = useSelector(
    (state: RootState) => {
      return state.game.cardUrls;
    }
  );
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
  const playersOrder: Array<number> = useSelector(
    (state: RootState) => {
      return state.game.playersOrder;
    }
  )

  const cardWidth = DESKTOP_CARD_WIDTH * DESKTOP_CARD_SCALE;
  const cardHeight = DESKTOP_CARD_HEIGHT * DESKTOP_CARD_SCALE;

  const currentSetCardsToDisplay : Array<JSX.Element | null> = [];
  const previousSetCardsToDisplay : Array<JSX.Element | null> = [];
  const middleSet = middle.set;
  const previousMiddleSet = middle.previousSet;

  const refCollection = useRef<refCollectionInterface>({
    newSet: [],
    previousSet: []
  });

  const cardSetsCollection = useRef<cardSetsRefCollectionInterface>({
    currentSetCardsRef: null,
    previousSetCardsRef: null
  })

  const middleCardIndicatorsCollection = useRef<(HTMLImageElement | null)[]>([]);

  const cardsToDealCollection = useRef<(HTMLImageElement | null)[]>([]);

  const refCardsBurned = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!middleSet) {
      return;
    }

    const newSetRefs = refCollection.current.newSet;
    const previousSetRefs = refCollection.current.previousSet;
    const callBustResponse = middle.callBustResponse;
    if (callBustResponse !== null) {
      const playBustAnimation = async () => {
        console.log('play bust animation', {callBustResponse})
        if (
          (middle.bustAnimationStatus === AnimationStatus.RUNNING || middle.setAnimationStatus === AnimationStatus.RUNNING)
          || middle.bustAnimationStatus === AnimationStatus.FINISHED
        ) {
          console.log('ALREADY BUSY!', {
            bust: middle.bustAnimationStatus,
            set: middle.setAnimationStatus
          })
          return;
        }
        dispatch(setBustAnimationStatus(AnimationStatus.RUNNING));
        console.log('set animation status running bust')
        await playBustAnimationInner(
          callBustResponse,
          players, 
          playersOrder,
          middle, 
          newSetRefs, 
          playerIndicatorCollection.current, 
          middleCardIndicatorsCollection.current, 
          refCardsBurned.current,
          cardsToDealCollection.current,
          dispatch
        );
        await dispatch(afterBustResetMiddle());
        await dispatch(setBustAnimationStatus(AnimationStatus.FINISHED));
        const winingPlayer = players[callBustResponse.playerToSwitchToIndex];
        if (winingPlayer.cards.length > 0) {
          console.log('SWITCH TO NEXT PLAYER', callBustResponse.playerToSwitchToIndex)
          dispatch(switchToNextPlayer(callBustResponse.playerToSwitchToIndex));
          return;
        }
        displayNewMessage(dispatch, `Player '${winingPlayer.name}' has won!`, ModalAnimationType.WIN, true);
      }
      playBustAnimation();
      return;
    }

    const playReceiveSetAnimation = async () => {
      if (
        (middle.bustAnimationStatus === AnimationStatus.RUNNING || middle.setAnimationStatus === AnimationStatus.RUNNING)
        || middle.setAnimationStatus === AnimationStatus.FINISHED
      ) {
        return;
      }
      console.log('play receive set animation')
      dispatch(setSetAnimationStatus(AnimationStatus.RUNNING));
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
          cardSetsCollection.current,
          previousSetRefs,
          refCardsBurned.current,
          cardWidth, 
          cardHeight,
          newSetData,
          dispatch
        )
      }
      await dispatch(setSetAnimationStatus(AnimationStatus.FINISHED));
      dispatch(switchToNextPlayer(null))
    }
    playReceiveSetAnimation();
  }, [middle])

  if (middleSet) {
    const supposedCards = middleSet.supposedCards ?? [];
    const realCards = middleSet.realCards ?? [];
    const createRefObjectAndSetElement = (
      refCollectionData: cardsRefInterface[],
      index: number,
      assignElement: (refCollectionData: cardsRefInterface) => void 
    ) => {
      let cardRefObject = refCollectionData[index]
      if (!cardRefObject) {
        cardRefObject = {
          realCardRef: null,
          supposedCardRef: null,
          innerRealCardRef: null,
          innerSupposedCardRef: null,
        };
      }
      assignElement(cardRefObject);
      refCollectionData[index] = cardRefObject;
    }

    const createCardElement = (refCardCollection: Array<cardsRefInterface>, type: string, url: string, index: number, visibilityHideType = 'visibility')  => {
      const style : {[k: string]: string | number} = {
        // width: cardWidth,
        // height: cardHeight,
      }
      const cardStyle = {...style};
      //Comment out if chain below to display middle set initially without problems
      if (middle.setAnimationStatus !== AnimationStatus.FINISHED) {
        if (visibilityHideType === 'visibility')  {
          style.visibility = 'hidden';
        } else if (visibilityHideType === 'display') {
          style.display = 'none';
        }
      }
      const frontSideDisplay = type === 'supposedCard' 
        ? 'do-display'
        : 'dont-display';
      const backsideDisplay = type === 'supposedCard' 
        ? 'dont-display'
        : 'do-display';

      return <div
        ref={el => {
          createRefObjectAndSetElement(
            refCardCollection,
            index,
            (refCollectionData) => {
              if (type === 'supposedCard') {
                refCollectionData.supposedCardRef = el 
              } else {
                refCollectionData.realCardRef = el
              }
            }
          );
        }}
        className="card"
        style={style}
      >
        <div 
          ref={el => {
            createRefObjectAndSetElement(
              refCardCollection,
              index,
              (refCollectionData) => {
                if (type === 'supposedCard') {
                  refCollectionData.innerSupposedCardRef = el 
                } else {
                  refCollectionData.innerRealCardRef = el
                }
              }
            );
          }}
          className="card-inner" 
        >
          <img 
            src={url} 
            // style={cardStyle}
            className={`front-side ${frontSideDisplay}`}
          />
          <img 
            src={cardUrls['Backside']} 
            // style={cardStyle}
            className={`back-side ${backsideDisplay}`}
          />
        </div>
      </div>
    }
    const refCollectionData = refCollection.current;
    for (let i = 0; i < supposedCards.length; i++) {
      const supposedCard = supposedCards[i];
      const realCard = realCards[i];
      const supposedCardKey = createCardName(SUITS[supposedCard.suitIndex ?? -1] ?? '', RANKS[supposedCard.rankIndex ?? -1] ?? '');
      const realCardKey = createCardName(SUITS[realCard.suitIndex ?? -1] ?? '', RANKS[realCard.rankIndex ?? -1] ?? '');
      currentSetCardsToDisplay.push(<div 
        key={`middle-cards-container-new-${i}-${middleSet.playerIndex}`} 
        className="middle-cards-container" 
      >
        <div className="cards-wrapper">
          {createCardElement(refCollectionData.newSet, 'supposedCard', cardUrls[supposedCardKey], i, previousMiddleSet ? 'display' : 'visibility')}
          {createCardElement(refCollectionData.newSet, 'realCard', cardUrls[realCardKey], i, previousMiddleSet ? 'display' : 'visibility')}
        </div>
        <img 
          src="" 
          className="indicator"
          ref={element => {
            const alreadyAddedElement = middleCardIndicatorsCollection.current[i];
            if (!alreadyAddedElement || alreadyAddedElement !== element) {
              middleCardIndicatorsCollection.current[i] = element;
            }
          }}
        />
      </div>)
    }
    if (previousMiddleSet) {
      const previousSupposedCards = previousMiddleSet.supposedCards;
      const previousMiddleCards = previousMiddleSet.realCards;
      for (let i = 0; i < previousSupposedCards.length; i++) {
        const supposedCard = previousSupposedCards[i];
        const realCard = previousMiddleCards[i];
        const supposedCardKey = !supposedCard.faceDown ? createCardName(SUITS[supposedCard.suitIndex ?? -1] ?? '', RANKS[supposedCard.rankIndex ?? -1] ?? '') : 'Backside';
        const realCardKey = !realCard.faceDown ? createCardName(SUITS[realCard.suitIndex ?? -1] ?? '', RANKS[realCard.rankIndex ?? -1] ?? '') : 'Backside';
        previousSetCardsToDisplay.push(<div 
          key={`middle-cards-container-previous-${i}-${middleSet.playerIndex}`} 
          className="middle-cards-container previous"
        >
          <div className="cards-wrapper">
            {createCardElement(refCollectionData.previousSet, 'supposedCard', cardUrls[supposedCardKey], i, 'noHide')}
            {createCardElement(refCollectionData.previousSet, 'realCard', cardUrls[realCardKey], i, 'noHide')}
          </div>
          <img src="" className="indicator"/>
        </div>)
      }
    }
  }

  let cardObjects = [...middle.burnedCards];
  if (middleSet?.realCards) {
    cardObjects = [...cardObjects, ...middleSet.realCards]
  }
  const cardsToDeal = [];
  for (let i = 0; i < cardObjects.length; i++) {
    const cardObject = cardObjects[i];
    cardsToDeal.push(<img
      key={`card-to-deal-${i}`}
      src={cardUrls['Backside']}
      className="card"
      ref={element => {
        const alreadyAddedCardElement = cardsToDealCollection.current[i];
        if (!alreadyAddedCardElement || alreadyAddedCardElement !== element) {
          cardsToDealCollection.current[i] = element;
        }
      }}
      data-suit={cardObject.suitIndex}
      data-rank={cardObject.rankIndex}
    />)
  }

  return (
    <div 
      className="middle"
    >
      <div className="card-count" ref={refCardsBurned}>
        <div className="count-inner">
          <div className="label">
            <span>Cards: </span><span>{middle.burnedCards.length}</span>
          </div>
        </div>
        <div className="cards-to-deal">
          <div 
            className="cards-to-deal-inner"
            // style={{
            //   width: '59.5px',
            //   height: '89.25px'
            // }}
          >
            {cardsToDeal}
          </div>
        </div>
      </div>
      <div className="middle-cards">
        <div 
          className="middle-cards-inner"
          ref={element => {
            cardSetsCollection.current.currentSetCardsRef = element;
          }}
        >
          {currentSetCardsToDisplay}
        </div>
        <div 
          className="middle-cards-inner previous"
          ref={element => {
            cardSetsCollection.current.previousSetCardsRef = element;
          }}
        >
          {previousSetCardsToDisplay}
        </div>
      </div>
    </div>
  )
}

const playBustAnimationInner = async (
  callBustResponse: CallBustResponse,
  players: Array<PlayerInterface>,
  playersOrder: Array<number>,
  middle: MiddleInterface,
  newSetCardRefs: Array<cardsRefInterface>,
  playerIndicatorCollection: Array<HTMLImageElement | null> | null,
  middleCardIndicatorsCollection: Array<HTMLImageElement | null> | null,
  cardsBurnedRef: HTMLDivElement | null,
  cardsToDeal: Array<HTMLImageElement | null> | null,
  dispatch: Dispatch<AnyAction>,
) : Promise<void> => {
  console.log('PLAY BUST ANIMATION INNER!!!!')
  if (
    !middleCardIndicatorsCollection
    || !playerIndicatorCollection
    || (callBustResponse.playerToCallBustIndex === null)
    || !middle.set
    || (middle.set.playerIndex === null)
    || !cardsToDeal
    || !cardsBurnedRef
  ) {
    console.log('dont play animation!!!')
    return
  }

  console.log('SIMPLY PLAY THE ANIMATION')
  const calledBustPlayerIndex = playersOrder.findIndex(index => index === callBustResponse.playerToCallBustIndex);
  const indicatorCalledBust = playerIndicatorCollection[calledBustPlayerIndex];
  const beingCheckedPlayerIndex = playersOrder.findIndex(index => index === middle.set?.playerIndex);
  const indicatorBeingChecked = playerIndicatorCollection[beingCheckedPlayerIndex];

  // const setIsALieData = determineSetIsALieAndGetIndexes(middle);
  
  // if (!setIsALieData) {
  //   return;
  // }

  // const {
  //   playerToWinSetIndex,
  //   playerToLoseSetIndex,
  // } = setIsALieData;
  const playerToWinSetPlayerIndex = playersOrder.findIndex(index => index === callBustResponse.playerToSwitchToIndex)
  const playerToWinSet = playerIndicatorCollection[playerToWinSetPlayerIndex];
  const playerToLoseSetPlayerIndex = playersOrder.findIndex(index => index === callBustResponse.playerToGiveCardsToIndex);
  const playerToLoseSet = playerIndicatorCollection[playerToLoseSetPlayerIndex];

  if (!indicatorCalledBust || !indicatorBeingChecked || !playerToWinSet || !playerToLoseSet) {
    console.log('NO INDICATORS!!!')
    return;
  }
  const flipCardsAndShowAwaitSymbols = () => {
    const animationChains : Array<AnimationChainMultipleImplelmentations[]> = [];
    let delay = 0;
    const indicatorCalledBustRect = indicatorCalledBust.getBoundingClientRect();

    indicatorCalledBust.src = exclamationMark;
    indicatorCalledBust.style.visibility = 'visible';

    const startX = ((window.innerWidth / 2) - (indicatorCalledBustRect.width / 2)) - (indicatorCalledBustRect?.left ?? 0);
    const startY = ((window.innerHeight / 2) - (indicatorCalledBustRect.height / 2)) - (indicatorCalledBustRect?.top ?? 0);

    let animationChain = [];
    animationChain.push({
      element: indicatorCalledBust,
      animationInstructions: [
        {transform: `translate(${startX}px, ${startY}px) scale(20)`},
        {transform: `translate(${0}px, ${0}px) scale(1)`}
      ],
      animationSettings: {
        duration: 500,
        iterations: 1,
        fill: 'forwards',
        delay
      }
    })
    animationChains.push(animationChain);
    indicatorBeingChecked.src = questionMark;
    indicatorBeingChecked.style.visibility = 'visible';

    for (const cardRef of newSetCardRefs) {
      let animationChain = [];
      animationChain.push({
        element: cardRef.innerRealCardRef,
        animationInstructions: [
          { transform: '' },
          { transform: 'translateX(-100%) rotateY(-180deg)' },
        ],
        animationSettings: {
          duration: 500,
          iterations: 1,
          fill: 'forwards',
          delay
        }
      })
      delay += 200;
      animationChains.push(animationChain);
    }
    return animationChains;
  };
  await playAnimationChains(flipCardsAndShowAwaitSymbols())
  const showMiddleCardIndicators = () => {
    const animationChains : Array<AnimationChainMultipleImplelmentations[]> = [];
    let delay = 0;
    let index = 0;
    for (const middleCardIndicator of middleCardIndicatorsCollection) {
      const animationChain = [];
      if (!middleCardIndicator || !middle.set) {
        continue;
      }
      const cardIsALie = middle.set.realCards[index].rankIndex !== middle.set.rank;
      middleCardIndicator.src = !cardIsALie
       ? checkMark
       : crossMark;
      animationChain.push({
        element: middleCardIndicator,
        animationInstructions: [
          {transform: `translate(0px, -30px)`, opacity: 1},
          {transform: `translate(0px, 0px)`, opacity: 1}
        ],
        animationSettings: {
          duration: 500,
          iterations: 1,
          fill: 'forwards',
          delay
        }
      })
      delay += 200;
      animationChains.push(animationChain);
      index++;
    }
    return animationChains;
  };
  await playAnimationChains(showMiddleCardIndicators());
  const showResultSymbolsAndBurnCards = () => {
    playerToLoseSet.src = frownFace;
    playerToWinSet.src = smileyFace;
    return createBurnCardsAnimationChain(
      newSetCardRefs,
      cardsBurnedRef,
    );
  };
  await playAnimationChains(showResultSymbolsAndBurnCards());
  await dispatch(burnCards(BurnType.CURRENT_SET));
  await (new Promise<void>(resolve => setTimeout(() => resolve(), 500)))
  const dealCards = () => {
    const animationChains : Array<AnimationChainMultipleImplelmentations[]> = [];
    const receivingPlayer = players[callBustResponse.playerToGiveCardsToIndex];
    if (!receivingPlayer.originPoint) {
      return animationChains;
    }
    let delay = 0;
    for (const cardToDeal of cardsToDeal) {
      if (!cardToDeal) {
        continue;
      }
      const cardRect = cardToDeal.getBoundingClientRect();
      const endX = (receivingPlayer.originPoint.x - (cardRect.width / 2)) - (cardRect?.left ?? 0);
      const endY = (receivingPlayer.originPoint.y - (cardRect.height / 2)) - (cardRect?.top ?? 0);
      const animationChain = [];

      let receivingPlayerIndex = players[callBustResponse.playerToGiveCardsToIndex].index;
      animationChain.push({
        element: cardToDeal,
        animationInstructions: [
          {transform: `translate(${0}px, ${0}px)`, visibility: 'visible', opacity: 1},
          {transform: `translate(${endX}px, ${endY}px)`,  visibility: 'visible', opacity: 0}
        ],
        animationSettings: {
          duration: 600,
          iterations: 1,
          fill: "forwards",
          delay
        },
        afterAnimationFunction: async () => {
          const rankIndex = Number(cardToDeal.dataset.rank);
          const suitIndex = Number(cardToDeal.dataset.suit);
          await dispatch(receiveCard({
            receivingPlayerIndex,
            card: {
              rank: RANKS[rankIndex],
              suit: SUITS[suitIndex],
              faceDown: false
            }
          }))
        }
      });
      delay += 200;
      animationChains.push(animationChain);
    }
    return animationChains;
  };
  await playAnimationChains(dealCards());
  indicatorBeingChecked.style.visibility = 'hidden';
  indicatorCalledBust.style.visibility = 'hidden';
}

const makeSetAnimationChain = (
  newSetCardRefs: Array<cardsRefInterface>, 
  players: Array<PlayerInterface>,
  middleSet: SetInterface,
  cardWidth: number,
  cardHeight: number 
) : Array<AnimationChain[]> => {
  let animationChains : Array<AnimationChain[]> = [];
  const originPlayer = players[middleSet.playerIndex];
  if (!originPlayer || !originPlayer.originPoint) {
    return animationChains;
  }
  
  const originX = originPlayer.originPoint.x;
  const originY = originPlayer.originPoint.y;
  for (const cardsRef of newSetCardRefs) {
    const supposedCard = cardsRef?.supposedCardRef;
    const realCard = cardsRef?.realCardRef;
    const supposedCardRect = supposedCard?.getBoundingClientRect();

      
    const startX = (originX - (cardWidth / 2)) - (supposedCardRect?.left ?? 0);
    const startY = (originY - (cardHeight / 2)) - (supposedCardRect?.top ?? 0);

    let animationChain : Array<AnimationChain> = []

    animationChain.push({
      element: supposedCard,
      animationInstructions: [
        {transform: `translate(${startX}px, ${startY}px)`},
        {transform: `translate(${0}px, ${0}px)`}
      ],
    })

    const realCardRect = realCard?.getBoundingClientRect();

    const secondStartY = (supposedCardRect?.top ?? 0) - (realCardRect?.top ?? 0);
    const secondStartX = (supposedCardRect?.left ?? 0) - (realCardRect?.left ?? 0);

    animationChain.push({
      element: realCard,
      animationInstructions: [
        {transform: `translate(${secondStartX}px, ${secondStartY}px)`},
        {transform: `translate(${0}px, ${0}px)`}
      ],
    })

    animationChains.push(animationChain);      
  }
  return animationChains;
}

const createBurnCardsAnimationChain = (
  cardRefs: Array<cardsRefInterface>, 
  cardsBurnedRef: HTMLDivElement | null
) : Array<AnimationChainMultipleImplelmentations[]> => {
  const animationChains = [];
  for (const cardsRef of cardRefs) {
    const supposedCard = cardsRef?.supposedCardRef;
    const realCard = cardsRef?.realCardRef;
    const supposedCardRect = supposedCard?.getBoundingClientRect();

    let realCardRect = realCard?.getBoundingClientRect();
    const secondStartY = (supposedCardRect?.top ?? 0) - (realCardRect?.top ?? 0);
    const secondStartX = (supposedCardRect?.left ?? 0) - (realCardRect?.left ?? 0);

    let animationChain : Array<AnimationChainMultipleImplelmentations> = []

    animationChain.push({
      element: realCard,
      animationInstructions: [
        {transform: `translate(${0}px, ${0}px)`},
        {transform: `translate(${secondStartX}px, ${secondStartY}px)`}
      ],
    })

    animationChain.push(() : AnimationChain => {
      if (supposedCard?.style) {
        supposedCard.style.visibility = 'hidden';
      }
      const cardsBurnedRect = cardsBurnedRef?.getBoundingClientRect();
      realCardRect = realCard?.getBoundingClientRect();
      const targetX = ((cardsBurnedRect?.left ?? 0)) - (realCardRect?.left ?? 0) + (realCardRect?.width ?? 0 / 2) - ((cardsBurnedRect?.width ?? 0) / 2)
      const targetY = ((cardsBurnedRect?.top ?? 0)) - (realCardRect?.top ?? 0) + (realCardRect?.height ?? 0 / 2);
      // const targetX = ((cardsBurnedRect?.left ?? 0)) - (realCardRect?.left ?? 0) + ((cardsBurnedRect?.width ?? 0) / 2)
      // const targetY = ((cardsBurnedRect?.top ?? 0)) - (realCardRect?.top ?? 0) + ((cardsBurnedRect?.height ?? 0) / 2);
      return {
        element: realCard,
        animationInstructions: [
          {transform: `translate(${secondStartX}px, ${secondStartY}px)`},
          {transform: `translate(${targetX}px, ${targetY}px)`, opacity: 0}
        ],
        animationSettings: {
          duration: 500,
          iterations: 1,
          fill: "forwards",
        },
        dontMakeVisible: true,
      }
    })


    // animationChain.push({
    //   element: supposedCard,
    //   startPoint: {x: secondStartX, y: secondStartY},
    //   endPoint: {x: targetX, y: targetY}
    // })

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
  cardSetsCollection: cardSetsRefCollectionInterface,
  previousSetCardRefs: Array<cardsRefInterface>, 
  cardsBurnedRef: HTMLDivElement | null,
  cardWidth: number,
  cardHeight: number,
  newSetData: {
    newSetCardRefs: Array<cardsRefInterface>, 
    players: Array<PlayerInterface>,
    middleSet: SetInterface,
  },
  dispatch: Dispatch<AnyAction>,
) => {
  const animationChains = createBurnCardsAnimationChain(
    previousSetCardRefs,
    cardsBurnedRef
  );

  const displayCardsForSelectedSetHideForOther = (type: string) => {
    if (!cardSetsCollection.currentSetCardsRef || !cardSetsCollection.previousSetCardsRef) {
      return;
    }
    if (type === 'reset') {
      cardSetsCollection.previousSetCardsRef.style.removeProperty('visibility');
      cardSetsCollection.currentSetCardsRef.style.removeProperty('visibility');
    } else if (type === 'previous') {
      cardSetsCollection.previousSetCardsRef.style.visibility = 'visible';
      cardSetsCollection.currentSetCardsRef.style.visibility = 'hidden';
    } else {
      cardSetsCollection.currentSetCardsRef.style.visibility = 'visible';
      cardSetsCollection.previousSetCardsRef.style.visibility = 'hidden';
    }
  }

  displayCardsForSelectedSetHideForOther('previous');

  await playAnimationChains(animationChains);

  await dispatch(burnCards(BurnType.PREVIOUS_SET));

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

  displayCardsForSelectedSetHideForOther('current');

  await playAnimationChains(makeSetAnimation);

  displayCardsForSelectedSetHideForOther('reset');
}

export default Middle;