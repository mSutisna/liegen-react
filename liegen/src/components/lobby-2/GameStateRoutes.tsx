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
  if (lobbyState.userID && lobbyState.gameStarted) {
    navigateTo = '/game';
  } else if (lobbyState.userID) {
    navigateTo = '/lobby';
  }
  return (navigateTo === location.pathname ? <Outlet/> : <Navigate to={navigateTo}/>)
}

export default GameStateRoutes;