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
  makeSet,
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
import InitialState, { MakeSetPayload, ModalAnimationType, ReceiveCardPayload } from '../../types/redux/game';
import { registerGameHandlers, unregisterGameHandlers } from '../../register-socket-handlers/game';
import {
  GAME_LOADED,
  MAKE_SET,
  CALL_BUST,
  GAME_OVER, 
  HandleGameLoadedResponse,
  HandleMakeSetResponse,
  HandleCallBustResponse,
  HandleGameOverResponse,
  HandleReceiveCardResponse,
  MakeSetDataResponse
} from '../../types/pages/game';
import socket from "../../utilities/Socket";


function Game() {
  const dispatch = useDispatch();
  const playerIndicatorCollection = useRef<(HTMLImageElement | null)[]>([]);
  const assignIndicatorRefToCollection = (element: HTMLImageElement | null, index: number) => {
    if (!playerIndicatorCollection.current[index]) {
      playerIndicatorCollection.current[index] = element;
    }
  }

  const game: InitialState = useSelector(
    (state: RootState) => {
      return state.game;
    } 
  )

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
    // const fetchPlayers = async () => {
    //   // const players = generatePlayers();
    //   const playersOrder = createPlayersOrder(players, currentPlayerIndex);
    //   dispatch(setPlayers(players));
    //   dispatch(setPlayersOrder(playersOrder))
    // }
    // fetchPlayers();
    const setImageUrls = async () => {
      const imageUrls = await getImageUrls();
      dispatch(setCardUrls(imageUrls));
    }
    setImageUrls();

    const receiveCardCallback: HandleReceiveCardResponse = (data: ReceiveCardPayload) => {
      dispatch(receiveCard(data))
    }
    const makeSetCallback: HandleMakeSetResponse = (data: MakeSetDataResponse) => {
      if (data.error) {
        displayNewMessage(dispatch, data.error);
        return;
      }
      console.log('MAKET SET!!!')
      dispatch(makeSet(data));
    }
    const callBustCallback: HandleCallBustResponse = () => {

    }
    const gameOverCallback: HandleGameOverResponse = () => {

    }

    registerGameHandlers(
      receiveCardCallback,
      makeSetCallback,
      callBustCallback,
      gameOverCallback
    );
    socket.emit(GAME_LOADED)
    return unregisterGameHandlers;
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