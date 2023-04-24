import { createCardNames } from '../card-helper-functions';
import { CardUrlsComplete } from '../../types/models';

const cardNames = createCardNames();

const imageUrls = {};

async function getImageUrls() : Promise<CardUrlsComplete> {
  if (Object.values(imageUrls).length === 0) {
    await fillImageUrlsObject(imageUrls);
  }
  return imageUrls;
}

async function fillImageUrlsObject(imageUrls: CardUrlsComplete) {
  const promiseArray = [];
  for (const cardName of cardNames) {
    imageUrls[cardName] = {
      mobile: '',
      regular: ''
    };
    promiseArray.push(
      new Promise<void>(resolve => {
        import(/* webpackMode: "eager" */`../../assets/card_images/regular/${cardName}.svg`)
        .then(obj => {
          imageUrls[cardName].regular = obj.default;
          resolve();
        })
        .catch(err => {throw err})
      })
    );
    promiseArray.push(
      new Promise<void>(resolve => {
        import(/* webpackMode: "eager" */`../../assets/card_images/mobile/${cardName}.svg`)
        .then(obj => {
          imageUrls[cardName].mobile = obj.default;
          resolve();
        })
        .catch(err => {throw err})
      })
    );
  }
  await Promise.all(promiseArray);
}

export {
  cardNames,
  getImageUrls
}