import store from './store';

import type {Action} from 'redux';
import type {ThunkAction} from 'redux-thunk';
import type {AsyncThunkAction} from '@reduxjs/toolkit';

import type {
  LoadingStatus,
  FavoriteData,
  User,
  GetUserResponse,
  UserPersonalData,
  UserUpdateFormResult,
  UserUpdateErrorFields,
  DefaultStoreData,
  DefaultStore,
} from '@types';

//#region COMMON
export type StoreThunkDispatch = typeof store.dispatch;

export type AppThunkAction<ReturnType = void> = ThunkAction<
  ReturnType,
  CombinedState,
  unknown,
  Action<string>
>;
//#endregion

//#region USER
export type UserSliceState = {
  loading: LoadingStatus;
  isAuthorized: boolean;
  authPassed?: boolean;
  userData?: User;
};

export type SetUserDataActionPayload = User;

export type GetUserDataThunkReturn = Omit<
  GetUserResponse,
  'favoritePharmacy' | 'favoriteProducts'
> | void;
export type GetUserDataThunkArg = undefined;
export type GetUserDataThunkApiConfig = {
  state: CombinedState;
  dispatch: StoreThunkDispatch;
};

export type PatchUserDataThunkReturn = UserPersonalData;
export type PatchUserDataThunkArg = UserUpdateFormResult;
export type PatchUserDataThunkConfig = {
  state: CombinedState;
  rejectValue: UserUpdateErrorFields;
};

export type LogoutThunkReturn = void;
export type LogoutThunkArg = undefined;
export type LogoutThunkConfig = {
  dispatch: StoreThunkDispatch;
};

export type DeleteAccountThunkReturn = void;
export type DeleteAccountThunkArg = undefined;
export type DeleteAccountThunkConfig = {
  dispatch: StoreThunkDispatch;
};
//#endregion

//#region FAVORITE
export type SetFavoriteProductsDataActionPayload = FavoriteData;
export type SetFavoriteStoresDataActionPayload = FavoriteData;

export type FavoriteSliceState = {
  loading: LoadingStatus;
  data: FavoriteData;
};

export type GetFavoriteThunkReturns = FavoriteData | undefined;
export type GetFavoriteThunkApiConfig = {state: CombinedState};

export type AddFavoriteThunkReturns = FavoriteData;
export type AddFavoriteThunkArg = {id: number; name?: string};
export type AddFavoriteThunkApiConfig = {state: CombinedState};

export type RemoveFavoriteThunkReturns = FavoriteData;
export type RemoveFavoriteThunkArg = {id: number; name?: string};
export type RemoveFavoriteThunkApiConfig = {state: CombinedState};

export type ClearFavoriteThunkApiConfig = {state: CombinedState};

//#region FAVORITE HOOKS

export type SelectedFavorite = {
  isFavorite: boolean;
  toggleFavoriteThunk: AsyncThunkAction<FavoriteData, {id: number}, {}>;
};

//#endregion
//#endregion

//#region DEFAULT STORE
export type SetDefaultStoreDataActionPayload = DefaultStore;

export type DefaulStoreSliceState = {
  loading: LoadingStatus;
  data: DefaultStoreData;
};

export type AddDefaultStoreThunkReturns = DefaultStore;
export type AddDefaultStoreThunkArg = DefaultStore;
export type AddDefaultStoreThunkApiConfig = {state: CombinedState};

export type GetDefaultStoreThunkReturns = DefaultStore | null;
export type GetDefaultStoreThunkArg = undefined;
export type GetDefaultStoreThunkApiConfig = {state: CombinedState};

export type ClearDefaultStoreDataThunkApiConfig = {state: CombinedState};
//#endregion

//#region CART
/**
 * {[id]: quantity, ...}
 */
export type StoredCartData = {[key: number]: number}; //TODO proper type
export type CartSliceState = {
  data: StoredCartData;
  fUserId?: number;
};

export type GetCartThunkReturns = StoredCartData | undefined;
export type GetCartThunkArg = undefined;
export type GetCartThunkApiConfig = {
  state: CombinedState;
};

export type AddToCartThunkReturns = StoredCartData;
export type AddToCartThunkArg = {
  id: number;
  name?: string;
  quantity?: number;
  quantityAction?: 'set' | 'increment';
  snack?: boolean;
};

export type MultipleAddToCartThunkReturns = AddToCartThunkReturns;
export type MultipleAddToCartThunkArg = {
  products: StoredCartData;
  snack?: boolean;
};

export type RemoveFromCartThunkReturns = StoredCartData;
export type RemoveFromCartThunkArg = {id: number; name?: string};

export type SelectedProductCartState = {
  cartQuantity: number;
};

export type ProductCartStateProps = {
  inCart: boolean;
  selectedQuantity: number;

  addEnabled: boolean;
  substractEnabled: boolean;

  processing: boolean;
};

export type ProductCartStateMethods = {
  addToCart: () => void;
  addCartQuantity: () => void;
  substractCartQuantity: () => void;
  removeFromCart: () => void;
};

export type UseProductCartStateArg = {
  id: number;
  inStock: boolean;

  name?: string;
  amount?: number;
  sourceQuantity?: number;
};

export type UseProductCartStateReturns = ProductCartStateProps &
  ProductCartStateMethods;
//#endregion

//#region NOTIFICATIONS
export type NotificationsSliceState = {
  topicProcessing: boolean;
  personalProcessing: boolean;
  permissionGranted: boolean;
  fcmToken?: string;
  topicSubscribed?: boolean;
  personalSubscribed?: boolean;
};

export type CheckNotificationsPermissionThunkReturn = Omit<
  NotificationsSliceState,
  'topicProcessing' | 'personalProcessing'
>;
export type CheckNotificationsPermissionThunkArg = undefined;
export type CheckNotificationsPermissionThunkConfig = {
  state: CombinedState;
};
export type ToggleTopicNotificationsSubscriptionThunkReturn =
  | boolean
  | undefined;
export type ToggleTopicNotificationsSubscriptionThunkArg = undefined;
export type ToggleTopicNotificationsSubscriptionThunkConfig = {
  state: CombinedState;
};
//#endregion

//#region COMBINED
export type CombinedState = {
  user: UserSliceState;
  cart: CartSliceState;
  favorite: FavoriteSliceState;
  favoriteStores: FavoriteSliceState;
  notifications: NotificationsSliceState;
  defaultStore: DefaulStoreSliceState;
};
//#endregion
