import {useSelector, shallowEqual} from 'react-redux';
import {useMemo} from 'react';
import {CombinedState, UserSliceState} from '@state/types';

type SelectorState = {
  userToken: UserSliceState['userToken'];
};

function useUserToken() {
  const {userToken} = useSelector<CombinedState, SelectorState>(
    (state) => ({userToken: state.user.userToken}),
    shallowEqual,
  );
  return useMemo(() => {
    return userToken;
  }, [userToken]);
}

export default useUserToken;
