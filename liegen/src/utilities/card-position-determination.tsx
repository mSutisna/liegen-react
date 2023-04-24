import { DESKTOP_CARD_HEIGHT, DESKTOP_CARD_WIDTH, DESKTOP_CARD_GUTTER_SIZE, GridOrientation, GridItemType } from "../constants";
import { BaseCardInterface, CardForPlayerInterface, CardPosition } from "../types/models";

export interface CardOffsetData {
  x: number,
  y: number,
  depth: number
}

export function determineXandYForCard(
  cards : Array<BaseCardInterface>, 
  index : number,
  scale : number
) {
  const cardWidth = DESKTOP_CARD_WIDTH * scale;
  const cardHeight = DESKTOP_CARD_HEIGHT * scale;
  const gutterSize = DESKTOP_CARD_GUTTER_SIZE * scale;
  const maxRows = Math.ceil(cards.length / 5);
  const currentRow = Math.floor(index / 5);
  const currentColumn = index % 5;
  let cardsWithGutter = cards.length - 1;
  if (cardsWithGutter > 4) {
    cardsWithGutter = 4;
  }
  const width = cardWidth + (cardsWithGutter * gutterSize);
  let xOffset = currentColumn * gutterSize;
  // if (cards.length - 1) {
  //   xOffset -= width / 2;
  // }
  // if (cards.length > 1) {
  //   xOffset += (cardWidth / 2);
  // }
  const offsetYGutterSize = 50;
  let yOffset = 0;
  if (maxRows > 1) {
    yOffset = (currentRow * offsetYGutterSize) / 2;
  }
  return {
    x: xOffset,
    y: yOffset,
    depth: currentRow
  }
}

export function determineGridPositionsForCards(
  rows: number,
  columns: number,
  rowOrientation:  GridOrientation = GridOrientation.REGULAR,
  columnOrientation: GridOrientation = GridOrientation.REGULAR,
  gridFillOrder: GridItemType = GridItemType.ROW,
) : Array<CardPosition> {

  let positions : Array<CardPosition> = [];

  const execution = (type: GridItemType, size: number, addPosition: boolean = true) : void => {
    if (addPosition) {
      positions.push({row, column})
    }
    if (type === GridItemType.ROW) {
      if (rowOrientation === GridOrientation.REGULAR) {
        const condition = gridFillOrder === GridItemType.ROW
          ? row === rows
          : row === columns;
        if (condition) {
          row = 1;
          return;
        }
        row++;
      } else if (rowOrientation === GridOrientation.REVERSE) {
        if (row === 1) {
          row = gridFillOrder === GridItemType.ROW
            ? rows
            : columns;
          return;
        }
        row--;
      }
    } else if (type === GridItemType.COLUMN) {
      if (columnOrientation === GridOrientation.REGULAR) {
        const condition = gridFillOrder === GridItemType.ROW
          ? column === columns
          : column === rows;
        if (condition) {
          column = 1;
          return;
        }
        column++;
      } else if (columnOrientation === GridOrientation.REVERSE) {
        if (column === 1) {
          column = gridFillOrder === GridItemType.ROW
            ? columns
            : rows;
          return;
        }
        column--;
      // if (columnOrientation === GridOrientation.REGULAR) {
      //   const realSizeEnd = size - 1;
      //   const condition = column === realSizeEnd;
      //   if (condition) {
      //     column = 0;
      //     return;
      //   }
      //   column++;
      // } else if (columnOrientation === GridOrientation.REVERSE) {
      //   if (column === 0) {
      //     column = size - 1
      //     return;
      //   }
      //   column--;
      }
    }
  }

  let firstFunction = (extraExecution: (() => void) | null = null) => {};
  let secondFunction = (extraExecution: (() => void) | null = null) => {};

  let row = 1;
  let column = 1;
  if (rowOrientation === GridOrientation.REVERSE) {
    row = gridFillOrder === GridItemType.ROW
      ? rows
      : columns;
  }
  if (columnOrientation === GridOrientation.REVERSE) {
    column = gridFillOrder === GridItemType.ROW
      ? columns
      : rows;
  }

  if (gridFillOrder === GridItemType.ROW) {
    firstFunction = createExecutionFunction(GridItemType.ROW, rowOrientation, rows, execution, false);
    secondFunction = createExecutionFunction(GridItemType.COLUMN, columnOrientation, columns, execution, true);
  } else if (gridFillOrder === GridItemType.COLUMN) {
    firstFunction = createExecutionFunction(GridItemType.COLUMN, rowOrientation, rows, execution, false);
    secondFunction = createExecutionFunction(GridItemType.ROW, columnOrientation, columns, execution, true);
    // firstFunction = createExecutionFunction(GridItemType.COLUMN, columnOrientation, columns, execution, false);
    // secondFunction = createExecutionFunction(GridItemType.ROW, rowOrientation, rows, execution, true);
  }

  firstFunction(secondFunction);

  return positions;
}

const createExecutionFunction = (type: GridItemType, orientation: GridOrientation, size: number, execution: (type: GridItemType, size: number, addPosition: boolean) => void, addPosition: boolean) => {
  switch (orientation) {
    case GridOrientation.REGULAR:
      return (extraExecution: (() => void) | null = null) => forLoop(size, type, execution, extraExecution, addPosition)
    case GridOrientation.REVERSE:
      return (extraExecution: (() => void) | null = null) => reverseForLoop(size, type, execution, extraExecution, addPosition)
  }
}

const forLoop = (size: number, type: GridItemType, execution: (type: GridItemType, size: number, addPosition: boolean) => void, extraExecution: (() => void) | null = null, addPosition : boolean) => {
  for (let i = 1; i <= size; i++) {
    if (typeof extraExecution === 'function') {
      extraExecution();
    }
    execution(type, size, addPosition);
  }
}

const reverseForLoop = (size: number, type: GridItemType, execution: (type: GridItemType, size: number, addPosition: boolean) => void, extraExecution: (() => void) | null = null, addPosition : boolean) => {
  for (let i = size; i >= 1; i--) {
    if (typeof extraExecution === 'function') {
      extraExecution();
    }
    execution(type, size, addPosition);
  }
}


