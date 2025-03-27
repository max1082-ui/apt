import {useEffect, useRef} from 'react';

function useInterval<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 1000,
) {
  const savedCallback = useRef<T>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => savedCallback.current && savedCallback.current();
    let id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}

export default useInterval;
