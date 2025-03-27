import React, {FC, useMemo} from 'react';
import {View, StyleSheet, Pressable} from 'react-native';

import Animated, {EasingNode} from 'react-native-reanimated';

import {
  Icon,
  Price,
  AppText,
  SeparatorLine,
  PressableOpacity,
} from '@components/atoms';
import {CheckoutModalOrderListItem} from '@components/molecules';

import {useCollapsible} from '@hooks';

import {
  getNoun,
  toJsTimestamp,
  getDistanceFromLatLonInKm,
  JS_TIMESTAMP_HOUR,
} from '@utils';

import {scale} from '@styles/mixins';
import {Colors} from '@styles/colors';
import {CommonStyles} from '@styles/common';
import {SIZE_16, SIZE_32, SIZE_8} from '@styles/sizes';

import type {
  Location,
  PickPoint,
  PickPointSectionListDate,
  OnProceedToCheckoutButtonPressFn,
} from '@types';
import {Literals} from '@styles/typography';

interface PickPointListItemProps {
  dataSource: PickPoint;
  userLocation?: Location;
  onShowOnMapButtonPress: (item: PickPoint) => void;
  onProceedToCheckoutButtonPress: OnProceedToCheckoutButtonPressFn;
  dateFilter?: PickPointSectionListDate;
}

const PickPointListItem: FC<PickPointListItemProps> = ({
  dataSource,
  userLocation,
  onShowOnMapButtonPress,
  onProceedToCheckoutButtonPress,
  dateFilter = 'today',
}) => {
  //#region ANIMATION
  const {
    onCollapsibleNodeLayout,
    onCollapsibleTriggerFire,
    animatedHeight,
    state: collapsibleState,
  } = useCollapsible({
    duration: 200,
    easing: EasingNode.ease,
  });
  //#endregion

  //#region PROPS
  const basedOnPickPointAmount = useMemo(
    () => (dateFilter === 'today' ? true : false),
    [dateFilter],
  );
  const readyToCheckout = useMemo(
    () => (collapsibleState === 'expanded' ? true : false),
    [collapsibleState],
  );
  //#endregion

  //#region BINDINGS
  const onProceedToCheckoutButtonPressHandler = () =>
    readyToCheckout
      ? onProceedToCheckoutButtonPress(dataSource, dateFilter)
      : onCollapsibleTriggerFire();
  //#endregion

  //#region PARTS
  const approxDistanceText = useMemo(
    () =>
      userLocation
        ? `${getDistanceFromLatLonInKm(
            userLocation.latitude,
            userLocation.longitude,
            parseFloat(dataSource.map.lat),
            parseFloat(dataSource.map.lon),
          )} ${Literals.distance}`
        : 'Показать на карте',
    [dataSource.map, userLocation],
  );

  const totalPrice = useMemo<number>(() => {
    return (
      Math.round(
        dataSource.productList.reduce(
          (acc, product) =>
            basedOnPickPointAmount
              ? product.available > 0
                ? acc + product.price * product.quantity
                : acc
              : product.totalAvailable > 0
              ? acc + product.price * product.quantity
              : acc,
          0,
        ) * 100,
      ) / 100
    );
  }, [dataSource.productList, basedOnPickPointAmount]);

  const checkoutButtonLabel = useMemo(
    () => (readyToCheckout ? 'Оформить' : 'Выбрать'),
    [readyToCheckout],
  );

  const pickPointOpened = useMemo(
    () =>
      dataSource.timeUntilClosing === 0 && dateFilter === 'today'
        ? false
        : true,
    [dataSource.timeUntilClosing, dateFilter],
  );

  const TimeUntilClosedComponent = useMemo(() => {
    if (
      typeof dataSource.timeUntilClosing === 'number' &&
      dateFilter === 'today'
    ) {
      const jsTime = toJsTimestamp(dataSource.timeUntilClosing);

      if (jsTime < JS_TIMESTAMP_HOUR) {
        const minutesUntilClosing = new Date(jsTime).getMinutes();
        const color =
          minutesUntilClosing <= 15 ? Colors.error.default : Colors.gray5;
        return (
          <View style={styles.additionalInfoWrapper}>
            <Icon
              name="time-line"
              color={color}
              size={16}
              style={styles.additionalInfoIcon}
            />
            <AppText type="small" color={color}>
              {minutesUntilClosing === 0
                ? 'Сейчас закрыто'
                : `Аптека закроется через ${minutesUntilClosing} ${getNoun(
                    minutesUntilClosing,
                    'минуту',
                    'минуты',
                    'минут',
                  )}`}
            </AppText>
          </View>
        );
      }
    }
    return null;
  }, [dataSource.timeUntilClosing, dateFilter]);

  const ProductListComponent = useMemo(
    () =>
      dataSource.productList.map((product, index) => (
        <CheckoutModalOrderListItem
          key={index.toString()}
          dataSource={product}
          basedOnPickPointAmount={basedOnPickPointAmount}
        />
      )),
    [basedOnPickPointAmount, dataSource.productList],
  );
  //#endregion
  return (
    <View style={styles.container}>
      <View style={CommonStyles.centrizedRow}>
        <AppText type="control" wrapperStyle={styles.nameWrapper}>
          {dataSource.address}
        </AppText>
        <PressableOpacity onPress={onCollapsibleTriggerFire}>
          <AppText type="link" color={Colors.gray8}>
            {`Товаров ${
              basedOnPickPointAmount
                ? dataSource.productCount
                : dataSource.productList.length
            } из ${dataSource.productList.length}`}
          </AppText>
        </PressableOpacity>
      </View>
      <View>
        <PressableOpacity
          onPress={() => onShowOnMapButtonPress(dataSource)}
          style={styles.additionalInfoWrapper}>
          <Icon
            name="map-pin-2-line"
            color={Colors.gray5}
            size={16}
            style={styles.additionalInfoIcon}
          />
          <AppText type="small" color={Colors.gray5}>
            {approxDistanceText}
          </AppText>
        </PressableOpacity>
        {TimeUntilClosedComponent}
      </View>
      <View style={CommonStyles.centrizedRow}>
        {totalPrice > 0 ? (
          <>
            <Price actualPrice={totalPrice} />
            <Pressable
              disabled={!pickPointOpened}
              onPress={onProceedToCheckoutButtonPressHandler}
              style={({pressed}) => [
                styles.selectButton,
                {
                  backgroundColor: pickPointOpened
                    ? pressed
                      ? Colors.accent.pressed
                      : Colors.accent.default
                    : Colors.gray2,
                },
              ]}>
              <AppText
                type="small"
                color={pickPointOpened ? Colors.white : Colors.gray7}>
                {checkoutButtonLabel}
              </AppText>
            </Pressable>
          </>
        ) : (
          <View style={styles.unavailableTextContainer}>
            <AppText type="control">{'Товаров нет в наличии'}</AppText>
          </View>
        )}
      </View>
      <Animated.View style={[styles.collapsible, {height: animatedHeight}]}>
        <Animated.View
          onLayout={onCollapsibleNodeLayout}
          style={[styles.collapsibleContentContainer]}>
          <>
            <SeparatorLine offsets={{top: SIZE_16}} color={Colors.gray4} />
            {ProductListComponent}
          </>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SIZE_16,
    borderRadius: SIZE_8,
    backgroundColor: Colors.gray1,
    marginBottom: SIZE_8,
  },
  nameWrapper: {
    marginBottom: SIZE_8 / 2,
  },
  bottomTextWrapper: {
    marginBottom: SIZE_8,
  },
  selectButton: {
    height: SIZE_32,
    width: scale(102),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scale(4),
  },
  unavailableTextContainer: {
    height: SIZE_32,
    justifyContent: 'center',
  },
  collapsible: {
    overflow: 'hidden',
  },
  collapsibleContentContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: scale(9),
  },
  additionalInfoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZE_8,
  },
  additionalInfoIcon: {
    marginRight: SIZE_8,
  },
});

export default PickPointListItem;
