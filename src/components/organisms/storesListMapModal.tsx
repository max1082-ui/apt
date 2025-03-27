import React, {FC, useEffect, useMemo} from 'react';
import {StyleSheet, View, LayoutChangeEvent} from 'react-native';
import {useSelector} from 'react-redux';

import {
  AppButton,
  AppText,
  DragIndicator,
  ProgressiveImage,
} from '@components/atoms';
import {AnimatedModal} from '@components/molecules';

import {useModalAnimation} from '@hooks';

import {getDistanceFromLatLonInKm} from '@utils';

import {Colors} from '@styles/colors';
import {Literals} from '@styles/typography';
import {padding, scale} from '@styles/mixins';
import {SIZE_8, SIZE_16, WINDOW_GUTTER, WINDOW_WIDTH} from '@styles/sizes';

import type {DefaultStore, Location, Store} from '@types';
import {CombinedState, DefaulStoreSliceState} from '@state/types';

interface StoresListMapModalProps {
  openModalTrigger: number;
  modalHeight: number;
  userLocation?: Location;
  selectedStore?: Store;
  onDefaultStoreSelectButtonPress?: (store: DefaultStore) => void;
  onModalHeightLayout: (e: LayoutChangeEvent) => void;
}

const StoresListMapModal: FC<StoresListMapModalProps> = ({
  openModalTrigger,
  modalHeight,
  userLocation,
  selectedStore,
  onDefaultStoreSelectButtonPress,
  onModalHeightLayout,
}) => {
  const {data: defaultStoreData} = useSelector<
    CombinedState,
    {data: DefaulStoreSliceState['data']}
  >((state) => ({
    data: state.defaultStore.data,
  }));

  const snapPointsFromTop = useMemo(() => {
    return {full: 0, close: modalHeight};
  }, [modalHeight]);

  const {
    modalState,
    translateY,
    onGestureEvent,
    onHandlerStateChange,
    changeModalState,
  } = useModalAnimation(snapPointsFromTop);

  useEffect(() => {
    if (selectedStore) {
      changeModalState('full');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStore, openModalTrigger]);

  return (
    <AnimatedModal
      modalState={modalState}
      onModalHeightLayout={onModalHeightLayout}
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
      changeModalState={changeModalState}
      translateY={translateY}>
      <>
        <View style={styles.dragIndicatorContainer}>
          <DragIndicator />
        </View>
        <View style={styles.modalContent}>
          {selectedStore && (
            <ProgressiveImage
              source={{
                uri: selectedStore.photo,
              }}
              style={styles.modalImage}
            />
          )}
          <AppText
            type="control"
            color={Colors.gray6}
            wrapperStyle={styles.addressWrapper}>
            {`Адрес аптеки: ${selectedStore?.city}, ${selectedStore?.address}`}
          </AppText>
          {userLocation && selectedStore && (
            <AppText
              type="small"
              color={Colors.gray5}
              wrapperStyle={styles.distanceWrapper}>
              {`~${getDistanceFromLatLonInKm(
                userLocation.latitude,
                userLocation.longitude,
                parseFloat(selectedStore.map.lat),
                parseFloat(selectedStore.map.lon),
              )} ${Literals.distance} от вас`}
            </AppText>
          )}
          {selectedStore && onDefaultStoreSelectButtonPress && (
            <AppButton
              disabled={defaultStoreData?.id === selectedStore.id}
              containerStyle={styles.selectedStoreButtonContainer}
              label={'Выбрать аптеку'}
              onPress={() =>
                onDefaultStoreSelectButtonPress({
                  id: selectedStore.id,
                  address: selectedStore.address,
                })
              }
            />
          )}
        </View>
      </>
    </AnimatedModal>
  );
};

const styles = StyleSheet.create({
  dragIndicatorContainer: {
    position: 'absolute',
    top: SIZE_16,
    alignSelf: 'center',
  },
  modalContent: {
    ...padding(SIZE_16, SIZE_16, 0, SIZE_16),
  },
  modalImage: {
    width: WINDOW_WIDTH - 2 * WINDOW_GUTTER,
    height: scale(130),
    borderRadius: SIZE_8,
    marginBottom: SIZE_16,
  },
  addressWrapper: {
    marginBottom: SIZE_8,
  },
  distanceWrapper: {
    marginBottom: SIZE_8,
  },
  selectedStoreButtonContainer: {
    marginVertical: SIZE_16,
  },
});

export default StoresListMapModal;
