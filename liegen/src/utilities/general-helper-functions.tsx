import { MiddleInterface, PlayerInterface, SetInterface, PrimaryPlayerViewInterface } from "../types/models";

export const determineSetIsALieAndGetIndexes = (middle: MiddleInterface) : {
  playerToWinSetIndex: number,
  playerToLoseSetIndex: number,
  setIsALie: boolean,
} | null => {
  if (!middle.set || !middle.playerToCallBust) {
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

export const createPlayersView = (players: Array<PlayerInterface>, currentPlayerIndex: number) : Array<PrimaryPlayerViewInterface> => {
  if (players.length === 0) {
    return [];
  }
  let realIndexes : {[k: string]: number} = {};
  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    realIndexes[player.name] = i;
  }
  const endIndex = players.length - 1;
  let iterationIndex = currentPlayerIndex;
  let playersArray = [];
  do {
    const player = JSON.parse(JSON.stringify(players[iterationIndex])) as PrimaryPlayerViewInterface;
    player.index = realIndexes[player.name];
    playersArray.push(player)
    iterationIndex -= 1;
    if (iterationIndex < 0) {
      iterationIndex = endIndex;
    }
  } while (iterationIndex !== currentPlayerIndex);
  return playersArray;
}