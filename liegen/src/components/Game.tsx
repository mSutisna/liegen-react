import { useEffect } from 'react';
import PrimaryHand from './PrimaryHand';
import Hand from './Hand';
import Middle from './Middle';
import { 
  DESKTOP_GAME_WIDTH, 
  DESKTOP_GAME_HEIGHT, 
  DESKTOP_MIDDLE_WIDTH,
  DESKTOP_MIDDLE_HEIGHT
 } from '../constants';
import {
  setPlayers,
  setCardUrls
} from "../slices/gameSlice";
import { PlayerInterface } from '../types/models';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '../store';
import { getImageUrls } from '../utilities/image-store/image-urls';
import MessageModal from './MessageModal'; 
import { current } from '@reduxjs/toolkit';
import checkmark from '../assets/icons/checkmark.svg'

const generatePlayers = () : Array<PlayerInterface> => {
  const player1Cards = [
    {
      suit: 'Hearts',
      rank: 'A',
      faceDown: true,
      selected: false,
      received: false,
      originIndex: null,
      receiveAnimationPlayed: false
    },
    {
      suit: 'Hearts',
      rank: '2',
      faceDown: true,
      selected: false,
      received: false,
      originIndex: null,
      receiveAnimationPlayed: false
    },
    {
      suit: 'Hearts',
      rank: '3',
      faceDown: true,
      selected: false,
      received: false,
      originIndex: null,
      receiveAnimationPlayed: false
    },
    {
      suit: 'Diamonds',
      rank: '3',
      faceDown: true,
      selected: false,
      received: false,
      originIndex: null,
      receiveAnimationPlayed: false
    },
    {
      suit: 'Diamonds',
      rank: '4',
      faceDown: true,
      selected: false,
      received: false,
      originIndex: null,
      receiveAnimationPlayed: false
    },
    {
      suit: 'Diamonds',
      rank: '5',
      faceDown: true,
      selected: false,
      received: false,
      originIndex: null,
      receiveAnimationPlayed: false
    }
  ];
  const player2Cards = [
    {
      suit: 'Diamonds',
      rank: '3',
      faceDown: true,
      selected: false,
      received: false,
      originIndex: null,
      receiveAnimationPlayed: false
    },
    {
      suit: 'Diamonds',
      rank: '4',
      faceDown: true,
      selected: false,
      received: false,
      originIndex: null,
      receiveAnimationPlayed: false
    },
    {
      suit: 'Diamonds',
      rank: '5',
      faceDown: true,
      selected: false,
      received: false,
      originIndex: null,
      receiveAnimationPlayed: false
    },
  ];
  return [
    {
      name: 'manno',
      cards: player1Cards,
      selectedRank: 0,
      xPoint: 0,
      yPoint: 0
    },
    {
      name: 'manno2',
      cards: player2Cards,
      selectedRank: 0,
      xPoint: 0,
      yPoint: 0
    }
  ]
}

function Game() {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchPlayers = async () => {
      const players = generatePlayers();
      dispatch(setPlayers(players));
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
  const players: Array<PlayerInterface> = useSelector(
    (state: RootState) => {
      return state.game.players;
    }
  );
  const currentPlayerIndex: number = useSelector(
    (state: RootState) => {
      return state.game.currentPlayerIndex;
    }
  )
  const amountOfPlayers = players.length;

  let realPlayerIndexes: {
    [k: string]: number
  } = {};
  let index = 0;
  for (const player of players) {
    realPlayerIndexes[player.name] = index;
    index++;
  }

  const createPlayersArray = (players: Array<PlayerInterface>, currentPlayerIndex: number) : Array<PlayerInterface> => {
    if (players.length === 0) {
      return [];
    }
    const endIndex = players.length - 1;
    let iterationIndex = currentPlayerIndex;
    let playersArray = [];
    do {
      playersArray.push(players[iterationIndex])
      iterationIndex -= 1;
      if (iterationIndex < 0) {
        iterationIndex = endIndex;
      }
    } while (iterationIndex !== currentPlayerIndex);
    return playersArray;
  }

  const playersArray = createPlayersArray(players, currentPlayerIndex);

  return (
    <div className="game-wrapper">
      <MessageModal />
      <div className="very-interesting">
        <img src={checkmark} style={{width: 10, height: 10}} />
      </div>
      <div className="game" style={style}>
        <Middle
          width={DESKTOP_MIDDLE_WIDTH}
          height={DESKTOP_MIDDLE_HEIGHT}
          left={(gameWidth / 2) - (DESKTOP_MIDDLE_WIDTH / 2)}
          top={(gameHeight / 2) - (DESKTOP_MIDDLE_HEIGHT / 2)}
        />
        {playersArray.map((handData, index) => {
          const realIndex = realPlayerIndexes[handData.name];
          const data = {
            name: handData.name,
            index,
            realIndex: realIndex,
            amountOfPlayers,
            gameWidth,
            gameHeight,
            cards: handData.cards,
            selectedRank: handData.selectedRank
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