import { useState, useEffect } from "react";
import useModal from '../../custom-hooks/useModal';
import { REGISTER } from "../../types/pages/enter-username";
import { registerEnterUsernameHandlers, unregisterEnterUsernameHandlers } from "../../register-socket-handlers/enter-username";
import { setUserID, setPlayers } from "../../slices/lobbySlice";
import Modal from "./Modal";
import { useDispatch } from "react-redux";
import { 
  HandleRegisterCallbackSuccessType, 
  HandleErrorType, 
  HandleContinueToLobby, 
  HandleContinueToGame 
} from "../../register-socket-handlers/enter-username";
import socket from "../../utilities/Socket";

export default function EnterUsername() {
  const dispatch = useDispatch();
  useEffect(() => {
    const handleSuccess: HandleRegisterCallbackSuccessType = (data) => {
      dispatch(setUserID(data.userID));
      dispatch(setPlayers(data.players));
    }
    const handleError: HandleErrorType = (error) => {
      setModalMessage(error);
      toggleModal();
      setSaving(false);
    }
    const handleContinueToLobby: HandleContinueToLobby = (data) => {
      console.log({data});
      dispatch(setUserID(data.userID));
      dispatch(setPlayers(data.players));
    }
    const handleContinueToGame: HandleContinueToGame = () => {

    }
  
    registerEnterUsernameHandlers(
      handleSuccess, 
      handleError, 
      handleContinueToLobby,
      handleContinueToGame
    )
    return unregisterEnterUsernameHandlers;
  }, [])

  const [username, setUsername] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [isShowingModal, toggleModal] = useModal();

  return (
    <>
      <Modal show={isShowingModal} onCloseButtonClick={toggleModal} message={modalMessage} />
      <div className="enter-username">
        <h1 className="title">Liegen Lobby</h1>
        <h2 className="sub-title">Enter a username</h2>
        <div className="container">
          <input 
            type="text" 
            id="username" 
            className="username-input" 
            placeholder="username" 
            value={username} 
            autoComplete="off"
            disabled={saving}
            onChange={e => setUsername(e.target.value)}  
          />
          <button 
            id="submit" 
            className="submit-button"
            disabled={saving}
            onClick={() => {
              if (!username) {
                setModalMessage('Username can\'t be empty.');
                toggleModal();
                return;
              }
              setSaving(true);
              socket.emit(REGISTER, {
                username
              })
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </>
  )
}