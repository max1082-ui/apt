//#region API
export type OAuthApiEndpoint = 'oauth/token' | 'oauth/token/refresh';

export type UserApiEndpoint =
  | 'user'
  | 'user/auth/phone'
  | 'user/confirm/code'
  | 'user/token'
  | 'user/order'
  | 'user/order/list'
  | 'user/logout'
  | 'user/review'
  | 'user/notifications/subscription'
  | 'user/delete';

export type CatalogApiEndpoint =
  | 'mainpage'
  | 'catalog'
  | 'catalog/section'
  | 'catalog/search'
  | 'catalog/element'
  | 'catalog/filter'
  | 'catalog/favorite';

export type PharmacyApiEndpoint =
  | 'pharmacy'
  | 'pharmacy/available'
  | 'pharmacy/pickpoint';

export type CheckoutApiEndpoint = 'cart' | 'order';

export type ApiEndpoint =
  | OAuthApiEndpoint
  | UserApiEndpoint
  | CatalogApiEndpoint
  | PharmacyApiEndpoint
  | CheckoutApiEndpoint;

export type ApiMethod = 'GET' | 'POST' | 'PATCH';
//#endregion

//#region ERROR
export interface ExternalError extends Error {
  show: () => void;
}

export type ApiErrorResponse = {
  message: string;
};

export type RejectReasonType = 'manual' | 'error';
export type RejectReason = {
  type?: RejectReasonType;
  message?: string;
};
//#endregion

//#region TOKENS
export type PublicKeyData = {
  deviceId: string;
  publicKey: string;
  timestamp: string;
};
//#endregion
