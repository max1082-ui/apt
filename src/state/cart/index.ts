import AsyncStorage from '@react-native-async-storage/async-storage';

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';

import {
  FUSER_ID,
  CART_PRODUCTS,
  clearStoredCart,
  getStoredCartProducts,
} from '@services/storage';

import {getNoun, showSnack} from '@utils';

import type {
  CombinedState,
  CartSliceState,
  GetCartThunkReturns,
  GetCartThunkArg,
  GetCartThunkApiConfig,
  AddToCartThunkReturns,
  AddToCartThunkArg,
  MultipleAddToCartThunkReturns,
  MultipleAddToCartThunkArg,
  RemoveFromCartThunkReturns,
  RemoveFromCartThunkArg,
} from '../types';

//#region FUSER
/**
 * FUser = ID владельца корзины с товарами
 */
export const setFUserIdThunk = createAsyncThunk<number, number>(
  'cart/setFUser',
  async (newFUserId) => {
    try {
      await AsyncStorage.setItem(FUSER_ID, newFUserId.toString());
      return newFUserId;
    } catch (err) {
      throw err;
    }
  },
);
export const getFUserIdThunk = createAsyncThunk<number | undefined>(
  'cart/getFUser',
  async () => {
    try {
      const storedFUserId = await AsyncStorage.getItem(FUSER_ID);
      if (storedFUserId !== null) {
        return parseInt(storedFUserId, 10);
      }
      return;
    } catch (err) {
      throw err;
    }
  },
);
export const removeFUserIdThunk = createAsyncThunk(
  'cart/removeFUser',
  async () => {
    try {
      await AsyncStorage.removeItem(FUSER_ID);
    } catch (err) {
      throw err;
    }
  },
);
//#endregion

//#region CART THUNKS
//#region GET FROM STORE
export const getCartThunk = createAsyncThunk<
  GetCartThunkReturns,
  GetCartThunkArg,
  GetCartThunkApiConfig
>('cart/get', async () => {
  try {
    // await AsyncStorage.removeItem('CART_PRODUCTS');
    const storedData = await getStoredCartProducts();
    return storedData;
  } catch (err) {
    throw err;
  }
});
//#endregion

//#region ADD TO CART
export const addToCartThunk = createAsyncThunk<
  AddToCartThunkReturns,
  AddToCartThunkArg
>(
  'cart/add',
  async ({
    id,
    name,
    quantity = 1,
    quantityAction = 'increment',
    snack = true,
  }) => {
    try {
      const storedData = await getStoredCartProducts();
      let newProduct;

      if (quantity === 0) {
        throw new Error('Невозможно добавить товар в корзину');
      }

      if (storedData !== null) {
        if (typeof storedData[id] === 'number') {
          newProduct = {
            [id]:
              quantityAction === 'set' ? quantity : storedData[id] + quantity,
          };
        } else {
          newProduct = {[id]: quantity};
        }
        //TODO move to service / logic? /
        await AsyncStorage.mergeItem(CART_PRODUCTS, JSON.stringify(newProduct));
      } else {
        newProduct = {[id]: quantity};
        await AsyncStorage.setItem(CART_PRODUCTS, JSON.stringify(newProduct));
      }

      snack &&
        showSnack({
          type: 'success',
          message: `Товар ${name ? `${name} ` : ''}добавлен в корзину`,
        });

      return {...storedData, ...newProduct};
    } catch (err) {
      showSnack({
        type: 'danger',
        message:
          err.message ||
          (quantityAction === 'increment'
            ? 'Ошибка при добавлении в корзину'
            : 'Ошибка при изменении количества товара'),
      });
      throw err;
    }
  },
);

export const multipleAddToCartThunk = createAsyncThunk<
  MultipleAddToCartThunkReturns,
  MultipleAddToCartThunkArg
>('cart/multipleAdd', async ({products, snack = true}) => {
  try {
    const storedData = await getStoredCartProducts();
    let newProducts = {};
    if (storedData !== null) {
      for (const [id, quantity] of Object.entries(products)) {
        const properId = parseInt(id, 10);
        if (typeof storedData[properId] === 'number') {
          Object.assign(newProducts, {[id]: storedData[properId] + quantity});
        } else {
          Object.assign(newProducts, {[id]: quantity});
        }
      }
      await AsyncStorage.mergeItem(CART_PRODUCTS, JSON.stringify(newProducts));
    } else {
      newProducts = products;
      await AsyncStorage.setItem(CART_PRODUCTS, JSON.stringify(newProducts));
    }

    if (snack) {
      let productsCount = Object.keys(products).length;
      showSnack({
        type: 'success',
        message: `${productsCount} ${getNoun(
          productsCount,
          'товар',
          'товара',
          'товаров',
        )} успешно ${getNoun(
          productsCount,
          'добавлен',
          'добавлены',
          'добавлены',
        )} в корзину`,
      });
    }

    return {...storedData, ...newProducts};
  } catch (err) {
    showSnack({
      type: 'danger',
      message: err.message || 'Ошибка при добавлении в корзину',
    });
    throw err;
  }
});
//#endregion

//#region REMOVE FROM CART
export const removeFromCartThunk = createAsyncThunk<
  RemoveFromCartThunkReturns,
  RemoveFromCartThunkArg
>('cart/remove', async ({id, name}) => {
  try {
    const storedData = await getStoredCartProducts();
    let result = {...storedData};
    if (storedData !== null) {
      if (typeof storedData[id] === 'number') {
        const rest = (({[id]: _, ...r}) => r)(storedData);
        await AsyncStorage.setItem(CART_PRODUCTS, JSON.stringify(rest));
        result = rest;
      } else {
        throw new Error('Ошибка при удалении из корзины');
      }
    }
    showSnack({
      message: `Товар ${name ? `${name} ` : ''}удален из корзины`,
    });
    return result;
  } catch (err) {
    showSnack({
      type: 'danger',
      message: err.message || 'Ошибка при удалении из корзины',
    });
    throw err;
  }
});
//#endregion

//#region CLEAR CART
export const clearCartThunk = createAsyncThunk<
  void,
  undefined,
  {
    state: CombinedState;
  }
>('cart/clear', async () => {
  try {
    await clearStoredCart();
  } catch (err) {
    throw err;
  }
});
//#endregion
//#endregion
const initialState: CartSliceState = {
  data: {},
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //#region CART
    //#region GET
    builder.addCase(getCartThunk.fulfilled, (state, {payload}) => {
      if (payload) {
        state.data = payload;
      }
    });
    //#endregion
    //#region ADD
    builder.addCase(addToCartThunk.fulfilled, (state, {payload}) => {
      state.data = payload;
    });
    builder.addCase(multipleAddToCartThunk.fulfilled, (state, {payload}) => {
      state.data = payload;
    });
    //#endregion
    //#region REMOVE
    builder.addCase(removeFromCartThunk.fulfilled, (state, {payload}) => {
      state.data = payload;
    });
    //#endregion
    //#region CLEAR
    builder.addCase(clearCartThunk.fulfilled, (state) => {
      state.data = initialState.data;
    });
    //#endregion
    //#endregion

    //#region FUSER
    //#region GET
    builder.addCase(getFUserIdThunk.fulfilled, (state, {payload}) => {
      if (payload) {
        state.fUserId = payload;
      }
    });
    //#endregion
    //#region SET
    builder.addCase(setFUserIdThunk.fulfilled, (state, {payload}) => {
      state.fUserId = payload;
    });
    //#endregion
    //#region REMOVE
    builder.addCase(removeFUserIdThunk.fulfilled, (state) => {
      let oldState = {...state};
      state = (({fUserId: _, ...rest}) => rest)(oldState);
    });
    //#endregion
    //#endregion
  },
});

export default cartSlice.reducer;
