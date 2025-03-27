import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';

import type {AuthWelcomeScreenProps} from '@navigation/types';

import {AppButton, AppText} from '@components/atoms';

import {Colors} from '@styles/colors';
import {SIZE_16, SIZE_24, SIZE_40, SIZE_8, WINDOW_GUTTER} from '@styles/sizes';

const AuthWelcomeScreen: FC<AuthWelcomeScreenProps> = ({navigation}) => (
  <View style={styles.container}>
    <AppText type="h1" wrapperStyle={{marginBottom: SIZE_8}}>
      {'Давайте знакомиться!'}
    </AppText>
    <AppText
      type="bodyRegular"
      color={Colors.gray6}
      wrapperStyle={{marginBottom: SIZE_24}}>
      {'Укажите номер и мы сохраним ваши избранные товары, и любимые аптеки'}
    </AppText>
    <AppButton
      label={'Указать номер'}
      onPress={() =>
        navigation.push('AuthSignIn', {
          dismissButtonActionType: 'skip',
          onSuccessNavigationActionType: 'replace',
        })
      }
    />
    <AppText type="small" color={Colors.gray6} wrapperStyle={styles.smallText}>
      {'или'}
    </AppText>
    <AppButton
      label={'Пропустить'}
      type="secondary"
      onPress={() => navigation.replace('AppTabs')}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: WINDOW_GUTTER,
    marginBottom: SIZE_40,
    justifyContent: 'flex-end',
  },
  smallText: {
    marginVertical: SIZE_16,
    alignSelf: 'center',
  },
});

export default AuthWelcomeScreen;
