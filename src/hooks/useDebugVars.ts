import {useEffect} from 'react';

const useDebugVars = (...args: any[]) => {
  useEffect(() => console.log(args), [args]);
};

export default useDebugVars;
