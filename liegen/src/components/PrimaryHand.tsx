import { HandProps } from '../types/props';
import { determinePositionCoordinates } from '../utilities/player-position-determination';
import { DESKTOP_PRIMARY_HAND_WIDTH, DESKTOP_PRIMARY_HAND_HEIGHT, DESKTOP_CARD_WIDTH, DESKTOP_CARD_HEIGHT } from '../constants';
import { getImageUrls } from '../utilities/image-store/image-urls';
import { createCardName } from '../utilities/card-helper-functions';
import Card from '../components/Card';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion'
import { determineXandYForCard } from '../utilities/card-position-determination';

function PrimaryHand({name, index, amountOfPlayers, gameWidth, gameHeight, cards} : HandProps) {
  const [cardUrls, setCardUrls] = useState<{[k: string]: string}>({});
  useEffect(() => {
    const setImageUrls = async () => {
      const imageUrls = await getImageUrls();
      setCardUrls(imageUrls);
    }
    setImageUrls();
  }, []);
  const position = determinePositionCoordinates(
    index,
    amountOfPlayers,
    gameWidth,
    gameHeight,
    DESKTOP_PRIMARY_HAND_WIDTH,
    DESKTOP_PRIMARY_HAND_HEIGHT
  )
  const style = {
    ...position,
    width: DESKTOP_PRIMARY_HAND_WIDTH,
    height: DESKTOP_PRIMARY_HAND_HEIGHT
  }
  const scale = 0.35;
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className="primary-hand" style={style}>
      {name}
      <motion.div
        ref={ref}
        className="cards"
      >
        {cards.map((card, index) => {
          const cardKey = createCardName(card.suit ?? '', card.rank ?? '')
          if (!cardUrls[cardKey]) {
            return null;
          }
          let containerX = 0;
          let containerY = 0;
          if (ref.current) {
            const position = ref.current.getBoundingClientRect();
            containerX = position.left;
            containerY = position.top;
          }
          const offsetData = determineXandYForCard(cards, index, scale);
          const left = offsetData.x;
          const top = offsetData.y;
          const delay = 0.02 + (0.06 * index);

          return <Card
            key={`cardIndex-${index}`}
            url={cardUrls[cardKey]}
            width={DESKTOP_CARD_WIDTH * scale}
            height={DESKTOP_CARD_HEIGHT * scale}
            left={left}
            top={top}
            startLeft={-containerX - left}
            startTop={-containerY - top}
            delay={delay}
          />
        })}
      </motion.div>
    </div>
  )
}

export default PrimaryHand;