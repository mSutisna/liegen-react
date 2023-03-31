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
  originPoint: Point | null,
  delay: number,
  receiveAnimationStatus: AnimationStatus,
  playerIndex: number,
  cardIndex: number
}

function Card({url, width, height, originPoint, delay, receiveAnimationStatus, playerIndex, cardIndex }: CardProps) {
  const dispatch = useDispatch();
  let initial : Point | false = false;
  if (originPoint) {
    initial = receiveAnimationStatus === AnimationStatus.IDLE
    ? originPoint : false;
  }
  return (
    <motion.img 
      src={url} 
      className={'card'}
      style={{
        width,
        height
      }}
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
    />
  )
}

export default Card;