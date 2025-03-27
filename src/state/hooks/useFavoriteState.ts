import {useSelector} from 'react-redux';

import {addFavoriteThunk, removeFavoriteThunk} from '@state/favorite';
import type {CombinedState, SelectedFavorite} from '@state/types';
import {useCallback, useMemo, useState} from 'react';
import useThunkDispatch from './useThunkDispatch';

const eqFn = (prev: SelectedFavorite, next: SelectedFavorite): boolean =>
  prev.isFavorite !== next.isFavorite ? false : true;

const useFavoriteState = (id: number, name?: string) => {
  const dispatch = useThunkDispatch();

  //#region STATE
  const [favoriteProcessing, setFavoriteProcessing] = useState<boolean>(false);
  //#endregion

  //#region STORE
  const {isFavorite, toggleFavoriteThunk} = useSelector<
    CombinedState,
    SelectedFavorite
  >(({favorite: favoriteState}) => {
    const cond = favoriteState.data.indexOf(id) > -1 ? true : false;
    return {
      isFavorite: cond,
      toggleFavoriteThunk: !cond
        ? addFavoriteThunk({id, name})
        : removeFavoriteThunk({id, name}),
    };
  }, eqFn);
  //#endregion

  //#region HANDLE
  const onFavoriteButtonPress = useCallback(async () => {
    try {
      setFavoriteProcessing(true);
      await dispatch(toggleFavoriteThunk);
    } finally {
      setFavoriteProcessing(false);
    }
  }, [dispatch, toggleFavoriteThunk]);
  //#endregion

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

export default useFavoriteState;
