import {
  createSlice,
  createAsyncThunk,
  CaseReducer,
  PayloadAction,
} from '@reduxjs/toolkit';
import ApiService from '@services/api';
import {isExternalError} from '@services/error';
import {ExternalError} from '@services/types';
import {PatchUserRequestParams, PatchUserResponse} from '@types';
import {showSnack} from '@utils';

import type {
  AddFavoriteThunkApiConfig,
  AddFavoriteThunkArg,
  AddFavoriteThunkReturns,
  FavoriteSliceState,
  RemoveFavoriteThunkApiConfig,
  RemoveFavoriteThunkArg,
  RemoveFavoriteThunkReturns,
  SetFavoriteProductsDataActionPayload,
} from '../types';

const syncLocalFavoriteData = async (favoriteProducts: number[]) => {
  try {
    const requestParams = {
      favoriteProducts,
    };

    const ApiRequest = new ApiService<
      PatchUserRequestParams,
      PatchUserResponse
    >('PATCH', 'user', requestParams);

    await ApiRequest.call();
  } catch (err) {
    throw err;
  }
};

export const addFavoriteThunk = createAsyncThunk<
  AddFavoriteThunkReturns,
  AddFavoriteThunkArg,
  AddFavoriteThunkApiConfig
>('favorite/add', async ({id, name}, {getState}) => {
  try {
    const {
      favorite: {data: currentFavoriteData},
    } = getState();

    const nextFavoriteData = [id, ...currentFavoriteData];

    await syncLocalFavoriteData(nextFavoriteData);

    showSnack({
      type: 'success',
      message: `Товар ${name ? `${name} ` : ''}добавлен в избранное`,
    });

    return nextFavoriteData;
  } catch (err) {
    if (isExternalError(err)) {
      let externalError: ExternalError = err;
      externalError.show();
    } else {
      showSnack({
        type: 'danger',
        message: err.message || 'Ошибка при добавлении в избранное',
      });
    }
    throw err;
  }
});

export const removeFavoriteThunk = createAsyncThunk<
  RemoveFavoriteThunkReturns,
  RemoveFavoriteThunkArg,
  RemoveFavoriteThunkApiConfig
>('favorite/remove', async ({id, name}, {getState}) => {
  try {
    const {
      favorite: {data: currentFavoriteData},
    } = getState();

    const nextFavoriteData = currentFavoriteData.filter(
      (storedId) => storedId !== id,
    );

    await syncLocalFavoriteData(nextFavoriteData);

    showSnack({
      message: `Товар ${name ? `${name} ` : ''}удален из избранного`,
    });
    return nextFavoriteData;
  } catch (err) {
    if (isExternalError(err)) {
      let externalError: ExternalError = err;
      externalError.show();
    } else {
      showSnack({
        type: 'danger',
        message: err.message || 'Ошибка при удалении из избранное',
      });
    }
    throw err;
  }
});

const initialState: FavoriteSliceState = {
  loading: 'idle',
  data: [],
};

//#region SYNC
const setFavoriteProductsDataReducer: CaseReducer<
  FavoriteSliceState,
  PayloadAction<SetFavoriteProductsDataActionPayload>
> = (state, {payload}) => {
  state.data = payload;
};

const resetFavoriteProductsDataReducer: CaseReducer<FavoriteSliceState> = (
  state,
) => {
  state.data = initialState.data;
};
//#endregion

const favoriteSlice = createSlice({
  name: 'favorite',
  initialState,
  reducers: {
    setFavoriteProductsData: setFavoriteProductsDataReducer,
    resetFavoriteProductsData: resetFavoriteProductsDataReducer,
  },
  extraReducers: (builder) => {
    //#region ADD
    builder.addCase(addFavoriteThunk.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(addFavoriteThunk.fulfilled, (state, {payload}) => {
      state.loading = 'idle';
      state.data = payload;
    });
    builder.addCase(addFavoriteThunk.rejected, (state) => {
      state.loading = 'idle';
    });
    //#endregion
    //#region REMOVE
    builder.addCase(removeFavoriteThunk.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(removeFavoriteThunk.fulfilled, (state, {payload}) => {
      state.loading = 'idle';
      state.data = payload;
    });
    builder.addCase(removeFavoriteThunk.rejected, (state) => {
      state.loading = 'idle';
    });
    //#endregion
  },
});

export const {setFavoriteProductsData, resetFavoriteProductsData} =
  favoriteSlice.actions;

export default favoriteSlice.reducer;
