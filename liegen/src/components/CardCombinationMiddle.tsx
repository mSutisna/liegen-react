interface CardCombinationMiddleProps {
  supposedCardUrl: string,
  realCardUrl: string,
  cardsWidth: number,
  cardsHeight: number,
  refs: {
    supposedCardRef: React.RefObject<HTMLImageElement>
    realCardRef: React.RefObject<HTMLImageElement>
  }
}

function CardCombinationMiddle({supposedCardUrl, realCardUrl, cardsWidth, cardsHeight, refs }: CardCombinationMiddleProps) {
  return (
    <div className="middle-cards-container">
      <img 
        ref={refs?.supposedCardRef ?? null}
        src={supposedCardUrl} 
        className="card"
        style={{
          width: cardsWidth,
          height: cardsHeight
        }}
      />
      <img
        ref={refs?.realCardRef ?? null}
        src={realCardUrl} 
        className="card"
        style={{
          width: cardsWidth,
          height: cardsHeight
        }}
      />
    </div>
  )
}

export default CardCombinationMiddle;