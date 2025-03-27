import {useMemo} from 'react';

import {useSelector, shallowEqual} from 'react-redux';

import {CombinedState} from '@state/types';

type SelectorState = {
  storeCode?: string;
};

function useStoreCode() {
  const {storeCode} = useSelector<CombinedState, SelectorState>(
    (state) => ({storeCode: state.app.storeData?.code}),
    shallowEqual,
  );
  return useMemo(() => {
    return storeCode;
  }, [storeCode]);
}

export default useStoreCode;
