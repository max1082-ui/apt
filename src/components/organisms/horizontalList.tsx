import React from 'react';
import {StyleSheet, View} from 'react-native';
import type {ViewProps, ListRenderItem} from 'react-native';

import {FlatList} from 'react-native-gesture-handler';

import {AppText, TextLink} from '@components/atoms';

import {SIZE_16, SIZE_24, WINDOW_GUTTER} from '@styles/sizes';

interface HorizontalListProps<T> extends ViewProps {
  title: string;
  dataSource: ReadonlyArray<T>;
  renderItem: ListRenderItem<T>;
  keyExtractor: (item: T, index: number) => string;
  onShowAllButtonPress?: () => void;
}

const HorizontalList = <T extends {}>({
  title,
  dataSource,
  renderItem,
  keyExtractor,
  onShowAllButtonPress,
  ...passThroughProps
}: HorizontalListProps<T>) => {
  if (!dataSource || dataSource.length === 0 || !renderItem) {
    return null;
  }

  return (
    <View {...passThroughProps}>
      <View style={styles.titleContainer}>
        {onShowAllButtonPress ? (
          <TextLink label={title} onPress={() => onShowAllButtonPress()} />
        ) : (
          <AppText type="h2">{title}</AppText>
        )}
      </View>
      <FlatList
        horizontal
        data={dataSource}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyExtractor={keyExtractor}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    marginBottom: SIZE_24,
    paddingHorizontal: WINDOW_GUTTER,
  },
  contentContainer: {
    paddingHorizontal: SIZE_16,
  },
  separator: {
    width: SIZE_16,
  },
});

export default HorizontalList;
