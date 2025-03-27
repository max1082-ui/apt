import React, {FC} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';

import {AppText, Icon, Loader} from '@components/atoms';

import {scale} from '@styles/mixins';
import {Colors} from '@styles/colors';
import {SIZE_16} from '@styles/sizes';
import {DEFAULT_PRESSED_OPACITY, DEFAULT_ACTIVE_OPACITY} from '@styles/common';

interface ProductListHeaderFilterProps {
  filterLoading: boolean;
  filterDisabled: boolean;

  onSortButtonPress: () => void;
  onFilterButtonPress: () => void;

  sortButtonLabel?: string;

  hasActiveSort?: boolean;
  hasActiveFilter?: boolean;
}

const ProductListHeaderFilter: FC<ProductListHeaderFilterProps> = ({
  filterLoading,
  filterDisabled,
  onSortButtonPress,
  onFilterButtonPress,
  hasActiveFilter,
  hasActiveSort,
  sortButtonLabel = 'Сортировать',
}) => (
  <View style={styles.listHeaderContainer}>
    <Pressable
      style={({pressed}) => [
        {
          opacity: pressed ? DEFAULT_PRESSED_OPACITY : DEFAULT_ACTIVE_OPACITY,
        },
        styles.listHeaderButton,
      ]}
      onPress={onSortButtonPress}>
      <View>
        <Icon name="filter-3-line" size={20} color={Colors.accent.default} />
        {hasActiveSort && <View style={styles.badge} />}
      </View>

      <AppText type="control" wrapperStyle={{marginLeft: scale(10)}}>
        {sortButtonLabel}
      </AppText>
    </Pressable>
    <Pressable
      disabled={filterDisabled}
      style={({pressed}) => [
        {
          opacity: pressed ? DEFAULT_PRESSED_OPACITY : DEFAULT_ACTIVE_OPACITY,
        },
        styles.listHeaderButton,
      ]}
      onPress={onFilterButtonPress}>
      <AppText type="control" wrapperStyle={{marginRight: scale(10)}}>
        {'Фильтр'}
      </AppText>
      <View>
        {filterLoading ? (
          <Loader />
        ) : (
          <>
            <Icon
              name="equalizer-line"
              size={20}
              color={Colors.accent.default}
            />
            {hasActiveFilter && <View style={styles.badge} />}
          </>
        )}
      </View>
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  listHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    paddingVertical: SIZE_16,
  },
  listHeaderButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    width: scale(7),
    aspectRatio: 1 / 1,
    backgroundColor: Colors.error.default,
    borderRadius: 9,
    position: 'absolute',
    right: -1,
    top: -2,
  },
});

export default ProductListHeaderFilter;
