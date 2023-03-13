import { motion } from 'framer-motion';


interface CardProps {
  url: string,
  width: number,
  height: number,
  left: number,
  top: number,
  xKeyFrames: Array<number>,
  yKeyFrames: Array<number>,
  rank: string,
  suit: string,
  faceDown: boolean,
  delay: number,
}

function CardMiddle({url, width, height, left, top, xKeyFrames, yKeyFrames, delay}: CardProps) {
  console.log({xKeyFrames, yKeyFrames})
  return (
    <motion.img 
      src={url} 
      className={'card'}
      style={{
        width,
        height,
        left,
        top
      }}
      animate={{
        x: xKeyFrames,
        y: yKeyFrames
      }} 
      transition={{
        delay,
        default: { ease: "linear" }
      }}
    />
  )
}

export default CardMiddle;