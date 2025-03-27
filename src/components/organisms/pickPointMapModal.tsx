import React, {
  forwardRef,
  useMemo,
  useState,
  useEffect,
  useCallback,
  useImperativeHandle,
} from 'react';
import {StyleSheet, View} from 'react-native';

import type {ForwardRefRenderFunction} from 'react';
import type {LayoutChangeEvent} from 'react-native';

import {ScrollView} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import Animated, {interpolateNode} from 'react-native-reanimated';

import {
  Icon,
  Price,
  AppText,
  // Checkbox,
  AppButton,
  DragIndicator,
  PressableOpacity,
} from '@components/atoms';
import {AnimatedModal, CheckoutModalOrderListItem} from '@components/molecules';

import {useModalAnimation} from '@hooks';

import {
  getNoun,
  toJsTimestamp,
  getPriceWithValuableDecimals,
  JS_TIMESTAMP_HOUR,
} from '@utils';

import {scale} from '@styles/mixins';
import {Colors} from '@styles/colors';
import {Literals} from '@styles/typography';
import {SIZE_8, SIZE_16, SIZE_24, WINDOW_GUTTER} from '@styles/sizes';

import type {
  PickPoint,
  PickPointSectionListDate,
  PickPointMapModalRefObject,
  OnProceedToCheckoutButtonPressFn,
} from '@types';

interface PickPointMapModalProps {
  maxProductListHeight: number;
  modalHeight: number;
  onModalHeightLayout: (e: LayoutChangeEvent) => void;
  onProceedToCheckoutButtonPress: OnProceedToCheckoutButtonPressFn;
}

const PickPointMapModal: ForwardRefRenderFunction<
  PickPointMapModalRefObject,
  PickPointMapModalProps
> = (
  {
    maxProductListHeight,
    modalHeight,
    onModalHeightLayout,
    onProceedToCheckoutButtonPress,
  },
  ref,
) => {
  //#region MEASURES
  const {bottom: bottomInset} = useSafeAreaInsets();

  const [buttonContainerHeight, setButtonContainerHeight] = useState<number>(0);
  const [productListHeight, setProductListHeight] = useState<number>(0);

  const snapPointsFromTop = useMemo(() => {
    return {full: 0, short: productListHeight, close: modalHeight};
  }, [modalHeight, productListHeight]);
  //#endregion

  //#region STATE
  const [pickUpDate, setPickUpDate] =
    useState<PickPointSectionListDate>('today');
  const [dataSource, setDataSource] = useState<PickPoint | null>(null);

  const [onListLinkPressTrigger, setOnListLinkPressTrigger] = useState<number>(
    Date.now(),
  );
  //#endregion

  //#region ANIMATION
  const {
    modalState,
    translateY,
    onGestureEvent,
    onHandlerStateChange,
    changeModalState,
  } = useModalAnimation(snapPointsFromTop);

  const buttonTranslateY = useMemo(() => {
    if (modalHeight > productListHeight) {
      return interpolateNode(translateY, {
        inputRange: [0, productListHeight, modalHeight],
        outputRange: [0, 0, buttonContainerHeight + scale(90)],
      });
    } else {
      return buttonContainerHeight + scale(120);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalHeight, productListHeight]);

  useEffect(() => {
    if (dataSource && snapPointsFromTop.short) {
      changeModalState('short');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSource, snapPointsFromTop.short]);

  //#endregion

  //#region EFFECTS
  useEffect(() => {
    if (modalState === 'close' && dataSource !== null) {
      setPickUpDate('today');
      setDataSource(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalState]);
  //#endregion

  //#region BINDNIG
  const onProceedToCheckoutButtonPressHandler = useCallback(() => {
    dataSource && onProceedToCheckoutButtonPress(dataSource, pickUpDate);
  }, [dataSource, onProceedToCheckoutButtonPress, pickUpDate]);

  // const onDateCheckboxPress = useCallback(() => {
  //   changeModalState('full');
  //   setPickUpDate((current) => (current === 'today' ? 'tomorrow' : 'today'));
  // }, [changeModalState]);
  //#endregion

  //#region IMPERIUM
  const openModal = useCallback(
    (pp: PickPoint) => {
      setDataSource(pp);
      changeModalState('short');
    },
    [changeModalState],
  );

  useImperativeHandle(
    ref,
    () => ({
      open: (pickPoint) => {
        if (modalState !== 'close') {
          changeModalState('close');
          setTimeout(() => openModal(pickPoint), 500); // 250 is default runTiming duration, used in modal animation
        } else {
          openModal(pickPoint);
        }
      },
      dismiss: () => {
        changeModalState('close');
        setDataSource(null);
        setPickUpDate('today');
      },
      selectedPickPointId: dataSource?.id,
    }),
    [changeModalState, dataSource, modalState, openModal],
  );
  //#endregion

  //#region PROPS
  const basedOnPickPointAmount = useMemo(
    () => (pickUpDate === 'today' ? true : false),
    [pickUpDate],
  );
  //#endregion

  //#region PARTS
  const totalPrice = useMemo<number | null>(() => {
    return dataSource
      ? Math.round(
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
      : null;
  }, [dataSource, basedOnPickPointAmount]);

  const pickPointOpened = useMemo(
    () =>
      dataSource?.timeUntilClosing === 0 && pickUpDate === 'today'
        ? false
        : true,
    [dataSource?.timeUntilClosing, pickUpDate],
  );

  const TimeUntilClosedComponent = useMemo(() => {
    if (typeof dataSource?.timeUntilClosing === 'number') {
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
              size={20}
              style={styles.additionalInfoIcon}
            />
            <AppText type="small" color={color}>
              {minutesUntilClosing === 0
                ? 'Cейчас закрыто'
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
  }, [dataSource?.timeUntilClosing]);

  const ProductListComponent = useMemo(
    () =>
      dataSource?.productList.map((product, index) => (
        <CheckoutModalOrderListItem
          key={index.toString()}
          dataSource={product}
          basedOnPickPointAmount={basedOnPickPointAmount}
        />
      )),
    [basedOnPickPointAmount, dataSource?.productList],
  );
  //#endregion

  return (
    <>
      <AnimatedModal
        modalState={modalState}
        onListLinkPressTrigger={onListLinkPressTrigger}
        onModalHeightLayout={onModalHeightLayout}
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
        changeModalState={changeModalState}
        translateY={translateY}>
        <>
          <View style={styles.dragIndicatorContainer}>
            <DragIndicator />
          </View>
          {dataSource && (
            <>
              <View style={styles.headerContent}>
                <AppText type="small" color={Colors.gray5}>
                  {`${dataSource?.city}`}
                </AppText>
                <AppText type="control">{`${dataSource?.address}`}</AppText>
                <View style={styles.middleRow}>
                  {totalPrice !== null && totalPrice > 0 ? (
                    <Price actualPrice={totalPrice} />
                  ) : (
                    <AppText type="productPrice">
                      {'Товаров нет в наличии'}
                    </AppText>
                  )}
                  <PressableOpacity
                    onPress={() => setOnListLinkPressTrigger(Date.now())}
                    hitSlop={20}>
                    <AppText type="link" color={Colors.gray8}>
                      {`Товаров ${
                        basedOnPickPointAmount
                          ? dataSource.productCount
                          : dataSource.productList.length
                      } из ${dataSource.productList.length}`}
                    </AppText>
                  </PressableOpacity>
                </View>
              </View>

              <View
                style={{
                  paddingBottom: buttonContainerHeight - SIZE_24,
                }}>
                <ScrollView
                  onLayout={({
                    nativeEvent: {
                      layout: {height},
                    },
                  }) => setProductListHeight(height)}
                  style={{
                    maxHeight: maxProductListHeight,
                  }}
                  contentContainerStyle={styles.contentContainer}
                  centerContent>
                  {ProductListComponent}
                </ScrollView>
              </View>
            </>
          )}
        </>
      </AnimatedModal>
      <Animated.View
        onLayout={({
          nativeEvent: {
            layout: {height},
          },
        }) => setButtonContainerHeight(height)}
        style={[
          styles.selectStoreButtonWrapper,
          {
            paddingBottom: bottomInset + SIZE_24,
            transform: [
              {
                translateY: buttonTranslateY,
              },
            ],
          },
        ]}>
        {pickUpDate === 'today' && TimeUntilClosedComponent}
        {/* <Checkbox
          isActive={pickUpDate === 'tomorrow'}
          onPress={onDateCheckboxPress}
          label={'Забрать все товары завтра'}
        /> */}
        <AppButton
          disabled={totalPrice === 0 || !pickPointOpened}
          label={'Выбрать аптеку'}
          additionalText={
            totalPrice && totalPrice > 0
              ? `${getPriceWithValuableDecimals(totalPrice)} ${
                  Literals.currency
                }`
              : ' '
          }
          onPress={onProceedToCheckoutButtonPressHandler}
        />
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  selectStoreButtonWrapper: {
    paddingTop: SIZE_24,
    paddingHorizontal: WINDOW_GUTTER,
    backgroundColor: Colors.white,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  dragIndicatorContainer: {
    position: 'absolute',
    top: SIZE_16,
    alignSelf: 'center',
  },
  headerContent: {
    paddingHorizontal: SIZE_16,
    paddingBottom: SIZE_8,
    height: scale(64),
  },
  middleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SIZE_8,
  },
  contentContainer: {
    paddingHorizontal: WINDOW_GUTTER,
  },
  additionalInfoWrapper: {
    height: SIZE_24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  additionalInfoIcon: {
    marginRight: SIZE_8,
  },
});

export default forwardRef(PickPointMapModal);
