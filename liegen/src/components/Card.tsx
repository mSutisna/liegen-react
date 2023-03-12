import { motion } from 'framer-motion';

interface CardProps {
  url: string,
  width: number,
  height: number,
  left: number,
  top: number,
  startLeft: number,
  startTop: number,
  delay: number
}


function Card({url, width, height, left, top, startLeft, startTop, delay}: CardProps) {
  return (
    <motion.img 
      src={url} 
      className="card"
      style={{
        width,
        height,
        left,
        top
      }}
      initial={{
        x: startLeft,
        y: startTop
      }}
      animate={{
        x: 0,
        y: 0
      }} 
      transition={{
        delay,
        default: { ease: "linear" }
      }}
    />
  )
}

export default Card;