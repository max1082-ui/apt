// import {useState, useCallback, useRef, useEffect} from 'react';

// function useDebounce<T>(defaultValue: T, delay = 500) {
//   const [value, setValueImmediately] = useState<T>(defaultValue);
//   const [debouncing, setDebouncing] = useState<boolean>(false);
//   const [signal, setSignal] = useState<number>(Date.now());

//   const timer = useRef(null);
//   const setValue = useCallback((nextValue) => {
//     setValueImmediately(nextValue);
//     setDebouncing(true);
//   }, []);

//   useEffect(() => {
//     timer.current && clearTimeout(timer.current);
//     timer.current = setTimeout(() => {
//       setDebouncing(false);
//       setSignal(Date.now);
//     }, delay);
//     return () => timer.current && clearTimeout(timer.current);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [value]);

//   return [
//     value,
//     setValue,
//     {
//       signal,
//       debouncing,
//     },
//   ];
// }
// export default useDebounce;
