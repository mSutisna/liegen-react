import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import PrimaryHand from './PrimaryHand';
import Hand from './Hand';
import Middle from './Middle';
import { 
  DESKTOP_GAME_WIDTH, 
  DESKTOP_GAME_HEIGHT, 
  DESKTOP_MIDDLE_WIDTH,
  DESKTOP_MIDDLE_HEIGHT,
  CardRanks, 
  CardSuits,
  CardUrlType,
  GridItemType,
  GridOrientation,
  EVENT_RECEIVE_CARD,
  EVENT_RESET_TO_LOBBY,
  EVENT_CALL_BUST_RESPONSE,
  EVENT_MAKE_SET_RESPONSE,
  RANKS,
  SUITS
 } from '../../constants';
import {
  setPlayers,
  setCardUrls,
  setCardUrlsToUse,
  setPlayersOrder,
  setVisibilityAllCardsModal,
  setVisibilityMessageModal,
  receiveCard,
  displayNewMessage
} from "../../slices/gameSlice";
import { 
  AnimationStatus, 
  PlayerInterface, 
  CardForPlayerInterface, 
  MiddleInterface,
  MessageModalData,
} from '../../types/models';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '../../store';
import { getImageUrls } from '../../utilities/image-store/image-urls';
import MessageModal from './MessageModal'; 
import AllCardsModal from './AllCardsModal';
import { createPlayersOrder } from '../../utilities/general-helper-functions';
import socket from "../../utilities/Socket";
import { Dispatch, AnyAction } from "@reduxjs/toolkit";
import queueInstance from '../../utilities/Queue';
import { ReceiveCardDataResponseInterface, SetResponseInterface } from '../../types/socket';
import InitialState, { ModalAnimationType } from '../../types/redux/game';
import store from "../../store";


const registerSocketListeners = (
  dispatch: Dispatch<AnyAction>,
  // players: Array<PlayerInterface>,
  // displayNewMessage: (
  //   dispatch: Dispatch<AnyAction>,
  //   message: string,
  //   modalAnimation?: ModalAnimationType,
  //   disableCloseButton?: boolean
  // ) => void
) => {
  // socket.on('playersUpdate', data => {
  // })

  const storeState = store.getState();

  socket.on(EVENT_RECEIVE_CARD, (data: ReceiveCardDataResponseInterface) => {
    let rankIndex = data.cardData.rank !== null
      ? RANKS.findIndex(rank => data.cardData.rank === rank)
      : null;
    let suitIndex = data.cardData.suit !== null
      ? SUITS.findIndex(suit => data.cardData.suit === suit)
      : null;
    dispatch(receiveCard({
      receivingPlayerIndex: data.playerIndex,
      card: {
        rankIndex,
        suitIndex,
        faceDown: storeState.game.mainPlayerIndex === data.playerIndex
      }
    }))
  })

  socket.on(EVENT_MAKE_SET_RESPONSE, (setResponse) => {
  })

  socket.on(EVENT_CALL_BUST_RESPONSE, (bustResponse) => {
  });
  socket.emit('gameLoaded');
}

function Game() {
  const dispatch = useDispatch();
  const playerIndicatorCollection = useRef<(HTMLImageElement | null)[]>([]);
  const assignIndicatorRefToCollection = (element: HTMLImageElement | null, index: number) => {
    if (!playerIndicatorCollection.current[index]) {
      playerIndicatorCollection.current[index] = element;
    }
  }

  const gameSlice: InitialState = useSelector(
    (state: RootState) => {
      return state.game;
    }
  )

  console.log('KANKER AIDS GAME SLICE', gameSlice)

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

  const mainPlayerIndex: number = useSelector(
    (state: RootState) => {
      return state.game.mainPlayerIndex;
    }
  )

  const cardUrlsRegular: {[k: string]: string} = useSelector(
    (state: RootState) => {
      return state.game.cardUrlsRegular;
    }
  )
  const cardUrlsMobile: {[k: string]: string} = useSelector(
    (state: RootState) => {
      return state.game.cardUrlsMobile;
    }
  )
  const middle: MiddleInterface= useSelector(
    (state: RootState) => {
      return state.game.middle;
    }
  )

  const [screenSize, setScreenSize] = useState<{
    width: number,
    height: number,
  }>({
    width: window.innerWidth,
    height: window.innerHeight,
  })
  useLayoutEffect(() => {
    const handleWindowResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
    window.addEventListener('resize', handleWindowResize);
    if (screenSize.width <= 1023) {
      dispatch(setCardUrlsToUse(CardUrlType.MOBILE));
    } else {
      dispatch(setCardUrlsToUse(CardUrlType.REGULAR));
    }
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    }
  }, [screenSize.width, screenSize.height, cardUrlsRegular, cardUrlsMobile]);
  
  const amountOfPlayers = players.length;
  useEffect(() => {

    registerSocketListeners(
      dispatch,
    )
    const fetchPlayers = async () => {
      // const players = generatePlayers();
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

  const allCardsModalVisible: boolean = useSelector(
    (state: RootState) => {
      return state.game.allCardsModalVisible;
    }
  );

  const messageModalData: MessageModalData = useSelector(
    (state: RootState) => {
      return state.game.messageModal;
    }
  );

  const messageModalRef = useRef<HTMLDivElement>(null);

  const closeModal = (type: string) => {
    if (type === 'allCardsModal') {
      if (messageModalRef.current) {
        const top = messageModalRef.current.getBoundingClientRect().top;
        const messageModalInViewPort = (top + 0) >= 0 && (top - 0) <= window.innerHeight;
        if (messageModalInViewPort) {
          return;
        }
      }
      dispatch(setVisibilityAllCardsModal(false))
    } else {
      dispatch(setVisibilityMessageModal(false))
    }
  }

  const mainPlayerData = players[currentPlayerIndex];

  const modals = <>
    <AllCardsModal 
      allCardsVisible={allCardsModalVisible} 
      closeExecution={closeModal} 
      players={players}
      currentPlayerIndex={currentPlayerIndex}
      mainPlayerIndex={mainPlayerIndex}
      middle={middle}
    />
    <MessageModal 
      messageModalData={messageModalData} 
      closeExecution={closeModal} 
      messageModalRef={messageModalRef} 
    />
  </>;

  return (
    <div className="game-wrapper">
      {modals}
      <div className="game-outer">
        <div className="aspect-ratio-container" />
        <div className="game">
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
      {/* <div className="game" style={style}>
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
      </div> */}
    </div>
  )
}

export default Game;