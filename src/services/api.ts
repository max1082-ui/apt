import axios from 'axios';
import type {AxiosResponse, AxiosInstance, CancelTokenSource} from 'axios';

import {
  getStoredAccessToken,
  setStoredAccessToken,
  getStoredRefreshToken,
} from './storage';
import {getPublicKeyData} from './token';

import {
  ApiError,
  API_ERROR,
  isRequestAbort,
  ServiceUnavailableError,
  REFRESH_TOKEN_ERROR_TEXT,
  SERVICE_UNAVAILABLE_ERROR,
  API_CALL_TIMEOUT_ERROR_TEXT,
  SERVICE_UNAVAILABLE_ERROR_TEXT,
  RECURSIVE_CALLS_LIMIT_ERROR_TEXT,
} from './error';

import type {ApiEndpoint, ApiErrorResponse, ApiMethod} from './types';

import {IS_PRODUCTION} from '@utils';

import type {
  Dictionary,
  RefreshAccessTokenResponse,
  RefreshAccessTokenRequestParams,
} from '@types';

const LOG = !IS_PRODUCTION;

//#region CONST
export const API_VERSION = '';
export const BASE_URL = 'https://xn--80aaouxjk8f.xn--p1ai';
export const SERVER_URL = `${BASE_URL}/api/app/`;
export const SALT = 'S84kW:Umv%';
//#endregion

//#region HTTP RESPONSE CODES
const TOKEN_ACCESS_DENIED_STATUS = 401;
const ALLOWED_HTTP_RESPONSE_CODES = [
  200,
  400,
  403,
  404,
  500,
  501,
  TOKEN_ACCESS_DENIED_STATUS,
]; // TODO rework
//#endregion

class ApiService<
  IRequest extends FormData | object | undefined,
  IResponse extends any | undefined,
> {
  private readonly _instance: AxiosInstance;
  private readonly _source: CancelTokenSource;

  private _currentRerursiveCallsNumber: number = 0;
  private readonly _maxAllowedRecursiveCallsNumber = 5;

  constructor(
    private readonly _method: ApiMethod,
    private readonly _endpoint: ApiEndpoint,
    private _requestData?: IRequest,
    private readonly _additionalHeaders: Dictionary<string> = {},
    private readonly _timeoutLength: number = 50000,
  ) {
    this._source = axios.CancelToken.source();
    this._instance = axios.create({
      baseURL: SERVER_URL,
      method: this._method,

      responseType: this._endpoint === 'user/token' ? 'text' : 'json', //TODO

      timeout: this._timeoutLength,
      timeoutErrorMessage: API_CALL_TIMEOUT_ERROR_TEXT,

      cancelToken: this._source.token,

      validateStatus: (status) => this._validateStatus(status),
    });

    if (LOG) {
      this._setupInterceptors();
    }
  }
  /**
   * Logging purposes
   */
  private _setupInterceptors(): void {
    this._instance.interceptors.request.use(
      (x) => {
        console.log('RAW_REQUEST', x);
        return x;
      },
      (err) => {
        console.log('REQUEST_ERROR', err);
        throw err;
      },
    );
    this._instance.interceptors.response.use(
      (x) => {
        console.log('RAW_RESPONSE', x);
        console.log('RESPONSE_DATA', x.data);
        return x;
      },
      (err) => {
        console.log('RESPONSE_ERROR', err);
        throw err;
      },
    );
  }

  set requestData(newRequestData: IRequest) {
    this._requestData = newRequestData;
  }

  private _validateStatus(status: number): boolean {
    return ALLOWED_HTTP_RESPONSE_CODES.indexOf(status) > -1 ? true : false;
  }

  /**
   * Call api request with params provided in ApiService constructor
   */
  public async call(): Promise<IResponse | void> {
    try {
      LOG && console.log(`---------REQUESTING ${this._endpoint}---------`);
      const accessToken = await getStoredAccessToken();

      const requestParams = Object.assign(
        {},
        this._requestData &&
          (this._method === 'GET' //in GET we pass PARAMS / for POST etc - DATA
            ? {params: this._requestData}
            : {data: this._requestData}),
        {
          url: this._endpoint,
          headers: Object.assign({}, {accessToken}, this._additionalHeaders),
        },
      );

      const response = await this._instance.request<IResponse>(requestParams);

      LOG &&
        console.log(
          `---------RESPONSE IS VALID WITH STATUS ${response.status}---------`,
        );
      if (response.status !== 200) {
        if (response.status === TOKEN_ACCESS_DENIED_STATUS) {
          this._handleRecursiveCallsLimit();
          await this._refreshAccessToken();
          return this.call(); // recursive call after token refresh
        }
        const {
          data: {message},
          status,
        } = response as AxiosResponse<ApiErrorResponse>;
        throw new ApiError(message, status);
      } else {
        this._resetCurrentRecursiveCallsNumber();
        return response.data;
      }
    } catch (err) {
      if (!isRequestAbort(err)) {
        if (err.message === 'Network Error') {
          const serviceError = new ServiceUnavailableError(
            SERVICE_UNAVAILABLE_ERROR_TEXT,
          );
          this._handleError(serviceError);
        } else {
          this._handleError(err);
        }
      }
    } finally {
      LOG && console.log('----------------------------------------------');
    }
  }
  //#region RECURSIVE CALLS
  private _resetCurrentRecursiveCallsNumber() {
    this._currentRerursiveCallsNumber = 0;
  }
  /**
   * For now implemented only to limit number of recursive (this.call()) executions on token refresh
   */
  private _handleRecursiveCallsLimit() {
    if (
      this._currentRerursiveCallsNumber >= this._maxAllowedRecursiveCallsNumber
    ) {
      throw new ApiError(RECURSIVE_CALLS_LIMIT_ERROR_TEXT);
    }
    this._currentRerursiveCallsNumber += 1;
  }
  //#endregion
  private _handleError(error: Error): never {
    switch (error.name) {
      case API_ERROR: {
        const {name, statusCode, message} = error as ApiError;
        console.log(name, statusCode, message);
        break;
      }

      case SERVICE_UNAVAILABLE_ERROR: {
        const {name, message} = error as ServiceUnavailableError;
        console.log(name, message);
        break;
      }

      default: {
        console.log(error);
      }
    }

    throw error;
  }

  //#region REFRESH_TOKEN
  private _refreshTokenSource: CancelTokenSource | undefined;
  private async _refreshAccessToken(): Promise<void> {
    this._refreshTokenSource = axios.CancelToken.source();
    try {
      const publicKeyData = getPublicKeyData();

      const refreshToken = await getStoredRefreshToken();
      if (!refreshToken) {
        throw new ApiError(REFRESH_TOKEN_ERROR_TEXT); // TODO proper error message
      }

      const requestData: RefreshAccessTokenRequestParams = Object.assign(
        {},
        publicKeyData,
        {refreshToken},
      );

      const refreshTokenResponse = await axios.post<RefreshAccessTokenResponse>(
        `${SERVER_URL}/oauth/refresh`,
        requestData,
        {
          cancelToken: this._refreshTokenSource.token,
        },
      );

      if (refreshTokenResponse.data.accessToken) {
        await setStoredAccessToken(refreshTokenResponse.data.accessToken);
      } else {
        throw new ApiError(REFRESH_TOKEN_ERROR_TEXT);
      }
      console.log('TOKEN REFRESH RESPONSE', refreshTokenResponse);
    } catch (err) {
      throw err;
    }
  }
  //#endregion

  /**
   * Abort api call
   */
  public abort(): void {
    LOG && console.log(`--------- ABORTED ${this._endpoint} ---------`);
    if (this._refreshTokenSource) {
      this._refreshTokenSource.cancel();
    }
    this._source.cancel();
  }
}

export default ApiService;
