import 'react-native-gesture-handler'; //to solve the issue with back-nav crash in release builds

import React, {FC, useCallback, useEffect, useState} from 'react';
import {AppState, Platform, StatusBar} from 'react-native';

import DeviceInfo from 'react-native-device-info';

import {RootStack} from './navigation';

import {NavigationContainer} from '@react-navigation/native';

import {enableScreens} from 'react-native-screens';
import SplashScreen from 'react-native-splash-screen';

import RNFlashMessage from 'react-native-flash-message';

import remoteConfig from '@react-native-firebase/remote-config';

import {Loader} from '@components/atoms';
import {
  NetworkErrorPlaceholder,
  UpdateRequiredLockScreen,
} from '@components/templates';

import {getCartThunk} from '@state/cart';
import {getUserDataThunk} from '@state/user';
import {useThunkDispatch} from '@state/hooks';
import {checkNotificationsPermissionThunk} from '@state/notifications';
import {getDefaultStoreThunk} from '@state/defaultStore';

import {
  isNetworkError,
  DEFAULT_NETWORK_PLACEHOLDER_ERROR_TEXT,
} from '@services/error';
import Notifications from '@services/notifications';
import {requestAccessTokens} from '@services/token';

import {useMount} from '@hooks';

import {compareVersions, IS_PRODUCTION} from '@utils';

import {APP_SNACK_COLOR_THEME, Colors} from '@styles/colors';

const FBC_REQUIRED_VERSION_KEY = 'requiredVersion';

enableScreens();

//#region SNACK
RNFlashMessage.setColorTheme(APP_SNACK_COLOR_THEME);
//#endregion

Notifications.setBackgroundHandler();

const App: FC = () => {
  const dispatch = useThunkDispatch();

  const [isLoading, setisLoading] = useState<boolean>(true);
  const [loadingError, setLoadingError] = useState<string | undefined>();
  const [initialized, setInitialized] = useState<boolean>(false);

  const [internalTrigger, setInternalTrigger] = useState<number>(Date.now());
  const refresh = useCallback(() => setInternalTrigger(Date.now()), []);

  useMount(async () => {
    const unsubscribe = AppState.addEventListener(
      'change',
      (status: string) => {
        status === 'active' && Notifications.clearBadges();
      },
    );
    return unsubscribe;
  });

  useEffect(() => {
    if (!initialized && !isLoading) {
      SplashScreen.hide();
      dispatch(checkNotificationsPermissionThunk());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  //#region VERSIONS_CHECK
  const [updateRequired, setUpdateRequired] = useState<{
    cond: boolean;
    version?: string;
  }>({cond: false});
  //#endregion

  //#region APP INIT
  const init = useCallback(async () => {
    try {
      //#region REMOTE CONFIG
      const currentVersion = DeviceInfo.getVersion();
      const hasRemoteConfig = await remoteConfig()
        .setDefaults({
          [FBC_REQUIRED_VERSION_KEY]: currentVersion,
        })
        .then(() => remoteConfig().fetchAndActivate())
        .then((fetchedRemotely) => {
          return Platform.OS === 'android' ? true : fetchedRemotely; //на андроиде всегда резолвит false даже если фетч и активейт отработали корректно и данные получаем корректные (если что вызывать последовательно fetch() затем activate() пробовал - такая же срань)
        })
        .catch(() => {
          return false;
        });

      if (hasRemoteConfig) {
        const requiredVersion = remoteConfig().getString(
          FBC_REQUIRED_VERSION_KEY,
        );

        const compareVersionsResult = compareVersions(
          currentVersion,
          requiredVersion,
        );

        if (compareVersionsResult === 'missmatch' && IS_PRODUCTION) {
          setUpdateRequired({cond: true, version: requiredVersion});
          return; // выйди и зайди нормально после того как обновишься
        }
      }
      //#endregion

      //#region THROWS
      await requestAccessTokens();
      //#endregion

      //#region USER
      await dispatch(getUserDataThunk());
      //#endregion

      //#region NO THROWS (internal error handling)
      await dispatch(getCartThunk());
      await dispatch(getDefaultStoreThunk());
      //#endregion
      setLoadingError(undefined);
    } catch (err) {
      setLoadingError(
        isNetworkError(err)
          ? DEFAULT_NETWORK_PLACEHOLDER_ERROR_TEXT
          : err.message,
      );
    } finally {
      setisLoading(false);
      !initialized && setInitialized(true);
    }
  }, [dispatch, initialized]);

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [internalTrigger]);
  //#endregion

  //#region HANDLERS
  const onRefreshButtonPress = useCallback(() => {
    setisLoading(true);
    refresh();
  }, [refresh]);
  //#endregion

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      {!initialized ? null : updateRequired.cond ? (
        <UpdateRequiredLockScreen requiredVersion={updateRequired.version} />
      ) : loadingError ? (
        <NetworkErrorPlaceholder
          isLoading={isLoading}
          message={loadingError}
          onRefreshButtonPress={onRefreshButtonPress}
        />
      ) : isLoading ? (
        <Loader size="large" />
      ) : (
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      )}
      <RNFlashMessage />
    </>
  );
};

export default App;
