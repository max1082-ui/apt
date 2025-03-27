import React, {FC, useCallback} from 'react';
import {StyleSheet} from 'react-native';

import {CommonActions, StackActions} from '@react-navigation/routers';

import type {AuthVerificationScreenProps} from '@navigation/types';

import {FadeInView} from '@components/atoms';
import {CodeConfirm} from '@components/organisms';

import {getUserDataThunk} from '@state/user';
import {useThunkDispatch} from '@state/hooks';
import {checkNotificationsPermissionThunk} from '@state/notifications';

import ApiService from '@services/api';

import {WINDOW_GUTTER} from '@styles/sizes';

import type {
  AuthorizeUserResponse,
  AuthorizeUserRequestParams,
  AuthVerificationResponse,
  AuthVerificationRequestParams,
} from '@types';

const AuthVerificationScreen: FC<AuthVerificationScreenProps> = ({
  navigation,
  route: {
    params: {phone, onSuccessNavigationActionType},
  },
}) => {
  const dispatch = useThunkDispatch();

  //#region HANDLERS
  const onSuccessfulCodeConfirm = useCallback(async () => {
    try {
      await dispatch(getUserDataThunk());
      await dispatch(checkNotificationsPermissionThunk());
    } catch (err) {
      throw err;
    }
  }, [dispatch]);

  const onCodeInputComplete = useCallback(
    async (code) => {
      const requestParams = {code, phone};

      const ApiRequest = new ApiService<
        AuthVerificationRequestParams,
        AuthVerificationResponse
      >('POST', 'user/confirm/code', requestParams);

      // returns only status
      await ApiRequest.call();

      //successful verification final action
      await onSuccessfulCodeConfirm();
      if (onSuccessNavigationActionType === 'replace') {
        navigation.replace('AppTabs');
      } else {
        navigation.dispatch((state) => ({
          ...StackActions.popToTop(),
          source: state.key,
        }));
        navigation.dispatch({
          ...CommonActions.goBack(),
        });
      }
    },
    [navigation, onSuccessNavigationActionType, onSuccessfulCodeConfirm, phone],
  );
  //#endregion

  //#region REQUEST CODE
  const onRequestCodePress = async (): Promise<void> => {
    const requestParams = {phone};

    const ApiRequest = new ApiService<
      AuthorizeUserRequestParams,
      AuthorizeUserResponse
    >('POST', 'user/auth/phone', requestParams);
    await ApiRequest.call();
  };
  //#endregion

  return (
    <FadeInView style={styles.container}>
      <CodeConfirm
        phone={phone}
        onRequestCodePress={onRequestCodePress}
        onCodeInputComplete={onCodeInputComplete}
      />
    </FadeInView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: WINDOW_GUTTER,
  },
});

export default AuthVerificationScreen;
