import { useState, useEffect } from 'react';
import PrimaryHand from './PrimaryHand';
import Hand from './Hand';
import Card from './Card';
import { DESKTOP_GAME_WIDTH, DESKTOP_GAME_HEIGHT, DESKTOP_CARD_WIDTH, DESKTOP_CARD_HEIGHT } from '../constants';
import { cardNames, getImageUrls } from '../utilities/image-store/image-urls';
import ImageStore from '../utilities/image-store/ImageStore';
import {
  setPlayers
} from "../slices/gameSlice";
import { PlayerInterface } from '../types/models';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '../store';

const imageStore = new ImageStore();


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
      cards: player1Cards
    },
    {
      name: 'manno2',
      cards: player2Cards
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
  console.log({players})
  const amountOfPlayers = players.length;
  return (
    <div className="game-wrapper">
      <div className="game" style={style}>
        {players.map((handData, index) => {
          const data = {
            name: handData.name,
            index,
            amountOfPlayers,
            gameWidth,
            gameHeight,
            cards: handData.cards
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