import { motion } from 'framer-motion';
import { createCardName } from '../utilities/card-helper-functions';

import { useDispatch } from 'react-redux';
import { toggleCardSelected, setCardReceivedAnimationStatus } from '../slices/gameSlice';
import { AnimationStatus } from '../types/models';

interface CardProps {
  url: string,
  width: number,
  height: number,
  startLeft: number,
  startTop: number,
  delay: number,
  rank: string,
  suit: string,
  selected: boolean,
  faceDown: boolean,
  playerIndex: number,
  cardIndex: number,
  receiveAnimationStatus: AnimationStatus
}

function CardPrimary({url, width, height, startLeft, startTop, delay, rank, suit, selected, playerIndex, cardIndex, receiveAnimationStatus }: CardProps) {
  const dispatch = useDispatch();
  const cardName = createCardName(suit, rank);
  let className = 'card';
  if (selected) {
    className += ' selected';
  }
  const initial = receiveAnimationStatus === AnimationStatus.IDLE
    ? {
      x: startLeft,
      y: startTop
    } : false;
  return (
    <motion.img 
      src={url} 
      onClick={() => dispatch(toggleCardSelected(cardName))}
      className={className}
      style={{
        width,
        height,
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

export default CardPrimary;