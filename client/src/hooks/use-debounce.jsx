import { useRef, useEffect, useCallback } from "react";

export function useDebouncedCallback(callback, delay) {
  const timer = useRef(null);

  const debounced = useCallback(
    (...args) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  useEffect(() => {
    return () => clearTimeout(timer.current);
  }, []);

  return debounced;
}
