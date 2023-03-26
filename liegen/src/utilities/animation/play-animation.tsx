import { AnimationChain } from "../../types/models";

const playAnimation = async ({element, startPoint, endPoint} : AnimationChain) => {
  if (!element) {
    return;
  }
  const animations = [
      { transform: `translate(${startPoint.x}px, ${startPoint.y}px)` },
      { transform: `translate(${endPoint.x}px, ${endPoint.y}px)` },
    ];
    const animationSettings = {
      duration: 500,
      iterations: 1,
    };
    
    const animationObject = element.animate(animations, animationSettings);
    return animationObject.finished;
}

const playAnimationChain = async (animationChain: AnimationChain[]) => {
  for (const animationData of animationChain) {
    if (!animationData.element) {
      continue;
    }
    if (!animationData.dontMakeVisible) {
      animationData.element.style.visibility = 'visible';
    }
    await playAnimation({
      element: animationData.element, 
      startPoint: animationData.startPoint, 
      endPoint: animationData.endPoint
    });
    const animationChains = animationData.afterAnimationChain?.();
    if (!animationChains) {
      continue;
    }
    await playAnimationChain(animationChains);
  }
}

export const playAnimationChains = async (animationChains: Array<AnimationChain[]>) => {
  const promises = [];
  for (const animationChain of animationChains) {
    const promise = playAnimationChain(animationChain)
    promises.push(promise);
  }
  await Promise.all(promises);
}