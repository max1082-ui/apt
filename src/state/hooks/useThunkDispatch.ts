import {useDispatch} from 'react-redux';

import type {StoreThunkDispatch} from '@state/types';

/**
 * Properly typed version of useDispatch for async thunks
 */
const useThunkDispatch = () => useDispatch<StoreThunkDispatch>();

export default useThunkDispatch;
