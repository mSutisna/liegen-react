import { useState, useRef, useEffect } from "react"
import { getImageUrls } from './utilities/image-store/image-urls';

function App3() {
  const [cardUrls, setCardUrls] = useState<{[k: string]: {
    regular: string,
    mobile: string
  }}>({});
  useEffect(() => {
    const setImageUrls = async () => {
      const imageUrls = await getImageUrls();
      setCardUrls(imageUrls);
    }
    setImageUrls();
  }, []);


  const [top, setTop] = useState(['Hearts-4', 'Hearts-5', 'Hearts-6']);
  const [bottom, setBottom] = useState(['Diamonds-A', 'Diamonds-2', 'Diamonds-3']);
  const [transition, setTransition] = useState<{
    item: string | null,
    startTop: number,
    startAnim: boolean
  }>({
    item: null,
    startTop: 0,
    startAnim: true
  })

  const topListRef = useRef<HTMLDivElement>(null);
  const bottomListRef = useRef<HTMLDivElement>(null);

  const moveDown = (item: string, evt: React.MouseEvent) => {
    const bottomList = bottomListRef.current;
    const topList = topListRef.current;
    if (!bottomList || !topList) {
      return;
    }
    const listBottom = bottomList.offsetTop + bottomList.clientHeight;
    const target = evt.target as HTMLDivElement;
    const itemTop = (target.offsetTop - listBottom) + topList.offsetTop;
    const newTransition = {...transition};
    newTransition.item = item;
    newTransition.startTop = itemTop;
    newTransition.startAnim = false;
    setTop(top.filter(x => x !== item));
    setBottom([...bottom, item])
    setTransition(newTransition)
    setTimeout(() => resetState(), 100);
  }

  const moveUp = (item : string, evt: React.MouseEvent) => {
    const bottomList = bottomListRef.current;
    const topList = topListRef.current;
    if (!bottomList || !topList) {
      return;
    }
    const listBottom = topList.offsetTop + topList.clientHeight;
    const target = evt.target as HTMLDivElement;
    const itemTop = target.offsetTop - listBottom;
    const newTransition = {...transition};
    newTransition.item = item;
    newTransition.startTop = itemTop;
    newTransition.startAnim = false;
    setTop([...top, item]);
    setBottom(bottom.filter(x => x !== item))
    setTransition(newTransition)
    setTimeout(() => resetState(), 500);
  }

  const resetState = () => {
    const newTransition = {...transition};
    newTransition.startAnim = true;
    setTransition(newTransition);
  }
  
  return (
    <div className="container">
      <div ref={topListRef}>
        {top.map((item) => {
          const startTop = transition.item === item ? transition.startTop : 0;
          const animClass = transition.startAnim ? 'item-force-move' : '';
          const style = {
            transform: `translateY(${startTop}px)`,
          }
          return (
            <img 
              src={cardUrls[item].regular}
              className={`item item-top card ${animClass}`}
              onClick={(evt) => moveDown(item, evt)}
              style={style}
            />
          )
        })}
      </div>
      <div ref={bottomListRef}>
        {bottom.map((item) => {
          const startTop = transition.item === item ? transition.startTop : 0;
          const animClass = transition.startAnim ? 'item-force-move' : '';
          const style = {
            transform: `translateY(${startTop}px)`,
          }
          return (
            <img 
              src={cardUrls[item].regular}
              className={`item item-bottom ${animClass}`}
              onClick={(evt) => moveUp(item, evt)}
              style={style}
            />
          )
        })}
      </div>
    </div>
  )
}

export default App3;