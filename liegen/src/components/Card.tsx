import { motion } from 'framer-motion';

import { useDispatch } from "react-redux";
import {
  setCardReceivedAnimationFinished
} from "../slices/gameSlice";

interface CardProps {
  url: string,
  width: number,
  height: number,
  startLeft: number,
  startTop: number,
  delay: number,
  receiveAnimationFinished: boolean,
  playerIndex: number,
  cardIndex: number
}

function Card({url, width, height, startLeft, startTop, delay, receiveAnimationFinished, playerIndex, cardIndex }: CardProps) {
  const dispatch = useDispatch();
  const initial = !receiveAnimationFinished
    ? {
      x: startLeft,
      y: startTop
    } : false;
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
      onAnimationComplete={() => {
        dispatch(setCardReceivedAnimationFinished({playerIndex, cardIndex}))
      }}
    />
  )
}

export default Card;