import { useDispatch, useSelector } from "react-redux";
import { LobbyState } from "../../types/redux/lobby";
import { RootState } from "../../store";
import { useEffect, useState } from "react";
import useModal from "../../custom-hooks/useModal";
import socket from "../../utilities/Socket";
import { 
  READY_CHANGE, 
  START,
  HandleDefinitiveStartCallback,
  HandlePlayersChangeCallback,
  HandleStartResponseCallback 
} from "../../types/pages/lobby";
import { 
  registerLobbyHandlers, 
  unregisterLobbyHandlers,
} from "../../register-socket-handlers/lobby";
import { setPlayers as setPlayersLobby } from "../../slices/lobbySlice";
import { setPlayers, setMainPlayerIndex } from "../../slices/gameSlice";
import Modal from "./Modal";

export default function Lobby() {
  const dispatch = useDispatch();
  useEffect(() => {  
    const playersChangeCallback: HandlePlayersChangeCallback = (data) => {
      if (!data.players) {
        return;
      }
      dispatch(setPlayersLobby(data.players));
    }
    const startResponseCallback: HandleStartResponseCallback = (data) => {
      if (!data.error) {
        return;
      }
      setModalMessage(data.error);
      setSaving(false)
      toggleModal();
    }
    const definitiveStartCallback: HandleDefinitiveStartCallback = (data) => {
      if (!data.players) {
        return;
      }
      dispatch(setPlayers(data.players));
      dispatch(setMainPlayerIndex(data.players));
    }
    registerLobbyHandlers(
      playersChangeCallback,
      startResponseCallback,
      definitiveStartCallback
    );
    return unregisterLobbyHandlers;
  }, [])

  const [modalMessage, setModalMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [isShowingModal, toggleModal] = useModal();
  const lobby: LobbyState = useSelector(
    (state: RootState) => {
      return state.lobby;
    }
  );
  console.log({lobby});
  const playerRows = [];
  let firstPlayerUserID = null;
  let playerSelf = null;
  for (const player of lobby.players ?? []) {
    if (!player.connected) {
      continue;
    }
    if (firstPlayerUserID === null) {
      firstPlayerUserID = player.userID;
    }
    if (player.userID === lobby.userID) {
      playerSelf = player;
    }
    const h2class = player.userID === lobby.userID ? 'player-self' : '';
    playerRows.push(
    <div key={player.userID} className="player-row">
      <h2 className={h2class}>{player.username}</h2>
      <div className="status">
        {player.ready ? 'Ready' : 'Not ready'}
      </div>
    </div>
   )
  }
  const canStart = firstPlayerUserID === lobby.userID;
  const startButton = <button
    id="start" 
    className="start-button"
    disabled={saving}
    onClick={() => {
      socket.emit(START);
      setSaving(true);
    }}
  >
    Start
  </button>
  const readyButton = <button
    id="ready" 
    className="ready-button"
    disabled={saving}
    onClick={() => {
      socket.emit(READY_CHANGE);
    }}
  >
    {!playerSelf?.ready ? 'Ready' : 'Not ready'}
  </button>
  return (
    <>
      <Modal show={isShowingModal} onCloseButtonClick={toggleModal} message={modalMessage} />
      <div className="lobby-body">
        <div className="lobby-container">
          <div className="lobby-info">
            <h1 className="lobby-title">Lobby</h1>
          </div>
          <div className="lobby-players" id="lobby-players">
            {playerRows}
          </div>
          <div id="button-section" className="buttons">
            {canStart ? startButton : null}
            {readyButton}
          </div>
        </div>
      </div>
    </>
  );
}