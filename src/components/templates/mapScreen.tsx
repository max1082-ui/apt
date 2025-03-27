//TODO шлифануть, убрать date-триггеры
import React, {FC, useCallback, useRef, useState} from 'react';
import {Platform, StyleSheet} from 'react-native';

import type {LayoutChangeEvent} from 'react-native';

import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';

import {StoresListMapModal} from '@components/organisms';

import {Images} from '@assets';

import {
  SIZE_16,
  SIZE_24,
  SIZE_32,
  SIZE_48,
  WINDOW_GUTTER,
  MAP_MARKER_SIZE,
} from '@styles/sizes';
import {Colors} from '@styles/colors';

import type {DefaultStore, Location, Store} from '@types';

interface MapScreenProps {
  dataSource: Store[];
  initialStore?: Store;
  userLocation?: Location;
  defaultStoreSelect?: (store: DefaultStore) => void;
}

const MapScreen: FC<MapScreenProps> = ({
  dataSource,
  userLocation,
  initialStore,
  defaultStoreSelect,
}) => {
  //#region STATE
  const [selectedStore, setSelectedStore] = useState<Store | undefined>(
    initialStore,
  );

  const [modalHeight, setModalHeight] = useState<number>(0);

  const [openModalTrigger, setOpenModalTrigger] = useState<number>(Date.now());
  //#endregion

  const mapRef = useRef<MapView>(null);

  const zoomToMarker = useCallback((store: Store) => {
    mapRef.current?.animateCamera({
      center: {
        latitude: parseFloat(store.map.lat),
        longitude: parseFloat(store.map.lon),
      },
      zoom: 16,
    });
  }, []);

  const onMarkerPress = (store: Store) => {
    setSelectedStore(store);
    setOpenModalTrigger(Date.now());
    zoomToMarker(store);
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
      if (initialStore) {
        //TODO ПЕРЕДЕЛАТЬ===============
        setSelectedStore(initialStore);
        setOpenModalTrigger(Date.now());
        //==============================
        mapRef.current.setCamera({
          center: {
            latitude: parseFloat(initialStore.map.lat),
            longitude: parseFloat(initialStore.map.lon),
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
  }, [initialStore, dataSource]);

  return (
    <>
      <MapView
        provider={PROVIDER_GOOGLE}
        ref={mapRef}
        style={styles.map}
        toolbarEnabled={false}
        onMapReady={onMapReady}>
        {dataSource.map((store, index) => (
          <Marker
            identifier={store.id.toString()}
            key={index.toString()}
            coordinate={{
              latitude: parseFloat(store.map.lat),
              longitude: parseFloat(store.map.lon),
            }}
            onPress={() => {
              onMarkerPress(store);
            }}
            icon={Images.mapMarker}
            style={{height: MAP_MARKER_SIZE}}
            centerOffset={{x: -MAP_MARKER_SIZE / 2, y: 0}}
          />
        ))}
      </MapView>
      <StoresListMapModal
        selectedStore={selectedStore}
        userLocation={userLocation}
        openModalTrigger={openModalTrigger}
        onModalHeightLayout={onModalHeightLayout}
        modalHeight={modalHeight}
        onDefaultStoreSelectButtonPress={defaultStoreSelect}
      />
    </>
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
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
});

export default MapScreen;
