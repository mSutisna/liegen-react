export function determinePositionCoordinates(
  positionIndex: number, 
  playerAmount: number, 
  gameWidth: number, 
  gameHeight: number,
  handWidth: number,
  handHeight: number
) : {
  [k: string]: number
} {
  switch (playerAmount) {
    case 2:
      return twoPlayersPositionDetermination(positionIndex, gameWidth, gameHeight, handWidth, handHeight);
    case 3:
      return threePlayersPositionDetermination(positionIndex, gameWidth, gameHeight, handWidth, handHeight);
    case 4:
      return fourPlayersPositionDetermination(positionIndex, gameWidth, gameHeight, handWidth, handHeight);
    default:
      throw new Error(`Invalid amount of players: ${playerAmount}`)
  }
}

function twoPlayersPositionDetermination(
  positionIndex: number, 
  gameWidth: number, 
  gameHeight: number, 
  handWidth: number, 
  handHeight: number
) : {
  [k: string]: number
} {
  switch (positionIndex) {
    case 0:
      return {
        left: (gameWidth / 2) - (handWidth / 2),
        bottom: 40
      }
    case 1:
      return {
        left: (gameWidth / 2) - (handWidth / 2),
        top: 40
      }
    default:
      throw new Error(`Invalid player position: ${positionIndex}`)
  }
}

function threePlayersPositionDetermination(
  positionIndex: number, 
  gameWidth: number, 
  gameHeight: number, 
  handWidth: number, 
  handHeight: number
) : {
  [k: string]: number
} {
  switch (positionIndex) {
    case 0:
      return {
        left: (gameWidth / 2) - (handWidth / 2),
        bottom: 40
      }
    case 1:
      return {
        left: (gameWidth / 2) - (handWidth / 2) - 200,
        top: 40
      }
    case 2:
      return {
        left: (gameWidth / 2) - (handWidth / 2) + 200,
        top: 40
      }
    default:
      throw new Error(`Invalid player position: ${positionIndex}`)
  }
}

function fourPlayersPositionDetermination(
  positionIndex: number, 
  gameWidth: number, 
  gameHeight: number, 
  handWidth: number, 
  handHeight: number
) : {
  [k: string]: number
} {
  switch (positionIndex) {
    case 0:
      return {
        left: (gameWidth / 2) - (handWidth / 2),
        bottom: 40
      }
    case 1:
      return {
        left: 40,
        bottom: (gameHeight / 2) - (handHeight / 2)
      }
    case 2:
      return {
        left: (gameWidth / 2) - (handWidth / 2),
        top: 40
      }
    case 3:
      return {
        right: 40,
        bottom: (gameHeight / 2) - (handHeight / 2)
      }
    default:
      throw new Error(`Invalid player position: ${positionIndex}`)
  }
}