import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setPlayers, setGameData } from '../../slices/gameStateSlice';
import socket from '../../utilities/Socket';
import Modal from './Modal';
import useModal from '../../custom-hooks/useModal';
import { toggleModal, setModalMessage, setSaving, setPlayersDataDispatch, setGameDataDispatch } from '../../types/props';
import { initialState } from '../../types/redux/gameState';
import { RootState } from '../../store';

const playersChange = (data: {players: []}, setPlayersDispatch: (players: []) => void) => {
  setPlayersDispatch(data.players);
}

const startGame = (
  data: {
    error: string,
    gameData: {}
  }, 
  setGameDataDispatch: setGameDataDispatch,
  setModalMessage: setModalMessage, 
  setSaving: setSaving, 
  toggleModal: toggleModal
) => {
  if (data.error) {
    setModalMessage(data.error);
    setSaving(false)
    toggleModal();
    return;
  }
  setGameDataDispatch(data.gameData)
}

const registerSocketListeners = (
  setModalMessage: setModalMessage,
  setSaving: setSaving,
  toggleModal: toggleModal,
  setPlayersDispatch: setPlayersDataDispatch,
  setGameDataDispatch: setGameDataDispatch
) => {
  socket.on('playersChange', data => playersChange(
    data, 
    setPlayersDispatch
  ))
  socket.on('startGame', data => startGame(
    data, 
    setGameDataDispatch, 
    setModalMessage, 
    setSaving, 
    toggleModal
  ))
}

const deregisterSocketListeners = () => {
  socket.off('playersChange')
  socket.off('startGame')
}

export default function Lobby() {
  const [modalMessage, setModalMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [isShowingModal, toggleModal] = useModal();
  const dispatch = useDispatch();
  const setPlayersDispatch = (players: {}) => {
    dispatch(setPlayers(players));
  }
  const setGameDataDispatch = (data: {}) => {
    dispatch(setGameData(data))
  }

  useEffect(() => {
    registerSocketListeners(
      setModalMessage,
      setSaving,
      toggleModal,
      setPlayersDispatch, 
      setGameDataDispatch
    );
    return () => {
      deregisterSocketListeners();
    }
  }, []);

  const gameState: initialState = useSelector(
    (state: RootState) => {
      return state.gameState;
    }
  );
  const playerRows = [];
  let firstPlayerUserID = null;
  let playerSelf = null;
  for (const player of gameState.gameData?.players ?? []) {
    if (!player.connected) {
      continue;
    }
    if (firstPlayerUserID === null) {
      firstPlayerUserID = player.userID;
    }
    if (player.userID === gameState.userData?.userID) {
      playerSelf = player;
    }
    const h2class = player.userID === gameState.userData?.userID ? 'player-self' : '';
    playerRows.push(
    <div key={player.userID} className="player-row">
      <h2 className={h2class}>{player.username}</h2>
      <div className="status">
        {player.ready ? 'Ready' : 'Not ready'}
      </div>
    </div>
   )
  }
  const canStart = firstPlayerUserID === gameState.userData?.userID;
  const startButton = <button
    id="start" 
    className="start-button"
    disabled={saving}
    onClick={() => {
      socket.emit('start');
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
      socket.emit('ready');
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
            <h1 className="lobby-title">CoolLobby</h1>
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