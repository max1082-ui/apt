import React, {FC, useCallback, useMemo} from 'react';
import {StyleSheet, Linking, Platform, View} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';

import {AppButton, AppText} from '@components/atoms';

import {SIZE_16, SIZE_32, SIZE_8, WINDOW_GUTTER} from '@styles/sizes';
import {Colors} from '@styles/colors';
import {showSnack} from '@utils';
import {CommonStyles} from '@styles/common';

interface UpdateRequiredLockScreenProps {
  requiredVersion?: string;
}

const UpdateRequiredLockScreen: FC<UpdateRequiredLockScreenProps> = ({
  requiredVersion,
}) => {
  const onGoToMarketButtonPress = useCallback(() => {
    const link = Platform.select({
      ios: 'https://аптекарь.рф',
      android: 'https://аптекарь.рф',
      default: 'https://аптекарь.рф',
    });
    Linking.canOpenURL(link).then(
      (supported) => {
        supported && Linking.openURL(link);
      },
      (err) => {
        showSnack({
          type: 'danger',
          message: 'Произошла ошибка: ' + err.message,
        });
        return;
      },
    );
  }, []);
  const buttonLabel = useMemo(
    () =>
      Platform.select({
        android: 'Перейти в Play Market',
        ios: 'Перейти в App Store',
        default: 'Перейти к обновлению',
      }),
    [],
  );
  return (
    <SafeAreaView style={styles.container}>
      <View style={[CommonStyles.fill, styles.textWrap]}>
        <AppText type="h1" wrapperStyle={styles.titleWrap}>
          {`Доступно обновление${
            requiredVersion ? '\n' + requiredVersion : ''
          }`}
        </AppText>
        <AppText wrapperStyle={styles.messageWrap}>
          {
            'В новой версии мы внесли несколько очень важных изменений и просим вас обязательно обновиться'
          }
        </AppText>
      </View>
      <AppButton label={buttonLabel} onPress={onGoToMarketButtonPress} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    justifyContent: 'center',

    paddingBottom: SIZE_16,
    paddingHorizontal: WINDOW_GUTTER,

    backgroundColor: Colors.white,
  },
  textWrap: {
    justifyContent: 'center',
  },
  titleWrap: {
    marginBottom: SIZE_32,
  },
  messageWrap: {
    marginBottom: SIZE_8,
  },
});

export default UpdateRequiredLockScreen;
