import {useState, useEffect, useRef} from 'react';

interface AnimatedCountInNumberProps {
  value: number;
  duration?: number;
  tickInterval?: number;
  decorationSymbol?: string;
}

const AnimatedCountInNumber = ({
  value,
  duration = 750,
  tickInterval = 45,
  decorationSymbol = '',
}: AnimatedCountInNumberProps): string => {
  const [number, setNumber] = useState(0);
  const increment = Math.ceil((value / duration) * tickInterval);
  const timerRef = useRef<any>();
  useEffect(() => {
    const x = value;
    const y = x - 1;
    x !== number && setNumber(y > 0 ? 1 : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    let x = value;
    if (number < x) {
      let i = number + increment > x ? x - number : increment;
      timerRef.current = setTimeout(() => {
        setNumber(number + i);
      }, tickInterval);
    }
    return () => clearTimeout(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [number]);

  return number.toString().concat(decorationSymbol);
};

export default AnimatedCountInNumber;
