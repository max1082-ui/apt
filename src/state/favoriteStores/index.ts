import {
  CaseReducer,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';

import ApiService from '@services/api';
import {ExternalError} from '@services/types';
import {isExternalError} from '@services/error';

import {
  FavoriteSliceState,
  AddFavoriteThunkApiConfig,
  AddFavoriteThunkArg,
  AddFavoriteThunkReturns,
  RemoveFavoriteThunkApiConfig,
  RemoveFavoriteThunkArg,
  RemoveFavoriteThunkReturns,
  SetFavoriteStoresDataActionPayload,
} from '@state/types';

import type {PatchUserRequestParams, PatchUserResponse} from '@types';
import {showSnack} from '@utils';

const syncLocalFavoriteStoresData = async (favoritePharmacy: number[]) => {
  try {
    const requestParams = {
      favoritePharmacy,
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

export const addFavoriteStoreThunk = createAsyncThunk<
  AddFavoriteThunkReturns,
  AddFavoriteThunkArg,
  AddFavoriteThunkApiConfig
>('favoriteStores/add', async ({id}, {getState}) => {
  try {
    const {
      favoriteStores: {data: currentFavoriteStores},
    } = getState();

    const nextFavoriteData = [id, ...currentFavoriteStores];

    await syncLocalFavoriteStoresData(nextFavoriteData);

    return nextFavoriteData;
  } catch (err) {
    if (isExternalError(err)) {
      let externalError: ExternalError = err;
      externalError.show();
    } else {
      showSnack({
        type: 'danger',
        message: err.message || 'Ошибка при добавлении в любимые аптеки',
      });
    }
    throw err;
  }
});

export const removeFavoriteStoreThunk = createAsyncThunk<
  RemoveFavoriteThunkReturns,
  RemoveFavoriteThunkArg,
  RemoveFavoriteThunkApiConfig
>('favoriteStores/remove', async ({id}, {getState}) => {
  try {
    const {
      favoriteStores: {data: currentFavoriteStores},
    } = getState();

    const nextFavoriteData = currentFavoriteStores.filter(
      (storedId) => storedId !== id,
    );

    await syncLocalFavoriteStoresData(nextFavoriteData);

    return nextFavoriteData;
  } catch (err) {
    if (isExternalError(err)) {
      let externalError: ExternalError = err;
      externalError.show();
    } else {
      showSnack({
        type: 'danger',
        message: err.message || 'Ошибка при удалении из любимых аптек',
      });
    }
    throw err;
  }
});

//#region SYNC
const setFavoriteStoresDataReducer: CaseReducer<
  FavoriteSliceState,
  PayloadAction<SetFavoriteStoresDataActionPayload>
> = (state, {payload}) => {
  state.data = payload;
};

const resetFavoriteStoresDataReducer: CaseReducer<FavoriteSliceState> = (
  state,
) => {
  state.data = initialState.data;
};
//#endregion

const initialState: FavoriteSliceState = {
  loading: 'idle',
  data: [],
};

const favoriteStoresSlice = createSlice({
  name: 'favoriteStores',
  initialState,
  reducers: {
    setFavoriteStoresData: setFavoriteStoresDataReducer,
    resetFavoriteStoresData: resetFavoriteStoresDataReducer,
  },
  extraReducers: (builder) => {
    //#region ADD
    builder.addCase(addFavoriteStoreThunk.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(addFavoriteStoreThunk.fulfilled, (state, {payload}) => {
      state.loading = 'idle';
      state.data = payload;
    });
    builder.addCase(addFavoriteStoreThunk.rejected, (state) => {
      state.loading = 'idle';
    });
    //#endregion
    //#region REMOVE
    builder.addCase(removeFavoriteStoreThunk.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(removeFavoriteStoreThunk.fulfilled, (state, {payload}) => {
      state.loading = 'idle';
      state.data = payload;
    });
    builder.addCase(removeFavoriteStoreThunk.rejected, (state) => {
      state.loading = 'idle';
    });
    //#endregion
  },
});
export const {setFavoriteStoresData, resetFavoriteStoresData} =
  favoriteStoresSlice.actions;

export default favoriteStoresSlice.reducer;
