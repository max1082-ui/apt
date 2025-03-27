import md5 from 'md5';
import DeviceInfo from 'react-native-device-info';

import ApiService, {SALT} from './api';
import {ApiError, REFRESH_TOKEN_ERROR_TEXT} from './error';
import {setStoredAccessToken, setStoredRefreshToken} from './storage';

import type {
  RequestAccessTokensResponse,
  RequestAccessTokensRequestParams,
} from '@types';

import type {PublicKeyData} from './types';

//#region PUBLIC_KEY
export const getPublicKeyData = (): PublicKeyData => {
  const timestamp = Date.now().toString();
  const deviceId = DeviceInfo.getUniqueId();
  const publicKey = md5(`${deviceId}${SALT}${timestamp}`);

  return {
    deviceId,
    publicKey,
    timestamp,
  };
};
//#endregion

//#region API
export const requestAccessTokens = async (): Promise<void> => {
  try {
    const requestParams: RequestAccessTokensRequestParams = getPublicKeyData();
    const ApiRequest = new ApiService<
      RequestAccessTokensRequestParams,
      RequestAccessTokensResponse
    >('POST', 'oauth/token', requestParams);
    const response = await ApiRequest.call();
    if (response && response.accessToken && response.refreshToken) {
      await setStoredRefreshToken(response.refreshToken);
      await setStoredAccessToken(response.accessToken);
    } else {
      throw new ApiError(REFRESH_TOKEN_ERROR_TEXT);
    }
  } catch (err) {
    throw err; //handle inside root index.tsx
  }
};
//#endregion
