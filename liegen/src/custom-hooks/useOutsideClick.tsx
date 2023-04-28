import { useRef, useEffect } from 'react';

const useOutsideClick = (callback: () => void) => {
  const ref = useRef<HTMLElement>();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (ref.current && !ref.current.contains(target)) {
        callback();
      }
    }

    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [ref]);

  return ref;
};

export default useOutsideClick;