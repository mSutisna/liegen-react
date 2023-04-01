import { useEffect, useRef, useLayoutEffect } from 'react';
import PrimaryHand from './PrimaryHand';
import Hand from './Hand';
import Middle from './Middle';
import { 
  DESKTOP_GAME_WIDTH, 
  DESKTOP_GAME_HEIGHT, 
  DESKTOP_MIDDLE_WIDTH,
  DESKTOP_MIDDLE_HEIGHT,
  CardRanks, 
  CardSuits
 } from '../constants';
import {
  setPlayers,
  setCardUrls,
  setPlayersOrder
} from "../slices/gameSlice";
import { 
  AnimationStatus, 
  PlayerInterface, 
  CardForPlayerInterface, 
  MiddleInterface,
} from '../types/models';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '../store';
import { getImageUrls } from '../utilities/image-store/image-urls';
import MessageModal from './MessageModal'; 
import { current } from '@reduxjs/toolkit';
import { createPlayersOrder } from '../utilities/general-helper-functions';

const generatePlayers = () : Array<PlayerInterface> => {
  const player1Cards : Array<CardForPlayerInterface> = [
    {
      suitIndex: CardSuits.HEARTS,
      rankIndex: CardRanks.ACE,
      faceDown: true,
      selected: false,
      originPoint: {
        x: 0,
        y: 0,
      },
      receiveAnimationStatus: AnimationStatus.IDLE
    },
    // {
    //   suitIndex: CardSuits.HEARTS,
    //   rankIndex: CardRanks.TWO,
    //   faceDown: true,
    //   selected: false,
    //   originPoint: {
    //     x: 0,
    //     y: 0,
    //   },
    //   receiveAnimationStatus: AnimationStatus.IDLE
    // },
    // {
    //   suitIndex: CardSuits.HEARTS,
    //   rankIndex: CardRanks.THREE,
    //   faceDown: true,
    //   selected: false,
    //   originPoint: {
    //     x: 0,
    //     y: 0,
    //   },
    //   receiveAnimationStatus: AnimationStatus.IDLE
    // },
    // {
    //   suitIndex: CardSuits.DIAMONDS,
    //   rankIndex: CardRanks.THREE,
    //   faceDown: true,
    //   selected: false,
    //   originPoint: {
    //     x: 0,
    //     y: 0,
    //   },
    //   receiveAnimationStatus: AnimationStatus.IDLE
    // },
    // {
    //   suitIndex: CardSuits.DIAMONDS,
    //   rankIndex: CardRanks.FOUR,
    //   faceDown: true,
    //   selected: false,
    //   originPoint: {
    //     x: 0,
    //     y: 0,
    //   },
    //   receiveAnimationStatus: AnimationStatus.IDLE
    // },
    // {
    //   suitIndex: CardSuits.DIAMONDS,
    //   rankIndex: CardRanks.FIVE,
    //   faceDown: true,
    //   selected: false,
    //   originPoint: {
    //     x: 0,
    //     y: 0,
    //   },
    //   receiveAnimationStatus: AnimationStatus.IDLE
    // }
  ];
  const player2Cards : Array<CardForPlayerInterface> = [
    {
      suitIndex: CardSuits.DIAMONDS,
      rankIndex: CardRanks.SEVEN,
      faceDown: true,
      selected: false,
      originPoint: {
        x: 0,
        y: 0,
      },
      receiveAnimationStatus: AnimationStatus.IDLE
    },
    // {
    //   suitIndex: CardSuits.DIAMONDS,
    //   rankIndex: CardRanks.EIGHT,
    //   faceDown: true,
    //   selected: false,
    //   originPoint: {
    //     x: 0,
    //     y: 0,
    //   },
    //   receiveAnimationStatus: AnimationStatus.IDLE
    // },
    // {
    //   suitIndex: CardSuits.DIAMONDS,
    //   rankIndex: CardRanks.NINE,
    //   faceDown: true,
    //   selected: false,
    //   originPoint: {
    //     x: 0,
    //     y: 0,
    //   },
    //   receiveAnimationStatus: AnimationStatus.IDLE
    // },
    // {
    //   suitIndex: CardSuits.SPADES,
    //   rankIndex: CardRanks.JACK,
    //   faceDown: true,
    //   selected: false,
    //   originPoint: {
    //     x: 0,
    //     y: 0,
    //   },
    //   receiveAnimationStatus: AnimationStatus.IDLE
    // },
    // {
    //   suitIndex: CardSuits.SPADES,
    //   rankIndex: CardRanks.KING,
    //   faceDown: true,
    //   selected: false,
    //   originPoint: {
    //     x: 0,
    //     y: 0,
    //   },
    //   receiveAnimationStatus: AnimationStatus.IDLE
    // },
    // {
    //   suitIndex: CardSuits.SPADES,
    //   rankIndex: CardRanks.ACE,
    //   faceDown: true,
    //   selected: false,
    //   originPoint: {
    //     x: 0,
    //     y: 0,
    //   },
    //   receiveAnimationStatus: AnimationStatus.IDLE
    // },
  ];
  return [
    {
      name: 'manno',
      cards: player1Cards,
      index: 0,
      selectedRank: 0,
      originPoint: {
        x: 0,
        y: 0,
      }
    },
    {
      name: 'manno2',
      cards: player2Cards,
      index: 1,
      selectedRank: 0,
      originPoint: {
        x: 0,
        y: 0,
      }
    }
  ];
}

function Game() {
  const dispatch = useDispatch();
  const playerIndicatorCollection = useRef<(HTMLImageElement | null)[]>([]);
  const assignIndicatorRefToCollection = (element: HTMLImageElement | null, index: number) => {
    if (!playerIndicatorCollection.current[index]) {
      playerIndicatorCollection.current[index] = element;
    }
  }
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
  const currentPlayerIndex: number = useSelector(
    (state: RootState) => {
      return state.game.currentPlayerIndex;
    }
  )
  const middle: MiddleInterface= useSelector(
    (state: RootState) => {
      return state.game.middle;
    }
  )
  const amountOfPlayers = players.length;
  useEffect(() => {
    const fetchPlayers = async () => {
      const players = generatePlayers();
      const playersOrder = createPlayersOrder(players, currentPlayerIndex);
      dispatch(setPlayers(players));
      dispatch(setPlayersOrder(playersOrder))
    }
    fetchPlayers();
    const setImageUrls = async () => {
      const imageUrls = await getImageUrls();
      dispatch(setCardUrls(imageUrls));
    }
    setImageUrls();
  }, []);
  const gameWidth = DESKTOP_GAME_WIDTH;
  const gameHeight = DESKTOP_GAME_HEIGHT;
  const style = {
    width: gameWidth,
    height: gameHeight
  }

  const playersRenderInOrder = [];

  for (const playerIndex of playersOrder) {
    playersRenderInOrder.push(players[playerIndex]);
  }

  return (
    <div className="game-wrapper">
      <MessageModal />
      <div className="game" style={style}>
        <Middle
          width={DESKTOP_MIDDLE_WIDTH}
          height={DESKTOP_MIDDLE_HEIGHT}
          left={(gameWidth / 2) - (DESKTOP_MIDDLE_WIDTH / 2)}
          top={(gameHeight / 2) - (DESKTOP_MIDDLE_HEIGHT / 2)}
          playerIndicatorCollection={playerIndicatorCollection}
        />
        {playersRenderInOrder.map((handData, index) => {
          const data = {
            name: handData.name,
            index,
            realIndex: handData.index,
            amountOfPlayers,
            gameWidth,
            gameHeight,
            cards: handData.cards,
            selectedRank: handData.selectedRank,
            assignIndicatorRefToCollection
          }
          const key = `playerIndex-${index}`;
          if (index === 0) {
            return <PrimaryHand key={key} {...data} />
          }
          return <Hand key={key} {...data} />
        })}
      </div>
    </div>
  )
}

export default Game;