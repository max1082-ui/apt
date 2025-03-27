import {StoredCartData} from '@state/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type {DefaultStore, StoredSearchHistory} from '@types';

//#region API
//#region ACCESS TOKEN
export const ACCESS_TOKEN = 'ACCESS_TOKEN';
export const getStoredAccessToken = async (): Promise<string | null | void> => {
  // await AsyncStorage.removeItem(ACCESS_TOKEN);
  const storedAccessToken = await AsyncStorage.getItem(ACCESS_TOKEN);
  return storedAccessToken;
};

export const setStoredAccessToken = async (
  accessToken: string,
): Promise<void> => {
  await AsyncStorage.setItem(ACCESS_TOKEN, accessToken);
};
//#endregion

//#region REFRESH TOKEN
export const REFRESH_TOKEN = 'REFRESH_TOKEN';
export const getStoredRefreshToken = async (): Promise<
  string | null | void
> => {
  const storedRefreshToken = await AsyncStorage.getItem(REFRESH_TOKEN);
  return storedRefreshToken;
};

export const setStoredRefreshToken = async (
  refreshToken: string,
): Promise<void> => {
  await AsyncStorage.setItem(REFRESH_TOKEN, refreshToken);
};
//#endregion
//#endregion

//#region CART
export const FUSER_ID = 'FUSER_ID';

export const CART_PRODUCTS = 'CART_PRODUCTS';
export async function getStoredCartProducts(): Promise<StoredCartData> {
  return AsyncStorage.getItem(CART_PRODUCTS).then((res) =>
    res !== null ? JSON.parse(res) : res,
  );
}
export async function clearStoredCart(): Promise<void> {
  await AsyncStorage.removeItem(CART_PRODUCTS);
}
//#endregion

//#region SEARCH
export const SEARCH_HISTORY = 'SEARCH_HISTORY';
export async function getStoredSearchHistory(): Promise<StoredSearchHistory | null> {
  return AsyncStorage.getItem(SEARCH_HISTORY).then((res) =>
    res !== null ? JSON.parse(res) : res,
  );
}
export async function setStoredSearchHistory(
  nextSearchHistory: StoredSearchHistory,
): Promise<void> {
  await AsyncStorage.setItem(SEARCH_HISTORY, JSON.stringify(nextSearchHistory));
}
//#endregion

//#region DEFAULT STORE
export const DEFAULT_STORE = 'DEFAULT_STORE';
export async function getStoredDefaultStore(): Promise<DefaultStore | null> {
  return AsyncStorage.getItem(DEFAULT_STORE).then((res) =>
    res !== null ? JSON.parse(res) : res,
  );
}
export async function setStoredDefaultStore(
  defaultStore: DefaultStore,
): Promise<void> {
  await AsyncStorage.setItem(DEFAULT_STORE, JSON.stringify(defaultStore));
}
//#endregion
