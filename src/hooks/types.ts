import Animated from 'react-native-reanimated';

import type {ApiMethod, ApiEndpoint, ExternalError} from '@services/types';

//#region useCollapsible
export type CollapsibleState = 'expanded' | 'collapsed';

export type CollapsibleConfig = {
  duration?: number;
  easing?: Animated.EasingNodeFunction;
  defaultState?: CollapsibleState;
};

export type CollapsibleStateChangeEvent = (state: CollapsibleState) => void;
//#endregion

//#region useApiCall
export type ApiCallArgs<T, R> = {
  method: ApiMethod;
  endpoint: ApiEndpoint;
  requestParams?: T;
  stallMs?: number;
  responseInterceptor?: (response: R) => R;
  onError?: (args: {
    error: ExternalError;
    isNetworkError: boolean;
    reload: () => void;
  }) => void;
  initialDataSource?: R;
};

export type ApiCallReturns<T> = {
  loadingState: LoadingState;
  initialized: boolean;
  callTrigger: () => void;
  clearApiData: () => void;
  data?: T;
};

export type LoadingState = 'idle' | 'loading' | 'updating' | 'networkError';
export type ApiCallLoadingState = {
  initialized: boolean;
  state: LoadingState;
};
//#endregion
