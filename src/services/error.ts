import axios from 'axios';

import {showSnack} from '@utils';
import type {AppSnackOptions} from '@utils/types';

import type {ExternalError} from './types';

//#region STRINGS
//#region NAMES
export const API_ERROR = 'API_ERROR';
export const MANUAL_REJECT_ERROR = 'MANUAL_REJECT_ERROR';
export const SERVICE_UNAVAILABLE_ERROR = 'SERVICE_UNAVAILABLE_ERROR';
//#endregion

//#region TEXT
export const DEFUALT_ERROR_TITLE = 'Ошибка';
export const DEFAULT_API_ERROR_TEXT = 'Ошибка сервера';
export const DEFAULT_UNEXPECTED_ERROR_TEXT = 'Неизвестная ошибка';
export const DEFAULT_NETWORK_PLACEHOLDER_ERROR_TEXT =
  'Проверьте ваше подключение к сети интернет\nи нажмите кнопку обновить';

export const API_CALL_TIMEOUT_ERROR_TEXT = 'Превышен лимит времени на запрос';
export const REFRESH_TOKEN_ERROR_TEXT =
  'Ошибка, попробуйте перезапустить приложение'; // 'Ошибка обновления ключа доступа приложения';
export const RECURSIVE_CALLS_LIMIT_ERROR_TEXT =
  'Превышено допустимое количество запросов';
export const SERVICE_UNAVAILABLE_ERROR_TEXT =
  'Ошибка сети\nОтсутствует подключение';
export const PHOTO_LIBRARY_PERMISSION_ERROR_TEXT =
  'Для добавления фотографий необходимо дать доступ к галерее в настройках устройства.\n\nНажмите чтобы перейти к настройкам';
export const DEFAULT_REVIEW_ADD_ERROR_TEXT =
  'Произошла ошибка, отзыв\nне был добавлен';
//#endregion
//#endregion

//#region SERVICE_ERROR
export class ServiceUnavailableError extends Error implements ExternalError {
  constructor(public message: string) {
    super();
    this.name = SERVICE_UNAVAILABLE_ERROR;
  }

  public show() {
    showSnack({type: 'danger', message: this.message});
  }
}
//#endregion

//#region API_ERROR
export class ApiError extends Error implements ExternalError {
  constructor(message: string | undefined, public statusCode?: number) {
    super();
    this.name = API_ERROR;
    this.message = message || DEFAULT_API_ERROR_TEXT;
  }

  public show() {
    const snackOptions = Object.assign<
      Pick<AppSnackOptions, 'type'>,
      Omit<AppSnackOptions, 'type'>
    >(
      {type: 'danger'},
      this.statusCode
        ? {message: this.statusCode.toString(), description: this.message}
        : {message: this.message},
    );
    showSnack(snackOptions);
  }
}
//#endregion

//#region RECOGNIZE
export const isRequestAbort = (error: any) => axios.isCancel(error);
export const isApiError = (error: any) =>
  error.name === API_ERROR ? true : false;
export const isNetworkError = (error: any) =>
  error.name === SERVICE_UNAVAILABLE_ERROR ? true : false;

export const isExternalError = (err: any) =>
  isNetworkError(err) || isApiError(err);
//#endregion

//#region HANDLE
export const handleExternalError = (error: ExternalError) => {
  error.show();
};
//#endregion
