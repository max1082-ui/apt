import React, {FC, useEffect, useState} from 'react';
import {FlatList, FlatListProps, StyleSheet, View} from 'react-native';

import {SelectableOption, SeparatorLine} from '@components/atoms';

import {Colors} from '@styles/colors';
import {padding, scale} from '@styles/mixins';
import {SIZE_8, SIZE_16, WINDOW_GUTTER} from '@styles/sizes';

import type {FilterMultipleActiveOptions, FilterOption} from '@types';

interface FilterOptionsListProps
  extends Omit<FlatListProps<FilterOption>, 'renderItem' | 'data'> {
  dataSource: FilterOption[];
  activeItems: FilterMultipleActiveOptions;
  onItemPress: (item: FilterOption) => void;
}

const FilterOptionsList: FC<FilterOptionsListProps> = ({
  dataSource,
  activeItems,
  onItemPress,
  ...passThroughProps
}) => {
  const [listData, setListData] = useState<FilterOption[]>([]);

  useEffect(() => {
    setListData(dataSource.sort((opt) => (opt.available ? -1 : 1)));
  }, [dataSource]);

  return (
    <FlatList
      data={listData}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({item}) => (
        <SelectableOption
          item={item}
          isAvailable={item.available}
          isActive={activeItems.includes(item.id)}
          onPress={() => onItemPress(item)}
        />
      )}
      ListHeaderComponent={SeparatorLine}
      ListFooterComponent={SeparatorLine}
      ItemSeparatorComponent={SeparatorLine}
      contentContainerStyle={styles.contentContainer}
      ListEmptyComponent={<View style={styles.listEmpty} />}
      {...passThroughProps}
    />
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    ...padding(SIZE_16, WINDOW_GUTTER, scale(57) / 2 + SIZE_8),
  },
  listEmpty: {
    backgroundColor: Colors.white,
  },
});

export default FilterOptionsList;
