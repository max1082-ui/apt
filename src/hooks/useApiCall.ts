import {useState, useEffect, useMemo, useCallback} from 'react';

import ApiService from '@services/api';
import {isExternalError, isNetworkError} from '@services/error';

import type {ExternalError} from '@services/types';

import {stall, deepEqual, isObject} from '@utils';

import type {ApiCallLoadingState, ApiCallArgs, ApiCallReturns} from './types';

const initialLoadingState: ApiCallLoadingState = {
  initialized: false,
  state: 'idle',
};

function useApiCall<
  RequestParams extends object | FormData | undefined,
  ReturnParams,
>({
  method,
  endpoint,
  requestParams,
  stallMs,
  responseInterceptor,
  onError,
  initialDataSource,
}: ApiCallArgs<RequestParams, ReturnParams>): ApiCallReturns<ReturnParams> {
  //#region STATE
  const [loadingState, setLoadingState] =
    useState<ApiCallLoadingState>(initialLoadingState);

  const [apiData, setApiData] = useState<ReturnParams>();

  const [internalTrigger, setInternalTrigger] = useState(Date.now());
  const [externalTrigger, setExternalTrigger] = useState(Date.now());
  //#endregion

  //#region CALL
  async function call(reference: ApiService<RequestParams, ReturnParams>) {
    try {
      setLoadingState((prev) => ({
        ...prev,
        state: !loadingState.initialized ? 'loading' : 'updating',
      }));

      stallMs && (await stall(stallMs));

      //---RESPONSE HANDLING---
      const apiResponseData = await reference.call();

      if (apiResponseData) {
        const res =
          responseInterceptor && apiResponseData
            ? responseInterceptor(apiResponseData)
            : apiResponseData;
        if (
          (!apiData && res) ||
          (isObject(res) && isObject(apiData) && !deepEqual(res, apiData))
        ) {
          setApiData(res);
        }
      }
      //-----------------------

      setLoadingState(() => ({
        initialized: true,
        state: 'idle',
      }));
    } catch (err) {
      handleError(err);
    }
  }

  const handleError = (err: any): void => {
    const isNE = isNetworkError(err); //TODO check if viable

    setLoadingState(() => ({
      initialized: false,
      state: isNE ? 'networkError' : 'idle',
    }));

    if (isExternalError(err)) {
      let error: ExternalError = err;

      if (onError) {
        onError({error, isNetworkError: isNE, reload});
      } else if (isExternalError(err)) {
        error.show();
      }
    }
  };
  //#endregion

  const reload = useCallback(() => setInternalTrigger(Date.now()), []);

  const callTrigger = useCallback(() => setExternalTrigger(Date.now()), []);

  const clearApiData = () => setApiData(undefined);

  useEffect(() => {
    const ApiRequest = new ApiService<RequestParams, ReturnParams>(
      method,
      endpoint,
      requestParams,
    );

    call(ApiRequest);

    return () => {
      loadingState.state !== 'idle' && ApiRequest.abort();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [internalTrigger, externalTrigger]);

  return useMemo<ApiCallReturns<ReturnParams>>(() => {
    return {
      callTrigger,
      clearApiData,
      data: apiData || initialDataSource,
      loadingState: loadingState.state,
      initialized: loadingState.initialized,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiData, loadingState]);
}

export default useApiCall;
