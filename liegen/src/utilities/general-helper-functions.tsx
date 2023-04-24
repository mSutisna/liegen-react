import { MiddleInterface, PlayerInterface } from "../types/models";

export const determineSetIsALieAndGetIndexes = (middle: MiddleInterface) : {
  playerToWinSetIndex: number,
  playerToLoseSetIndex: number,
  setIsALie: boolean,
} | null => {
  if (!middle.set || middle.playerToCallBust === null) {
    return null;
  }
  let setIsALie = false;
  for (const card of middle.set.realCards) {
    if (card.rankIndex !== middle.set.rank) {
      setIsALie = true;
      break;
    }
  }
  if (setIsALie) {
    return {
      playerToWinSetIndex: middle.playerToCallBust,
      playerToLoseSetIndex: middle.set.playerIndex,
      setIsALie
    }
  } 
  return {
    playerToWinSetIndex: middle.set.playerIndex,
    playerToLoseSetIndex: middle.playerToCallBust,
    setIsALie
  }
}

export const createPlayersOrder = (players: Array<PlayerInterface>, currentPlayerIndex: number) : Array<number> => {
  if (players.length === 0) {
    return [];
  }
  const endIndex = players.length - 1;
  let iterationIndex = currentPlayerIndex;
  let playersOrder = [];
  do {
    playersOrder.push(iterationIndex)
    iterationIndex += 1;
    if (iterationIndex > endIndex) {
      iterationIndex = 0;
    }
  } while (iterationIndex !== currentPlayerIndex);
  return playersOrder;
}