import { Routes, Route } from 'react-router-dom';
import ErrorPage from "./ErrorPage";
import EnterUsername from "./EnterUsername";
import GameStateRoutes from "./GameStateRoutes";
import Lobby from "./Lobby";
import Game from "./Game";

function Entry() {
  return (
    <Routes>
      <Route element={<GameStateRoutes/>}>
        <Route index element={<EnterUsername />} />
        <Route path="lobby" element={<Lobby />} />
        <Route path="game" element={<Game />} />
      </Route>
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  )
}

export default Entry;