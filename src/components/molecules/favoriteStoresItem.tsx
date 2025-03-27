import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';

import {AppText, FavoriteButton} from '@components/atoms';

import {useFavoriteStoresState} from '@state/hooks';

import {scale} from '@styles/mixins';
import {Colors} from '@styles/colors';
import {SIZE_16, SIZE_8} from '@styles/sizes';

import type {Store} from '@types';

interface FavoriteStoresItemProps {
  dataSource: Store;
}

const FavoriteStoresItem: FC<FavoriteStoresItemProps> = ({dataSource}) => {
  //#region FAVORITE
  const {isFavorite, favoriteProcessing, onFavoriteButtonPress} =
    useFavoriteStoresState(dataSource.id);
  //#endregion
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.infoContainer}>
          <AppText type="small" color={Colors.gray5}>
            {dataSource.city}
          </AppText>
          <AppText
            type="h2"
            color={Colors.gray9}
            wrapperStyle={styles.infoItemWrapper}>
            {dataSource.address}
          </AppText>
        </View>
        <View style={styles.controlsContainer}>
          <FavoriteButton
            size={20}
            disabled={favoriteProcessing}
            isFavorite={isFavorite}
            onPress={onFavoriteButtonPress}
          />
          <View />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: SIZE_16,
  },
  wrapper: {
    flexDirection: 'row',
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  infoItemWrapper: {
    marginTop: scale(11),
  },
  controlsContainer: {
    paddingHorizontal: SIZE_8,
    alignItems: 'center',
  },
});

export default FavoriteStoresItem;
