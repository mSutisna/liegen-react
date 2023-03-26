import { AnimationChain, AnimationChainMultipleImplelmentations } from "../../types/models";

const playAnimation = async ({element, animationInstructions, animationSettings} : AnimationChain) => {
  if (!element) {
    return;
  }

  if (!animationSettings) {
    animationSettings = {
      duration: 500,
      iterations: 1,
    }
  }
  
  const animationObject = element.animate(animationInstructions, animationSettings);
  return animationObject.finished;
}

const playAnimationChain = async (animationChain: AnimationChainMultipleImplelmentations[]) => {
  for (let animationData of animationChain) {
    if (typeof animationData === 'function') {
      animationData = animationData();
    }
    if (!animationData.element) {
      continue;
    }
    if (!animationData.dontMakeVisible) {
      animationData.element.style.visibility = 'visible';
    }
    await playAnimation(animationData);
  }
}

export const playAnimationChains = async (animationChains: Array<AnimationChainMultipleImplelmentations[]>) => {
  const promises = [];
  for (const animationChain of animationChains) {
    const promise = playAnimationChain(animationChain)
    promises.push(promise);
  }
  await Promise.all(promises);
}