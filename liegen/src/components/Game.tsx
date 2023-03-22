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

const generatePlayers = () : Array<PlayerInterface> => {
  const player1Cards = [
    {
      suit: 'Hearts',
      rank: 'A',
      faceDown: true,
      selected: false,
      received: false,
      originIndex: null,
    },
    {
      suit: 'Hearts',
      rank: '2',
      faceDown: true,
      selected: false,
      received: false,
      originIndex: null,
    },
    {
      suit: 'Hearts',
      rank: '3',
      faceDown: true,
      selected: false,
      received: false,
      originIndex: null,
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
    },
    {
      suit: 'Diamonds',
      rank: '4',
      faceDown: true,
      selected: false,
      received: false,
      originIndex: null,
    },
    {
      suit: 'Diamonds',
      rank: '5',
      faceDown: true,
      selected: false,
      received: false,
      originIndex: null,
    }
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
  const amountOfPlayers = players.length;
  return (
    <div className="game-wrapper">
      <div className="game" style={style}>
        <Middle
          width={DESKTOP_MIDDLE_WIDTH}
          height={DESKTOP_MIDDLE_HEIGHT}
          left={(gameWidth / 2) - (DESKTOP_MIDDLE_WIDTH / 2)}
          top={(gameHeight / 2) - (DESKTOP_MIDDLE_HEIGHT / 2)}
        />
        {players.map((handData, index) => {
          const data = {
            name: handData.name,
            index,
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