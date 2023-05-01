// import React, { useEffect, useState } from 'react';
// import socket, { establishSocketConnection } from '../../utilities/Socket';
// import { setUserData, setGameData } from '../../slices/lobbySlice';
// import Modal from './Modal';
// import useModal from '../../custom-hooks/useModal';
// import { useSelector, useDispatch } from 'react-redux'
// import { RootState } from '../../store';
// import { initialState } from '../../types/redux/lobby';
// import { toggleModal, setModalMessage, setSaving, setUserDataDispatch, setGameDataDispatch } from '../../types/props';
// import { checkStore } from '../../utilities/game-state-functions';
// import { InitGameData } from '../../types/models';

// const registerCallback = (
//   toggleModal: toggleModal, 
//   setModalMessage: setModalMessage, 
//   setSaving: setSaving, 
//   setUserDataDispatch: setUserDataDispatch,
//   setGameDataDispatch: setGameDataDispatch,
//   data: {
//     code: string, 
//     error: string, 
//     removeSessionId: boolean,
//     userData: {},
//     gameData: InitGameData
//   }
// ) => {
//   if (data.code === 'continue') {
//     setUserDataDispatch(data.userData);
//     setGameDataDispatch(data.gameData);
//   } else if (data.error) {
//     if (data.removeSessionId) {
//       sessionStorage.removeItem('sessionID');
//     }
//     setModalMessage(data.error);
//     toggleModal();
//     setSaving(false);
//   }
// }

// const continueGame = (data: {userData: {}, gameData: InitGameData}, setUserDataDispatch: setUserDataDispatch, setGameDataDispatch: setGameDataDispatch) => {
//   setUserDataDispatch(data.userData);
//   setGameDataDispatch(data.gameData);
// }

// function registerSocketListeners(
//   toggleModal: toggleModal,
//   modalMessage: setModalMessage,
//   setSaving: setSaving,
//   setUserDataDispatch: setUserDataDispatch,
//   setGameDataDispatch: setGameDataDispatch
// ) {
//   socket.on('registerCallback', data => registerCallback(
//     toggleModal,
//     modalMessage,
//     setSaving,
//     setUserDataDispatch,
//     setGameDataDispatch,
//     data
//   ));
//   socket.on('continueGame', data => continueGame(
//     data,
//     setUserDataDispatch,
//     setGameDataDispatch,
//   ));
// }

// function deregisterSocketListeners() {
//   socket.off('registerCallback');
//   socket.off('continueGame');
// }

// export default function EnterUsername() {
//   const dispatch = useDispatch();
//   const setUserDataDispatch = (data: {}) => {
//     dispatch(setUserData(data));
//   }
//   const setGameDataDispatch = (data: {}) => {
//     dispatch(setGameData(data));
//   }
//   const [username, setUsername] = useState('');
//   const [modalMessage, setModalMessage] = useState('');
//   const [saving, setSaving] = useState(false);
//   const [isShowingModal, toggleModal] = useModal();

//   const gameState: initialState  = useSelector(
//     (state: RootState) => {
//       return state.gameState;
//     }
//   );

//   useEffect(() => {
//     registerSocketListeners(
//       toggleModal,
//       setModalMessage,
//       setSaving,
//       setUserDataDispatch,
//       setGameDataDispatch
//     );
//     establishSocketConnection();
//     socket.emit('enterUsernameLoaded')
//     checkStore();
//     return () => {
//       deregisterSocketListeners();
//     }
//   }, []);
  

//   return (
//     <>
//       <Modal show={isShowingModal} onCloseButtonClick={toggleModal} message={modalMessage} />
//       <div className="enter-username">
//         <h1 className="title">Liegen Lobby</h1>
//         <h2 className="sub-title">Enter a username</h2>
//         <div className="container">
//           <input 
//             type="text" 
//             id="username" 
//             className="username-input" 
//             placeholder="username" 
//             value={username} 
//             autoComplete="off"
//             disabled={saving}
//             onChange={e => setUsername(e.target.value)}  
//           />
//           <button 
//             id="submit" 
//             className="submit-button"
//             disabled={saving}
//             onClick={() => {
//               if (!username) {
//                 setModalMessage('Username can\'t be empty.');
//                 toggleModal();
//                 return;
//               }
//               setSaving(true);
//               socket.emit('register', {
//                 username
//               })
//             }}
//           >
//             Submit
//           </button>
//         </div>
//       </div>
//     </>
//   )
// }

export default null;