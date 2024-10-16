import { useState, useRef, useEffect } from "react";

export const useBoxSize = () => {
  const [boxSize, setBoxSize] = useState({
    height: 0,
    width: 0,
  });
  const ref = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (ref.current !== null) {
        setBoxSize({
          height: ref.current.clientHeight,
          width: ref.current.clientWidth,
        });
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { ref, boxSize };
};

export function useDebounceEffect(fn, waitTime, deps) {
  useEffect(() => {
    const t = setTimeout(() => {
      fn.apply(undefined, deps);
    }, waitTime);

    return () => {
      clearTimeout(t);
    };
  }, deps);
}
