import React, {FC, useRef, useMemo, useState, useCallback, memo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';

import Modal from 'react-native-modal';
import {RectButton} from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Animated, {Clock, EasingNode, useValue} from 'react-native-reanimated';

import {
  Icon,
  Price,
  AppText,
  DragIndicator,
  SeparatorLine,
  AccessoryButton,
  ProgressiveImage,
  PressableOpacity,
} from '@components/atoms';

import CartProductQuantityController from './cartProductQuantityController';

import {
  useIsAuthorized,
  useFavoriteState,
  useProductCartState,
} from '@state/hooks';

import {getNoun, runTiming} from '@utils';

import {
  SIZE_8,
  SIZE_16,
  SIZE_32,
  WINDOW_WIDTH,
  WINDOW_GUTTER,
} from '@styles/sizes';
import {
  CommonStyles,
  DEFAULT_PRODUCT_IMAGE_BORDER_RADIUS,
} from '@styles/common';
import {Colors} from '@styles/colors';
import {Literals} from '@styles/typography';
import {padding, scale} from '@styles/mixins';

import type {CartProduct} from '@types';

interface CartListItemProps {
  dataSource: CartProduct;
  onPress?: (props?: any) => void;
}

const IMAGE_WIDTH = scale(48);

const SWIPEABLE_BUTTON_MINIMUM_WIDTH = scale(58);

const ICON_OFFSET_LEFT = WINDOW_WIDTH / 2;
const ICON_OFFSET_RIGHT = WINDOW_GUTTER;

const CartListItem: FC<CartListItemProps> = ({dataSource, onPress}) => {
  //#region AUTH
  const isAuthorized = useIsAuthorized();
  //#endregion
  //#region STOCK
  const inStock = useMemo<boolean>(
    () => (dataSource.store.amount > 0 ? true : false),
    [dataSource.store],
  );
  //#endregion

  //#region CONTROLS
  const [controlsModalVisible, setControlsModalVisible] =
    useState<boolean>(false);
  const openModal = useCallback(() => setControlsModalVisible(true), []);
  const dismissModal = useCallback(() => setControlsModalVisible(false), []);

  const {
    selectedQuantity,

    addEnabled,
    substractEnabled,

    addCartQuantity,
    substractCartQuantity,
    removeFromCart,
  } = useProductCartState({
    inStock,
    id: dataSource.id,
    name: dataSource.name,
    amount: dataSource.store.amount,
    sourceQuantity: dataSource.quantity,
  });

  const [doDerivedRemoveAction, setDoDerivedRemoveAction] = useState(false);
  const onModalControlsRemoveFromCartButtonPress = () => {
    setDoDerivedRemoveAction(true);
    setControlsModalVisible(false);
  };

  const onModalHide = useCallback(() => {
    doDerivedRemoveAction && removeFromCart();
  }, [doDerivedRemoveAction, removeFromCart]);
  //#endregion

  //#region FAVORITE
  const {isFavorite, favoriteProcessing, onFavoriteButtonPress} =
    useFavoriteState(dataSource.id, dataSource.name);
  //#endregion

  //#region SWIPEABLE
  const swipeableRef = useRef<Swipeable>(null);

  const iconClock = useRef(new Clock()).current;
  const iconDest = useValue<number>(ICON_OFFSET_RIGHT);
  const iconProgress = useValue<number>(0);
  const iconOffsetValue = useRef(
    runTiming({
      clock: iconClock,
      dest: iconDest,
      value: iconProgress,
      duration: 150,
      easing: EasingNode.inOut(EasingNode.ease),
    }),
  ).current;

  const onSwipeableOpen = () => {
    // Vibration.vibrate(1); //TODO test on device
    openModal();
    swipeableRef.current?.close();
  };

  const onSwipeableRightWillOpen = useCallback(() => {
    iconDest.setValue(ICON_OFFSET_LEFT);
  }, [iconDest]);
  const onSwipeableWillClose = useCallback(() => {
    iconDest.setValue(ICON_OFFSET_RIGHT);
  }, [iconDest]);
  //#endregion
  return (
    <>
      <Swipeable
        ref={swipeableRef}
        friction={1}
        rightThreshold={SWIPEABLE_BUTTON_MINIMUM_WIDTH}
        overshootRight={true}
        onSwipeableRightWillOpen={onSwipeableRightWillOpen}
        onSwipeableWillClose={onSwipeableWillClose}
        onSwipeableOpen={onSwipeableOpen}
        useNativeAnimations={false}
        renderRightActions={() => (
          <RectButton
            onPress={openModal}
            style={styles.swipeableActionButtonBase}>
            <Animated.View
              style={[CommonStyles.positionAbsolute, {right: iconOffsetValue}]}>
              <Icon size={22} name="pencil-fill" color={Colors.white} />
            </Animated.View>
          </RectButton>
        )}>
        <Pressable
          onPress={() => {
            onPress && onPress();
          }}
          style={styles.container}>
          <View style={styles.wrapper}>
            <ProgressiveImage
              source={{uri: dataSource.photo}}
              style={styles.image}
              resizeMode="contain"
            />
            <View style={styles.infoContainer}>
              <AppText
                type="small"
                numberOfLines={3}
                ellipsizeMode="tail"
                wrapperStyle={styles.infoItemWrapper}>
                {dataSource.name}
              </AppText>
              {dataSource.store.availability > 0 && (
                <AppText
                  type="productName"
                  color={Colors.gray6}
                  wrapperStyle={styles.infoItemWrapper}>
                  {`В наличии в ${dataSource.store.availability} ${getNoun(
                    dataSource.store.availability,
                    'аптеке',
                    'аптеках',
                    'аптеках',
                  )}`}
                </AppText>
              )}

              <View style={CommonStyles.centrizedRow}>
                {
                  <AppText
                    type="productName"
                    color={
                      Colors.gray6
                    }>{`${dataSource.quantity} ${Literals.measure}`}</AppText>
                }
                {dataSource.price && (
                  <Price
                    style={styles.priceWrap}
                    size="small"
                    align="right"
                    actualPrice={dataSource.price.actual * dataSource.quantity}
                    oldPrice={
                      dataSource.price?.old
                        ? dataSource.price.old * dataSource.quantity
                        : undefined
                    }
                  />
                )}
              </View>
            </View>
            {inStock && (
              <View style={styles.controlsContainer}>
                <PressableOpacity
                  hitSlop={20}
                  disabled={!inStock}
                  onPress={openModal}>
                  <Icon name="more-2-line" color={Colors.gray5} size={22} />
                </PressableOpacity>
              </View>
            )}
          </View>
        </Pressable>
      </Swipeable>
      <SeparatorLine
        offsets={{top: SIZE_8, bottom: SIZE_8, right: SIZE_16, left: SIZE_16}}
      />
      <Modal
        swipeDirection={['down']}
        useNativeDriverForBackdrop
        isVisible={controlsModalVisible}
        backdropColor={Colors.backdropDark}
        onSwipeComplete={dismissModal}
        onBackdropPress={dismissModal}
        onBackButtonPress={dismissModal}
        onModalHide={onModalHide}
        style={styles.modalBackdrop}>
        <View style={styles.modalControlsContainer}>
          <DragIndicator wrapperStyle={styles.dragIndicatorWrapper} />
          <View style={styles.modalQuantityControllerContainer}>
            <CartProductQuantityController
              value={selectedQuantity}
              addEnabled={addEnabled}
              substractEnabled={substractEnabled}
              onAddPress={addCartQuantity}
              onSubstractPress={substractCartQuantity}
            />
            <SeparatorLine color={Colors.gray4} />
          </View>
          <View style={styles.modalControlsButtonsRow}>
            {isAuthorized && (
              <AccessoryButton
                disabled={favoriteProcessing}
                onPress={onFavoriteButtonPress}
                label={isFavorite ? 'В избранном' : 'В избранное'}
                containerStyle={styles.moldalControlsButton}
                AccessoryComponent={
                  <Icon
                    size={22}
                    name={isFavorite ? 'heart-3-fill' : 'heart-3-line'}
                    color={Colors.black}
                    style={styles.modalControlButtonIcon}
                  />
                }
              />
            )}
            <AccessoryButton
              onPress={onModalControlsRemoveFromCartButtonPress}
              label={'Удалить'}
              containerStyle={[
                styles.moldalControlsButton,
                !isAuthorized && styles.singleModalControlsButton,
              ]}
              AccessoryComponent={
                <Icon size={24} name={'close-line'} color={Colors.black} />
              }
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  //#region BASE
  container: {
    paddingHorizontal: WINDOW_GUTTER,
    backgroundColor: Colors.white,
  },
  wrapper: {
    flexDirection: 'row',
  },
  image: {
    width: IMAGE_WIDTH,
    height: IMAGE_WIDTH,
    alignSelf: 'center',
    borderRadius: DEFAULT_PRODUCT_IMAGE_BORDER_RADIUS,
  },
  infoContainer: {
    flex: 1,
    paddingLeft: SIZE_8,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  infoItemWrapper: {
    marginBottom: SIZE_8,
  },
  controlsContainer: {
    alignItems: 'center',
  },
  priceWrap: {
    marginLeft: SIZE_16,
  },
  //#endregion

  //#region SWIPEABLE
  swipeableActionButtonBase: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',

    backgroundColor: Colors.basic1,
  },
  //#endregion

  //#region MODAL
  modalBackdrop: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  dragIndicatorWrapper: {
    alignSelf: 'center',
    marginBottom: SIZE_32,
  },
  modalControlsContainer: {
    width: WINDOW_WIDTH,
    ...padding(SIZE_16, SIZE_16, SIZE_32),
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: Colors.white,
  },
  modalQuantityControllerContainer: {
    marginBottom: SIZE_16,
  },
  modalControlsButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moldalControlsButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  singleModalControlsButton: {
    flex: 1,
  },
  modalControlButtonIcon: {
    marginRight: SIZE_8,
  },
  //#endregion
});

export default memo(CartListItem);
