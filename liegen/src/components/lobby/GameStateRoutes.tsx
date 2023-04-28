import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { initialState } from '../../types/redux/gameState';
import { RootState } from '../../store';

const GameStateRoutes = () => {
  const gameState: initialState  = useSelector(
    (state: RootState) => {
      return state.gameState;
    }
  );
  const location = useLocation();
  let navigateTo = '/';
  if (gameState.connectedWithServer && gameState.gameData?.playingGame && gameState.userData?.sessionID) {
    navigateTo = '/game';
  } else if (gameState.connectedWithServer && gameState.userData?.sessionID) {
    navigateTo = '/lobby';
  } else if (!gameState.connectedWithServer && !gameState.userData?.sessionID) {
    navigateTo = '/';
  }
  return (
      navigateTo === location.pathname ? <Outlet/> : <Navigate to={navigateTo}/>
  )
}

export default GameStateRoutes;