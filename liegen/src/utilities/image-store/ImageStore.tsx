import { getImageUrls } from './image-urls';

const cardWidth = 170;
const cardHeight = 255;

function cardDimensions(size = 1) {
  return {
    width: cardWidth * size,
    height: cardHeight * size
  }
}

export function setCardDimensions(cardElement: HTMLElement, size: number) {
  const dimensions = cardDimensions(size);
  cardElement.style.height = `${dimensions.height}px`;
  cardElement.style.width = `${dimensions.width}px`;
}

export default class ImageStore {
  cards: {[k: string]: HTMLElement};
  constructor() {
    this.cards = {};
  }
  async init() {
    await this.loadCardImages(this);
  }

  async loadCardImages(self: ImageStore) {
    if (Object.keys(self.cards).length > 0) {
      return;
    }
    const promiseArray = []; // create an array for promises
    const cardImagesObject : {[k: string]: HTMLElement} = {}; // array for the images
    const imageUrls = await getImageUrls();
    const dimensions = cardDimensions(0.5);
    for (const [key, imageUrl] of Object.entries(imageUrls)) {
      promiseArray.push(
        new Promise<void>((resolve) => {
          const img = new Image();
          img.className = 'card-size';
          img.onload = () => {
            const img = document.createElement('img');
            img.src = imageUrl;
            cardImagesObject[key] = img;
            resolve();
          };
          img.src = imageUrl;
        })
      );
    }

    await Promise.all(promiseArray); // wait for all the images to be loaded
    self.cards = cardImagesObject;
  }

  retrieveCardElement(cardKey: string) {
    if (!this.cards[cardKey]) {
      throw Error(`Key '${cardKey}' doesn't exist!`)
    }
    return this.cards[cardKey].cloneNode(true);
  }

  getCards() {
    return this.cards;
  }
}
