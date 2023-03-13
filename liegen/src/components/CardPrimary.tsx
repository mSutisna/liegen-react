import { motion } from 'framer-motion';
import { createCardName } from '../utilities/card-helper-functions';

import { useDispatch } from 'react-redux';
import { toggleCardSelected } from '../slices/gameSlice';

interface CardProps {
  url: string,
  width: number,
  height: number,
  left: number,
  top: number,
  startLeft: number,
  startTop: number,
  delay: number,
  rank: string,
  suit: string,
  selected: boolean,
  faceDown: boolean
}

function CardPrimary({url, width, height, left, top, startLeft, startTop, delay, rank, suit, selected, faceDown }: CardProps) {
  const dispatch = useDispatch();
  const cardName = createCardName(suit, rank);
  let className = 'card';
  let finalTop = top;
  if (selected) {
    className += ' selected';
    finalTop -= 10;
  }
  return (
    <motion.img 
      src={url} 
      onClick={() => dispatch(toggleCardSelected(cardName))}
      className={className}
      style={{
        width,
        height,
        left,
        top: finalTop
      }}
      // initial={{
      //   x: startLeft,
      //   y: startTop
      // }}
      // animate={{
      //   x: 0,
      //   y: 0
      // }} 
      animate={{
        x: [startLeft, 0],
        y: [startTop, 0]
      }}
      transition={{
        delay,
        default: { ease: "linear" }
      }}
    />
  )
}

export default CardPrimary;