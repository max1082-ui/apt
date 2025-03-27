import React, {FC, useRef, useMemo, useState, useCallback} from 'react';
import {Platform, StyleSheet} from 'react-native';

import type {LayoutChangeEvent} from 'react-native';

import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';

import {useHeaderHeight} from '@react-navigation/stack';

import {PickPointMapModal} from '@components/organisms';

import {Images} from '@assets';

import {
  SIZE_8,
  SIZE_16,
  SIZE_24,
  SIZE_32,
  SIZE_48,
  WINDOW_GUTTER,
  MAP_MARKER_SIZE,
} from '@styles/sizes';
import {scale} from '@styles/mixins';
import {Colors} from '@styles/colors';

import type {
  PickPoint,
  PickPointMapModalRefObject,
  OnProceedToCheckoutButtonPressFn,
} from '@types';

interface PickPointMapProps {
  dataSource: PickPoint[];
  // userLocation?: Location; //см в деструктуризации пропсов
  onProceedToCheckoutButtonPress: OnProceedToCheckoutButtonPressFn;

  initialPickPoint?: PickPoint;
  //TODO initialDateFilter;
}

const PickPointMap: FC<PickPointMapProps> = ({
  // userLocation, //FIXME нужна ли? хз че хотят от меня с этими правками, сделал как просили теперь видно при инициализации все аптеки... добавят другие города - будет вообще прикол
  onProceedToCheckoutButtonPress,
  initialPickPoint,
  dataSource = [],
}) => {
  //#region MODAL IMPERIUM
  const modalRef = useRef<PickPointMapModalRefObject>(null);
  //#endregion

  //#region STATE
  const headerHeight = useHeaderHeight();
  const [modalHeight, setModalHeight] = useState<number>(0);
  const [mapHeight, setMapHeight] = useState<number>(0);

  const maxProductListHeight = useMemo(
    () =>
      mapHeight -
      headerHeight -
      scale(49) -
      scale(64) -
      SIZE_24 -
      SIZE_24 * 2 - //checkbox & time
      SIZE_8, //checkbox & time margin
    [headerHeight, mapHeight],
  );
  //#endregion

  const mapRef = useRef<MapView>(null);

  const zoomToMarker = useCallback((pp: PickPoint) => {
    mapRef.current?.animateCamera({
      center: {
        latitude: parseFloat(pp.map.lat),
        longitude: parseFloat(pp.map.lon),
      },
      zoom: 16,
    });
  }, []);

  const onMarkerPress = (pickPoint: PickPoint) => {
    if (
      modalRef.current &&
      modalRef.current.selectedPickPointId !== pickPoint.id
    ) {
      modalRef.current.open(pickPoint);
      zoomToMarker(pickPoint);
    }
  };

  const onModalHeightLayout = useCallback(
    ({
      nativeEvent: {
        layout: {height},
      },
    }: LayoutChangeEvent) => setModalHeight(height),
    [],
  );

  const onMapReady = useCallback(() => {
    if (mapRef.current) {
      if (initialPickPoint) {
        modalRef.current && modalRef.current.open(initialPickPoint);
        mapRef.current.setCamera({
          center: {
            latitude: parseFloat(initialPickPoint.map.lat),
            longitude: parseFloat(initialPickPoint.map.lon),
          },
          zoom: 16,
        });
      } else {
        if (Platform.OS === 'android') {
          mapRef.current.fitToCoordinates(
            dataSource.map((item) => ({
              latitude: parseFloat(item.map.lat),
              longitude: parseFloat(item.map.lon),
            })),
            {
              edgePadding: {
                top: SIZE_48,
                bottom: SIZE_32,
                left: SIZE_16,
                right: SIZE_16,
              },
              animated: false,
            },
          );
        } else {
          mapRef.current.fitToElements({
            edgePadding: {
              top: SIZE_48,
              bottom: SIZE_32,
              left: SIZE_16,
              right: SIZE_16,
            },
            animated: false,
          });
        }
      }
    }
  }, [initialPickPoint, dataSource]);
  return (
    <>
      <MapView
        provider={PROVIDER_GOOGLE}
        onLayout={({
          nativeEvent: {
            layout: {height},
          },
        }) => setMapHeight(height)}
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        toolbarEnabled={false}
        onMapReady={onMapReady}>
        {dataSource.map((pickPoint, index) => (
          // TODO move to separate component with memoize
          <Marker
            identifier={pickPoint.id.toString()}
            key={index}
            coordinate={{
              latitude: parseFloat(pickPoint.map.lat),
              longitude: parseFloat(pickPoint.map.lon),
            }}
            onPress={() => {
              onMarkerPress(pickPoint);
            }}
            tracksViewChanges={false}
            icon={Images.mapMarker}
            style={styles.marker}
            centerOffset={{x: -MAP_MARKER_SIZE / 2, y: 0}}
          />
        ))}
      </MapView>
      <PickPointMapModal
        ref={modalRef}
        modalHeight={modalHeight}
        maxProductListHeight={maxProductListHeight}
        onModalHeightLayout={onModalHeightLayout}
        onProceedToCheckoutButtonPress={onProceedToCheckoutButtonPress}
      />
    </>
  );
};

const styles = StyleSheet.create({
  modal: {
    width: '100%',
    paddingVertical: SIZE_24,
    backgroundColor: Colors.white,
    borderTopLeftRadius: SIZE_16,
    borderTopRightRadius: SIZE_16,
    position: 'absolute',
    bottom: 0,
  },
  selectStoreButtonWrapper: {
    paddingTop: SIZE_24,
    paddingHorizontal: WINDOW_GUTTER,
    backgroundColor: Colors.white,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  marker: {
    height: MAP_MARKER_SIZE,
  },
});

export default PickPointMap;
