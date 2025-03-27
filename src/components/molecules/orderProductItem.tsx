import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';

import {
  Price,
  AppText,
  PressableOpacity,
  ProgressiveImage,
} from '@components/atoms';

import {getNoun} from '@utils';

import {scale} from '@styles/mixins';
import {Colors} from '@styles/colors';
import {CommonStyles} from '@styles/common';
import {SIZE_16, SIZE_24} from '@styles/sizes';

import type {OrderProduct} from '@types';

interface ProductOrderItemProps {
  dataSource: OrderProduct;
  onPress?: () => void;
}

const OrderProductItem: FC<ProductOrderItemProps> = ({dataSource, onPress}) => (
  <PressableOpacity
    disabled={dataSource.store.availability === 0}
    onPress={onPress}
    style={styles.container}>
    <View style={styles.imageWrapper}>
      <ProgressiveImage
        source={{uri: dataSource.photo}}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
    <View style={styles.textContainer}>
      <AppText type="small" numberOfLines={3}>
        {dataSource.name}
      </AppText>
      <View style={{marginTop: scale(4)}}>
        {dataSource.store.availability > 0 ? (
          <AppText type="productName" color={Colors.gray6}>{`В наличии в ${
            dataSource.store.availability
          } ${getNoun(
            dataSource.store.availability,
            'аптеке',
            'аптеках',
            'аптеках',
          )}`}</AppText>
        ) : (
          <AppText type="productName" color={Colors.gray6}>
            {'НЕТ В НАЛИЧИИ'}
          </AppText>
        )}
      </View>

      <View style={[CommonStyles.centrizedRow, {marginTop: scale(16)}]}>
        <AppText
          type="small"
          color={Colors.gray7}>{`${dataSource.quantity} шт`}</AppText>
        <Price
          size="small"
          actualPrice={dataSource.price.actual}
          oldPrice={dataSource.price.old}
        />
      </View>
    </View>
  </PressableOpacity>
);

const IMAGE_SIZE = scale(48);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingBottom: SIZE_16,
    marginTop: SIZE_16,
  },
  imageWrapper: {
    marginBottom: SIZE_24,
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
  },
  textContainer: {
    flex: 1,
    marginLeft: SIZE_16,
  },
});

export default OrderProductItem;
