import React, { useCallback } from 'react';
import { useInView } from 'react-intersection-observer';

const useMarkerRef = (
  ref: React.MutableRefObject<HTMLSpanElement>,
  enableFixedBar: boolean
) => {
  let isSticky = false;
  if (!enableFixedBar)
    return {
      isSticky,
    };

  const { ref: inViewRef, inView } = useInView({
    threshold: 1,
  });

  const setMarkerRef = useCallback(
    (node: HTMLSpanElement) => {
      ref.current = node;
      inViewRef(node);
    },
    [inViewRef]
  );

  isSticky = !inView;

  return {
    isSticky,
    setMarkerRef,
  };
};

export default useMarkerRef;
