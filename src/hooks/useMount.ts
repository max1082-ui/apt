import {useEffect} from 'react';

//obviously it's just a "semantic" wrapper over useEffect with no deps
function useMount<T extends (...args: any[]) => any>(fn: T) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(fn, []);
}

export default useMount;
