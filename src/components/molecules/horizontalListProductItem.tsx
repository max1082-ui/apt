import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';

import {
  Price,
  AppText,
  ProgressiveImage,
  PressableOpacity,
} from '@components/atoms';

import {scale} from '@styles/mixins';
import {Colors} from '@styles/colors';
import {SIZE_16, SIZE_24, SIZE_8} from '@styles/sizes';

import type {ProductPreview} from '@types';

interface HorizontalListProductItemProps {
  dataSource: ProductPreview;
  onPress?: (props?: any) => void;
}

const ITEM_WIDTH = scale(128);

const HorizontalListProductItem: FC<HorizontalListProductItemProps> = ({
  dataSource,
  onPress,
}) => {
  return (
    <PressableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.imageWrapper}>
        <ProgressiveImage
          source={{uri: dataSource.photo}}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <View style={styles.nameWrapper}>
        <AppText type="productName" numberOfLines={3} minNumberOfLines={3}>
          {dataSource.name}
        </AppText>
      </View>
      <Price
        size="small"
        actualPrice={dataSource.price.actual}
        oldPrice={dataSource.price.old}
      />
    </PressableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: ITEM_WIDTH + SIZE_16,
  },
  imageWrapper: {
    marginBottom: SIZE_24,
    padding: SIZE_8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.gray2,
  },
  image: {
    width: ITEM_WIDTH,
    aspectRatio: 1,
  },
  nameWrapper: {
    marginBottom: SIZE_8,
  },
});

export default HorizontalListProductItem;
