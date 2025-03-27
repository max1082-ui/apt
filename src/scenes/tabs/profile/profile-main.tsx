import React, {FC, useCallback, useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';

import type {ProfileMainScreenProps} from '@navigation/types';

import {
  AppText,
  AppButton,
  SectionButton,
  RequestUpdateIndicator,
} from '@components/atoms';
import {HeaderRightComponent} from '@components/organisms';

import {logoutThunk} from '@state/user';
import {useIsAuthorized, useThunkDispatch} from '@state/hooks';

import {scale} from '@styles/mixins';
import {CommonStyles} from '@styles/common';
import {WINDOW_GUTTER, SIZE_32} from '@styles/sizes';

const ProfileMainScreen: FC<ProfileMainScreenProps> = ({navigation}) => {
  const isAuthorized = useIsAuthorized();
  const dispatch = useThunkDispatch();

  //#region LOGOUT BUTTON & NAV LISTENER
  const [logoutProcessing, setLogoutProcessing] = useState<boolean>(false);
  const logout = useCallback(async () => {
    try {
      setLogoutProcessing(true);
      await dispatch(logoutThunk());
    } catch (err) {
      return;
    } finally {
      setLogoutProcessing(false);
    }
  }, [dispatch]);
  const headerRight = useCallback(
    () => (
      <HeaderRightComponent
        iconName="door-open-line"
        modalTitle={'Вы действительно хотите выйти\nиз акаунта?'}
        modalMessage={'Нам будет вас не хватать'}
        modalAction={logout}
      />
    ),
    [logout],
  );

  useEffect(() => {
    if (isAuthorized) {
      navigation.setOptions({headerRight});
    } else {
      navigation.setOptions({
        headerRight: undefined,
      });
    }
  }, [headerRight, isAuthorized, logout, navigation]);
  //#endregion

  return (
    <>
      <View style={[CommonStyles.fill, styles.container]}>
        <View style={[CommonStyles.centrizedRow, {marginBottom: scale(8)}]}>
          <SectionButton
            iconName="user-line"
            label="Мои данные"
            onPress={() => navigation.push('ProfilePersonalData')}
            disabled={!isAuthorized}
          />
          <SectionButton
            iconName="heart-3-line"
            label="Любимые аптеки"
            onPress={() => navigation.push('ProfileFavoriteStores')}
            disabled={!isAuthorized}
          />
        </View>
        <View style={[CommonStyles.centrizedRow, {marginBottom: scale(8)}]}>
          <SectionButton
            iconName="shopping-basket-2-line"
            label="Мои заказы"
            onPress={() => navigation.push('ProfileOrderList')}
            disabled={!isAuthorized}
          />
          <SectionButton
            iconName="message-3-line"
            label="Оставить отзыв"
            onPress={() => navigation.push('ProfileReviewAdd')}
          />
        </View>

        <SectionButton
          iconName="questionnaire-line"
          label="Нужна помощь"
          onPress={() => navigation.push('ProfileHelp')}
          width="wide"
        />

        {!isAuthorized && (
          <>
            <AppText wrapperStyle={{marginTop: scale(24)}}>
              {
                'Авторизуйтесь, чтобы пользоваться всеми возможностями приложения'
              }
            </AppText>
            <AppButton
              label="Авторизация"
              containerStyle={{marginTop: scale(16)}}
              onPress={() =>
                navigation.navigate('AuthStack', {
                  screen: 'AuthSignIn',
                  params: {
                    dismissButtonActionType: 'dismiss',
                    onSuccessNavigationActionType: 'pop',
                  },
                  initial: true,
                })
              }
            />
          </>
        )}
      </View>
      {logoutProcessing && <RequestUpdateIndicator />}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    paddingHorizontal: WINDOW_GUTTER,
    marginTop: SIZE_32,
  },
});

export default ProfileMainScreen;
