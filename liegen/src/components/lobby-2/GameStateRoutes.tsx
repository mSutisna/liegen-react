import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { LobbyState } from '../../types/redux/lobby';
import { RootState } from '../../store';

const GameStateRoutes = () => {
  const lobbyState: LobbyState  = useSelector(
    (state: RootState) => {
      return state.lobby;
    }
  );
  const location = useLocation();
  let navigateTo = '/';
  // if (gameState.gameData?.playingGame && gameState.connectedWithServer && gameState.userData?.sessionID) {
  //   navigateTo = '/game';
  if (lobbyState.userID) {
    navigateTo = '/lobby';
  } else if (!lobbyState.userID) {
    navigateTo = '/';
  }
  return (
      navigateTo === location.pathname ? <Outlet/> : <Navigate to={navigateTo}/>
  )
}

export default GameStateRoutes;