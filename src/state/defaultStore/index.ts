import {
  CaseReducer,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';

// import ApiService from '@services/api';
import {ExternalError} from '@services/types';
import {isExternalError} from '@services/error';
import {getStoredDefaultStore, setStoredDefaultStore} from '@services/storage';

import {showSnack} from '@utils';

import {
  DefaulStoreSliceState,
  AddDefaultStoreThunkReturns,
  AddDefaultStoreThunkArg,
  AddDefaultStoreThunkApiConfig,
  SetDefaultStoreDataActionPayload,
  GetDefaultStoreThunkReturns,
  GetDefaultStoreThunkArg,
  GetDefaultStoreThunkApiConfig,
} from '@state/types';
// import type {PatchUserRequestParams, PatchUserResponse} from '@types';

// const syncLocalDefaultStoreData = async (defaultPharmacy: number) => {
//   try {
//     const requestParams = {
//       defaultPharmacy,
//     };

//     const ApiRequest = new ApiService<
//       PatchUserRequestParams,
//       PatchUserResponse
//     >('PATCH', 'user', requestParams);

//     await ApiRequest.call();
//   } catch (err) {
//     throw err;
//   }
// };

//#region GET FROM STORE
export const getDefaultStoreThunk = createAsyncThunk<
  GetDefaultStoreThunkReturns,
  GetDefaultStoreThunkArg,
  GetDefaultStoreThunkApiConfig
>('defaultStore/get', async () => {
  try {
    const storedData = await getStoredDefaultStore();
    return storedData;
  } catch (err) {
    throw err;
  }
});
//#endregion

export const addDefaultStoreThunk = createAsyncThunk<
  AddDefaultStoreThunkReturns,
  AddDefaultStoreThunkArg,
  AddDefaultStoreThunkApiConfig
>('defaultStore/add', async (defaultStoreData) => {
  try {
    const nextDefaultStoreData = defaultStoreData;

    await setStoredDefaultStore(nextDefaultStoreData);

    return nextDefaultStoreData;
  } catch (err) {
    if (isExternalError(err)) {
      let externalError: ExternalError = err;
      externalError.show();
    } else {
      showSnack({
        type: 'danger',
        message: err.message || 'Ошибка при выборе аптеки для получения заказа',
      });
    }
    throw err;
  }
});

//#region SYNC
const setDefaultStoreDataReducer: CaseReducer<
  DefaulStoreSliceState,
  PayloadAction<SetDefaultStoreDataActionPayload>
> = (state, {payload}) => {
  state.data = payload;
};

//#endregion

const initialState: DefaulStoreSliceState = {
  loading: 'idle',
  data: undefined,
};

const defaultStoreSlice = createSlice({
  name: 'defaultStore',
  initialState,
  reducers: {
    setDefaultStoreData: setDefaultStoreDataReducer,
  },
  extraReducers: (builder) => {
    //#region GET
    builder.addCase(getDefaultStoreThunk.fulfilled, (state, {payload}) => {
      if (payload) {
        state.data = payload;
      }
    });
    //#endregion
    //#region ADD
    builder.addCase(addDefaultStoreThunk.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(addDefaultStoreThunk.fulfilled, (state, {payload}) => {
      state.loading = 'idle';
      state.data = payload;
    });
    builder.addCase(addDefaultStoreThunk.rejected, (state) => {
      state.loading = 'idle';
    });
    //#endregion
  },
});
export const {setDefaultStoreData} = defaultStoreSlice.actions;

export default defaultStoreSlice.reducer;
