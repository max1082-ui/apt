import {useSelector, shallowEqual} from 'react-redux';
import {useMemo} from 'react';
import {CombinedState, UserSliceState} from '@state/types';

type SelectorState = {
  isAuthorized: UserSliceState['isAuthorized'];
};

function useIsAuthorized() {
  const {isAuthorized} = useSelector<CombinedState, SelectorState>(
    (state) => ({isAuthorized: state.user.isAuthorized}),
    shallowEqual,
  );
  return useMemo(() => {
    return isAuthorized;
  }, [isAuthorized]);
}

export default useIsAuthorized;
