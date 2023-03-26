import { motion } from 'framer-motion';
import { createCardName } from '../utilities/card-helper-functions';

import { useDispatch } from 'react-redux';
import { toggleCardSelected, setCardReceivedAnimationFinished } from '../slices/gameSlice';

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
  receiveAnimationFinished: boolean
}

function CardPrimary({url, width, height, startLeft, startTop, delay, rank, suit, selected, playerIndex, cardIndex, receiveAnimationFinished }: CardProps) {
  const dispatch = useDispatch();
  const cardName = createCardName(suit, rank);
  let className = 'card';
  if (selected) {
    className += ' selected';
  }
  const initial = !receiveAnimationFinished
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
      onAnimationComplete={() => {
        dispatch(setCardReceivedAnimationFinished({playerIndex, cardIndex}))
      }}
    />
  )
}

export default CardPrimary;