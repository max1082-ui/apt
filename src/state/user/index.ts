import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import type {CaseReducer, PayloadAction} from '@reduxjs/toolkit';

import ApiService from '@services/api';

import type {
  UserSliceState,
  SetUserDataActionPayload,
  GetUserDataThunkApiConfig,
  GetUserDataThunkArg,
  GetUserDataThunkReturn,
  PatchUserDataThunkArg,
  PatchUserDataThunkConfig,
  PatchUserDataThunkReturn,
  LogoutThunkArg,
  LogoutThunkConfig,
  LogoutThunkReturn,
  DeleteAccountThunkConfig,
  DeleteAccountThunkReturn,
  DeleteAccountThunkArg,
} from '../types';

import type {
  GetUserResponse,
  GetUserRequestParams,
  PatchUserResponse,
  PatchUserRequestParams,
  UserUpdateErrorFields,
  LogoutUserRequestParams,
  LogoutUserResponse,
  DeleteAccountRequestParams,
  DeleteAccountResponse,
} from '@types';
import {
  resetFavoriteProductsData,
  setFavoriteProductsData,
} from '@state/favorite';
import {
  resetFavoriteStoresData,
  setFavoriteStoresData,
} from '@state/favoriteStores';
class UserUpdateError extends Error {
  constructor(public fields: UserUpdateErrorFields) {
    super();
    this.name = 'UserUpdateError';
  }
}

export const getUserDataThunk = createAsyncThunk<
  GetUserDataThunkReturn,
  GetUserDataThunkArg,
  GetUserDataThunkApiConfig
>('user/get', async (_, {dispatch}) => {
  try {
    //#region API CALL
    const ApiRequest = new ApiService<GetUserRequestParams, GetUserResponse>(
      'GET',
      'user',
    );
    const response = await ApiRequest.call();
    if (response) {
      const {favoriteProducts, favoritePharmacy, ...userData} = response;

      dispatch(setFavoriteProductsData(favoriteProducts));
      dispatch(setFavoriteStoresData(favoritePharmacy));

      return userData;
    }
    //#endregion
    return response;
  } catch (err) {
    throw err;
  }
});

export const patchUserDataThunk = createAsyncThunk<
  PatchUserDataThunkReturn,
  PatchUserDataThunkArg,
  PatchUserDataThunkConfig
>('user/patch', async (nextUserData, {rejectWithValue}) => {
  try {
    //#region API CALL

    const ApiRequest = new ApiService<
      PatchUserRequestParams,
      PatchUserResponse
    >('PATCH', 'user', nextUserData);

    await ApiRequest.call();

    return nextUserData;
    //#endregion
  } catch (err) {
    //TODO implement user field passthrough errors
    if (err.name === 'UserUpdateError') {
      let error: UserUpdateError = err;
      return rejectWithValue(error.fields);
    }
    throw err;
  }
});

export const logoutThunk = createAsyncThunk<
  LogoutThunkReturn,
  LogoutThunkArg,
  LogoutThunkConfig
>('user/logout', async (_, {dispatch}) => {
  try {
    //#region API CALL
    const ApiRequest = new ApiService<
      LogoutUserRequestParams,
      LogoutUserResponse
    >('POST', 'user/logout');
    await ApiRequest.call();
    //#endregion

    dispatch(resetFavoriteProductsData());
    dispatch(resetFavoriteStoresData());
  } catch (err) {
    throw err;
  }
});

export const deleteAccountThunk = createAsyncThunk<
  DeleteAccountThunkReturn,
  DeleteAccountThunkArg,
  DeleteAccountThunkConfig
>('user/deleteAccount', async (_, {dispatch}) => {
  try {
    //#region API CALL
    const ApiRequest = new ApiService<
      DeleteAccountRequestParams,
      DeleteAccountResponse
    >('POST', 'user/delete');
    await ApiRequest.call();
    //#endregion

    dispatch(resetFavoriteProductsData());
    dispatch(resetFavoriteStoresData());
  } catch (err) {
    throw err;
  }
});

//sync set data
const setUserDataReducer: CaseReducer<
  UserSliceState,
  PayloadAction<SetUserDataActionPayload>
> = (state, action) => {
  state.userData = action.payload;
};

const initialState: UserSliceState = {
  isAuthorized: false,
  authPassed: false,
  loading: 'idle',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: setUserDataReducer,
  },
  extraReducers: (builder) => {
    //#region GET USER
    builder.addCase(getUserDataThunk.fulfilled, (state, {payload}) => {
      if (payload) {
        state.isAuthorized = true;
        state.authPassed = true;
        state.userData = payload;
      }
    });
    //#endregion

    //#region PATCH USER
    builder.addCase(patchUserDataThunk.fulfilled, (state, {payload}) => {
      Object.assign(state.userData, payload);
    });
    //#endregion

    // //#region LOGOUT
    builder.addCase(logoutThunk.fulfilled, () => initialState);
    // //#endregion

    //#region DELETE ACCOUNT
    builder.addCase(deleteAccountThunk.fulfilled, () => initialState);
    //#endregion
  },
});

export const {setUserData} = userSlice.actions;

export default userSlice.reducer;
