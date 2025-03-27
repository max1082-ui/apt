import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

import {scale} from '@styles/mixins';
import {SIZE_16, SIZE_32} from '@styles/sizes';
import {Colors} from '@styles/colors';

interface DynamicListSkeletonProps {
  count?: number;
  height?: number;
}

const DynamicListSkeleton: FC<DynamicListSkeletonProps> = ({
  count = 4,
  height = 100,
}) => {
  const listItems: number[] = [];
  let i: number = 0;
  while (i < count) {
    listItems.push(i + 1);
    i++;
  }
  return (
    <SkeletonPlaceholder backgroundColor={Colors.gray2}>
      <View style={{paddingHorizontal: SIZE_16}}>
        {listItems.map((item) => (
          <View
            key={item.toString()}
            style={[styles.itemContainer, {height: scale(height)}]}
          />
        ))}
      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    width: '100%',
    marginTop: SIZE_32,
  },
});

export default DynamicListSkeleton;
