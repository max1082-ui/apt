import React, {FC} from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import {useSelector} from 'react-redux';

import {AppText, FavoriteButton} from '@components/atoms';

import {useFavoriteStoresState} from '@state/hooks';

import {getDistanceFromLatLonInKm} from '@utils';

import {Colors} from '@styles/colors';
import {CommonStyles} from '@styles/common';
import {SIZE_16, SIZE_32, SIZE_8} from '@styles/sizes';
import {Literals} from '@styles/typography';
import {scale} from '@styles/mixins';

import type {DefaultStore, Location, Store} from '@types';
import {CombinedState, DefaulStoreSliceState} from '@state/types';

interface StoresListItemProps {
  dataSource: Store;
  onPress: (store: Store) => void;
  onDefaultStoreSelectButtonPress?: (store: DefaultStore) => void;
  userLocation?: Location;
}

const StoresListItem: FC<StoresListItemProps> = ({
  dataSource,
  userLocation,
  onPress,
  onDefaultStoreSelectButtonPress,
}) => {
  //#region FAVORITE
  const {isFavorite, favoriteProcessing, onFavoriteButtonPress} =
    useFavoriteStoresState(dataSource.id);
  //#endregion

  //#region DEFAULT STORE
  const {data: defaultStoreData} = useSelector<
    CombinedState,
    {data: DefaulStoreSliceState['data']}
  >((state) => ({
    data: state.defaultStore.data,
  }));
  //#endregion
  return (
    <View style={styles.container}>
      <View style={CommonStyles.centrizedRow}>
        <AppText type="control" wrapperStyle={styles.nameWrapper}>
          {dataSource.address}
        </AppText>
        <FavoriteButton
          size={20}
          disabled={favoriteProcessing}
          isFavorite={isFavorite}
          onPress={onFavoriteButtonPress}
        />
      </View>

      {userLocation && (
        <AppText
          type="small"
          color={Colors.gray5}
          wrapperStyle={styles.bottomTextWrapper}>
          {`${getDistanceFromLatLonInKm(
            userLocation.latitude,
            userLocation.longitude,
            parseFloat(dataSource.map.lat),
            parseFloat(dataSource.map.lon),
          )} ${Literals.distance} от вас`}
        </AppText>
      )}

      <View style={CommonStyles.centrizedRow}>
        <Pressable onPress={() => onPress(dataSource)}>
          <AppText type="link" color={Colors.gray8}>
            {'Показать на карте'}
          </AppText>
        </Pressable>
        {dataSource.id !== defaultStoreData?.id &&
          onDefaultStoreSelectButtonPress && (
            <Pressable
              onPress={() =>
                onDefaultStoreSelectButtonPress({
                  id: dataSource.id,
                  address: dataSource.address,
                })
              }
              style={({pressed}) => [
                styles.selectButton,
                {
                  backgroundColor: pressed
                    ? Colors.accent.pressed
                    : Colors.accent.default,
                },
              ]}>
              <AppText type="small" color={Colors.white}>
                {'Выбрать'}
              </AppText>
            </Pressable>
          )}
      </View>
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
});

export default StoresListItem;
