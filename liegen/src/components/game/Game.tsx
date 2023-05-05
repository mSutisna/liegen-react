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
  displayNewMessage,
  callBust,
  updateMessage,
  updatePlayers,
  resetModal
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
import InitialState, { MakeSetPayload, ModalAnimationType, ReceiveCardPayload } from '../../types/redux/game';
import { registerGameHandlers, unregisterGameHandlers } from '../../register-socket-handlers/game';
import {
  GAME_LOADED,
  HandleReceiveCardResponse,
  HandleMakeSetResponse,
  HandleCallBustResponse,
  HandleResetToLobbyResponse,
  MakeSetDataResponse,
  CallBustResponse,
  ResetToLobbyResponse,
  HandlePlayersGameChangeResponse
} from '../../types/pages/game';
import socket from "../../utilities/Socket";
import { LobbyPlayerData } from '../../types/pages/lobby';



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
  });

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

  useEffect(() => {
    if (game.gameOver) {
      const message = createGameOverMessage(players, game.playerIndexWhoWon ?? -1 , game.mainPlayerIndex, game.secondsLeftToReset ?? 0);
      displayNewMessage(dispatch, message, ModalAnimationType.WIN, true);
    }
  }, [game]);

  useEffect(() => {
    const notConnectedPlayers = [];
    for (const player of game.players) {
      if (!player.connected) {
        notConnectedPlayers.push(player.username);
      }
    }
    if (notConnectedPlayers.length > 0) {
      const message = `The game has been paused because the following players are disconnected: '${notConnectedPlayers.join('\',\' ')}'. \n\n
       The disconnected players must connect with the game again for the game to continue.`;
      displayNewMessage(dispatch, message, ModalAnimationType.REGULAR, true, true);
      return;
    } else if (messageModalData.gamePaused) {
      resetModal(dispatch);
    }
  }, [players])
  
  const amountOfPlayers = players.length;
  useEffect(() => {
    const setImageUrls = async () => {
      const imageUrls = await getImageUrls();
      dispatch(setCardUrls(imageUrls));
    }
    setImageUrls();

    const playersGameChangeCallback: HandlePlayersGameChangeResponse = (data: {
      players: Array<LobbyPlayerData>
    }) => {
      dispatch(updatePlayers(data.players))
    }

    const receiveCardCallback: HandleReceiveCardResponse = (data: ReceiveCardPayload) => {
      dispatch(receiveCard(data))
    }
    const makeSetCallback: HandleMakeSetResponse = (data: MakeSetDataResponse) => {
      if (data.error) {
        displayNewMessage(dispatch, data.error);
        return;
      }
      dispatch(makeSet(data));
    }
    const callBustCallback: HandleCallBustResponse = (data: CallBustResponse) => {
      if (data.error) {
        displayNewMessage(dispatch, data.error);
        return;
      }
      dispatch(callBust(data));
    } 
    const resetToLobbyCallback: HandleResetToLobbyResponse = (data: ResetToLobbyResponse) => {
      if (data.redirect) {
        window.location.href = document.location.origin;
        return;
      }
      const message = createGameOverMessage(players, data.playerWhoWonIndex, game.mainPlayerIndex, data.secondsLeftToReset)
      if (messageModalData.modalAnimation !== ModalAnimationType.WIN) {
        displayNewMessage(dispatch, message, ModalAnimationType.WIN, true);
      } else {
        updateMessage(dispatch, message);
      }
    }
    registerGameHandlers(
      playersGameChangeCallback,
      receiveCardCallback,
      makeSetCallback,
      callBustCallback,
      resetToLobbyCallback
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

const createGameOverMessage = (
  players: Array<PlayerInterface>,
  playerIndexWhoWon: number,
  mainPlayerIndex: number,
  secondsLeftToReset: number
) : string => {
  const winningPlayer = players[playerIndexWhoWon];
  const player = players[mainPlayerIndex];
  const winMessage = winningPlayer.userID === player.userID
    ? 'You won!'
    : `Player: '${player.name}' has won!`;
  return `${winMessage} \n\n You will be returned to the loby in ${secondsLeftToReset} seconds.`
}

export default Game;