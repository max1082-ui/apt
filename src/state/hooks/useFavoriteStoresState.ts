import {useCallback, useMemo, useState} from 'react';
import {useSelector} from 'react-redux';

import useThunkDispatch from './useThunkDispatch';

import {
  addFavoriteStoreThunk,
  removeFavoriteStoreThunk,
} from '@state/favoriteStores';
import type {CombinedState, SelectedFavorite} from '@state/types';

const eqFn = (prev: SelectedFavorite, next: SelectedFavorite): boolean =>
  prev.isFavorite !== next.isFavorite ? false : true;

const useFavoriteStoresState = (id: number) => {
  const dispatch = useThunkDispatch();

  //#region STATE
  const [favoriteProcessing, setFavoriteProcessing] = useState<boolean>(false);
  //#endregion

  const {isFavorite, toggleFavoriteThunk} = useSelector<
    CombinedState,
    SelectedFavorite
  >(({favoriteStores: favoriteStoreState}) => {
    const cond = favoriteStoreState.data.indexOf(id) > -1 ? true : false;
    return {
      isFavorite: cond,
      toggleFavoriteThunk: !cond
        ? addFavoriteStoreThunk({id})
        : removeFavoriteStoreThunk({id}),
    };
  }, eqFn);

  const onFavoriteButtonPress = useCallback(async () => {
    try {
      setFavoriteProcessing(true);
      await dispatch(toggleFavoriteThunk);
    } finally {
      setFavoriteProcessing(false);
    }
  }, [dispatch, toggleFavoriteThunk]);

  return useMemo(
    () => ({
      isFavorite,
      favoriteProcessing,
      onFavoriteButtonPress,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isFavorite, favoriteProcessing],
  );
};

export default useFavoriteStoresState;
