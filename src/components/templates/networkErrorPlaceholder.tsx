import React, {FC} from 'react';
import {Image, StyleSheet, ImageBackground} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';

import {AppButton, AppText, RequestUpdateIndicator} from '@components/atoms';

import {DEFAULT_NETWORK_PLACEHOLDER_ERROR_TEXT} from '@services/error';

import {
  SIZE_8,
  SIZE_16,
  SIZE_24,
  WINDOW_GUTTER,
  WINDOW_WIDTH,
} from '@styles/sizes';
import {Colors} from '@styles/colors';
import {padding, scale} from '@styles/mixins';

import {Images} from '@assets';

interface NerworkErrorPlaceholderProps {
  onRefreshButtonPress: () => void;

  message?: string;
  isLoading?: boolean;
}
const IMAGE_HEIGHT = scale(339);
const CONTAINER_HEIGHT = scale(387);

const NetworkErrorPlaceholder: FC<NerworkErrorPlaceholderProps> = ({
  onRefreshButtonPress,

  isLoading = false,
  message = DEFAULT_NETWORK_PLACEHOLDER_ERROR_TEXT,
}) => (
  <ImageBackground
    source={Images.authBg}
    resizeMode="cover"
    style={styles.wrapper}>
    <Image source={Images.networkError} style={styles.image} />
    <SafeAreaView style={styles.container}>
      <AppText type="h1" wrapperStyle={styles.titleWrap}>
        {'Отсутствует\nподключение к сети'}
      </AppText>
      <AppText
        color={Colors.gray6}
        wrapperStyle={styles.messageWrap}
        minNumberOfLines={2}>
        {message}
      </AppText>
      <AppButton label={'Обновить'} onPress={onRefreshButtonPress} />
    </SafeAreaView>
    {isLoading && <RequestUpdateIndicator />}
  </ImageBackground>
);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    height: CONTAINER_HEIGHT,
    ...padding(0, WINDOW_GUTTER, SIZE_16),

    justifyContent: 'flex-end',

    backgroundColor: Colors.white,
  },
  titleWrap: {
    marginBottom: SIZE_8,
  },
  messageWrap: {
    marginBottom: SIZE_24,
  },
  image: {
    height: IMAGE_HEIGHT,
    width: WINDOW_WIDTH,
    resizeMode: 'contain',

    position: 'absolute',
    bottom: CONTAINER_HEIGHT - SIZE_16,
  },
});

export default NetworkErrorPlaceholder;
