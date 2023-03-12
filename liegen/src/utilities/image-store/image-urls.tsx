import { createCardNames } from '../card-helper-functions';

const cardNames = createCardNames();

const imageUrls = {};

async function getImageUrls() : Promise<{[k: string]: string}> {
  if (Object.values(imageUrls).length === 0) {
    await fillImageUrlsObject(imageUrls);
  }
  return imageUrls;
}

async function fillImageUrlsObject(imageUrls: {[k: string]: string}) {
  const promiseArray = [];
  for (const cardName of cardNames) {
    promiseArray.push(
      new Promise<void>(resolve => {
        import(/* webpackMode: "eager" */`../../assets/card_images/${cardName}.svg`)
        .then(obj => {
          imageUrls[cardName] = obj.default;
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