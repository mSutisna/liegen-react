import { motion } from 'framer-motion';
import { createCardName } from '../../utilities/card-helper-functions';

import { useDispatch } from 'react-redux';
import { toggleCardSelected, setCardReceivedAnimationStatus } from '../../slices/gameSlice';
import { AnimationStatus, Point } from '../../types/models';

interface CardProps {
  url: string,
  originPoint: Point | null,
  delay: number,
  rank: string,
  suit: string,
  selected: boolean,
  faceDown: boolean,
  playerIndex: number,
  cardIndex: number,
  receiveAnimationStatus: AnimationStatus,
  indicateAmount: number | null,
  onClick: (() => void) | null
}

function CardPrimary({url, originPoint, delay, rank, suit, selected, playerIndex, cardIndex, receiveAnimationStatus, indicateAmount, onClick }: CardProps) {
  const dispatch = useDispatch();
  const cardName = createCardName(suit, rank);
  let className = 'card';
  if (selected) {
    className += ' selected';
  }
  let initial : Point | false = false;
  if (originPoint) {
    initial = receiveAnimationStatus === AnimationStatus.IDLE
    ? originPoint : false;
  }

  const inner = indicateAmount
    ? <div className="indicate-amount primary">
      <span className="plus">+</span><span className="amount">{indicateAmount}</span>
    </div>
    : <img src={url} />

  let cardOnClick = () => {
    dispatch(toggleCardSelected({cardName, playerIndex}))
  }
  if (onClick) {
    cardOnClick = onClick;
  }

  return (
    <motion.div
      onClick={e => {
        e.stopPropagation();
        cardOnClick();
      }}
      className={className}
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
      {inner}
    </motion.div>

    // <motion.img 
    //   src={url} 
    //   onClick={() => {
    //     dispatch(toggleCardSelected({cardName, playerIndex}))
    //   }}
    //   className={className}
    //   initial={initial}
    //   animate={{
    //     x: 0,
    //     y: 0
    //   }}
    //   transition={{
    //     delay,
    //     default: { ease: "linear" }
    //   }}
    //   onAnimationStart={() => {
    //     dispatch(setCardReceivedAnimationStatus({playerIndex, cardIndex, status: AnimationStatus.RUNNING}))
    //   }}
    //   onAnimationComplete={() => {
    //     dispatch(setCardReceivedAnimationStatus({playerIndex, cardIndex, status: AnimationStatus.FINISHED}))
    //   }}
    // />
  )
}

export default CardPrimary;