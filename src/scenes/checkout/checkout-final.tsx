import React, {FC, ReactNode, useCallback, useState} from 'react';
import {StyleSheet} from 'react-native';

import {ScrollView} from 'react-native-gesture-handler';

import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {HeaderBackButton} from '@react-navigation/stack';

import type {CheckoutFinalScreenProps} from '@navigation/types';

import {useMount} from '@hooks';

import {
  AppButton,
  AppText,
  FadeInView,
  ProgressiveImage,
} from '@components/atoms';

import {
  SIZE_16,
  SIZE_24,
  WINDOW_GUTTER,
  DEFAULT_BORDER_RADIUS,
} from '@styles/sizes';
import {scale} from '@styles/mixins';
import {Colors} from '@styles/colors';
import {CommonStyles} from '@styles/common';

const CheckoutFinalScreen: FC<CheckoutFinalScreenProps> = ({
  route: {
    params: {orderId, imageSource, descriptionData, warningText},
  },
  navigation,
}) => {
  //#region INSETS
  const {bottom: safeAreaBottomInset} = useSafeAreaInsets();
  //#endregion
  //#region NAV
  const navigateOrder = useCallback(
    () =>
      navigation.navigate('AppTabs', {
        screen: 'ProfileStack',
        params: {
          screen: 'ProfileOrderDetail',
          params: {orderId},
          initial: false,
        },
      }),
    [navigation, orderId],
  );

  const navigateMain = useCallback(
    () =>
      navigation.navigate('AppTabs', {
        screen: 'HomeStack',
        params: {screen: 'HomeMain', initial: true},
      }),
    [navigation],
  );
  //#endregion

  //#region BACKBUTTON
  useMount(() =>
    navigation.setOptions({
      headerLeft: ({onPress: _, ...restProps}) => (
        <HeaderBackButton
          {...restProps}
          onPress={() =>
            navigation.navigate('AppTabs', {
              screen: 'CartStack',
              params: {screen: 'CartMain'},
            })
          }
        />
      ),
    }),
  );
  //#endregion

  //#region RENDER
  const renderTextRow = useCallback<
    (item: {title: string; text: string}, index?: number) => ReactNode
  >(
    (item, index) => (
      <AppText
        key={typeof index === 'number' ? index.toString(10) : undefined}
        type="control"
        color={Colors.gray6}
        wrapperStyle={styles.textRow}>
        {`${item.title}: `}
        <AppText type="control">{item.text}</AppText>
      </AppText>
    ),
    [],
  );
  //#endregion

  //#region SCROLLVIEW
  const [minListContentContainerHeight, setMinListContentContainerHeight] =
    useState<number>(0);
  //#endregion
  return (
    <ScrollView
      style={[CommonStyles.fill, {marginBottom: safeAreaBottomInset}]}
      contentContainerStyle={[
        styles.contentContainer,
        {minHeight: minListContentContainerHeight},
      ]}
      onLayout={({
        nativeEvent: {
          layout: {height},
        },
      }) => setMinListContentContainerHeight(height)}>
      {renderTextRow({title: 'Номер заказа', text: orderId.toString(10)})}
      <ProgressiveImage source={{uri: imageSource}} style={styles.image} />
      {descriptionData.map(renderTextRow)}
      <AppText type="control" wrapperStyle={styles.textRow}>
        {warningText}
      </AppText>
      <AppButton type="tretiary" label="К заказу" onPress={navigateOrder} />
      <FadeInView delay={300} style={styles.bottomButtonContainer}>
        <AppButton label="На главную" onPress={navigateMain} />
      </FadeInView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: SIZE_16,
    paddingHorizontal: WINDOW_GUTTER,
  },
  textRow: {
    marginBottom: SIZE_16,
  },
  image: {
    width: '100%',
    height: scale(130),
    marginBottom: SIZE_16,
    borderRadius: DEFAULT_BORDER_RADIUS,
  },
  bottomButtonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: SIZE_24,
  },
});

export default CheckoutFinalScreen;
