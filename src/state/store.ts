import {combineReducers, configureStore} from '@reduxjs/toolkit';

import type {CombinedState} from './types';

import UserReducer from './user';
import CartReducer from './cart';
import FavoriteReducer from './favorite';
import FavoriteStoresReducer from './favoriteStores';
import NotificationsReducer from './notifications';
import DefaultStoreReduser from './defaultStore';

const RootReducer = combineReducers<CombinedState>({
  user: UserReducer,
  cart: CartReducer,
  favorite: FavoriteReducer,
  favoriteStores: FavoriteStoresReducer,
  notifications: NotificationsReducer,
  defaultStore: DefaultStoreReduser,
});

const store = configureStore({
  reducer: RootReducer,
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
