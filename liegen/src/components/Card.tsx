import { motion } from 'framer-motion';

import { useDispatch } from "react-redux";
import {
  setCardReceivedAnimationStatus
} from "../slices/gameSlice";
import { AnimationStatus, Point } from '../types/models';

interface CardProps {
  url: string,
  width: number,
  height: number,
  cardPositions: Array<{row: number, column: number}>,
  originPoint: Point | null,
  delay: number,
  receiveAnimationStatus: AnimationStatus,
  playerIndex: number,
  cardIndex: number,
  fourPlayers: boolean,
}

function Card({url, width, height, cardPositions, originPoint, delay, receiveAnimationStatus, playerIndex, cardIndex, fourPlayers }: CardProps) {
  const dispatch = useDispatch();
  let initial : Point | false = false;
  if (originPoint) {
    initial = receiveAnimationStatus === AnimationStatus.IDLE
    ? originPoint : false;
  }
  let className = 'card';
  if (fourPlayers) {
    if ([1, 3].includes(playerIndex)) {
      className += ' rotated-card';
    }
    if (playerIndex === 1) {
      className += ' left';
    } else if (playerIndex === 3) {
      className += ' right';
    }
  }

  const position = cardPositions[cardIndex];
  let style : {gridRow?: string, gridColumn?: string} = {};
  if (position) {
    style.gridRow = `${position.row} / ${position.row}`;
    style.gridColumn = `${position.column} / ${position.column}`;
  }
  // console.log({initial})
  return (
    <motion.div 
      className={className}
      style={style}
      initial={initial}
      animate={{
        x: 0,
        y: 0
      }} 
      transition={{
        delay,
        default: { ease: "linear" }
      }}
      onAnimationStart={() => {
        dispatch(setCardReceivedAnimationStatus({playerIndex, cardIndex, status: AnimationStatus.RUNNING}))
      }}
      onAnimationComplete={() => {
        dispatch(setCardReceivedAnimationStatus({playerIndex, cardIndex, status: AnimationStatus.FINISHED}))
      }}
      >
        <img src={url} />
      </motion.div>
  )
}

export default Card;