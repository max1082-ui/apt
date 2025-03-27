import React, {FC, memo, useMemo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';

import {
  Price,
  AppText,
  FavoriteButton,
  AddToCartButton,
  ProgressiveImage,
} from '@components/atoms';

import {useFavoriteState} from '@state/hooks';

import type {UseProductCartStateArg} from '@state/types';

import {getNoun} from '@utils';

import {scale} from '@styles/mixins';
import {Colors} from '@styles/colors';
import {SIZE_8, SIZE_16} from '@styles/sizes';
import {DEFAULT_ACTIVE_OPACITY, DEFAULT_PRESSED_OPACITY} from '@styles/common';

import type {ProductPreview} from '@types';

interface ProductListItemProps {
  dataSource: ProductPreview;
  onPress?: (props?: any) => void;
}

const ProductListItem: FC<ProductListItemProps> = ({dataSource, onPress}) => {
  //#region CART
  const cartProductData = useMemo<UseProductCartStateArg>(
    () => ({
      id: dataSource.id,
      name: dataSource.name,
      amount: dataSource.store.amount,
      inStock: dataSource.store.amount > 0,
    }),
    [dataSource.id, dataSource.name, dataSource.store.amount],
  );
  //#endregion

  //#region FAVORITE
  const {isFavorite, favoriteProcessing, onFavoriteButtonPress} =
    useFavoriteState(dataSource.id, dataSource.name);
  //#endregion

  //#region PARTS
  const manufacturerInfoText = useMemo(() => {
    const {manufacturer, country} = dataSource.info;
    const haveBothParts = manufacturer && country ? true : false;
    const manufacturers = manufacturer.split('/');
    const countries = country.split('/');

    return `${manufacturers[0] || ''} ${haveBothParts ? '|' : ''} ${
      countries[0] || ''
    }${manufacturers.length > 1 || countries.length > 1 ? ' ...' : ''}`;
  }, [dataSource]);
  //#endregion

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => {
          onPress && onPress();
        }}
        style={({pressed}) => [
          styles.imageWrapper,
          {
            opacity: pressed ? DEFAULT_PRESSED_OPACITY : DEFAULT_ACTIVE_OPACITY,
          },
        ]}>
        <ProgressiveImage
          source={{uri: dataSource.photo}}
          style={styles.image}
          resizeMode="contain"
        />
      </Pressable>
      <View style={styles.infoContainer}>
        <Pressable
          onPress={() => {
            onPress && onPress();
          }}
          style={({pressed}) => [
            styles.imageWrapper,
            {
              opacity: pressed
                ? DEFAULT_PRESSED_OPACITY
                : DEFAULT_ACTIVE_OPACITY,
            },
          ]}>
          <AppText
            numberOfLines={2}
            type="productNameList"
            wrapperStyle={styles.nameWrapper}>
            {dataSource.name}
          </AppText>
          <AppText
            type="productName"
            color={Colors.gray6}
            numberOfLines={3}
            wrapperStyle={{marginBottom: scale(11)}}>
            {manufacturerInfoText}
          </AppText>
        </Pressable>
        <AppText type="productName" color={Colors.gray6}>
          {`В наличии в ${dataSource.store.availability} ${getNoun(
            dataSource.store.availability,
            'аптеке',
            'аптеках',
            'аптеках',
          )}`}
        </AppText>
        {dataSource.prescription && (
          <AppText
            type="productName"
            color={Colors.error.default}
            wrapperStyle={{marginTop: scale(4)}}>
            {'Отпускается по рецепту'}
          </AppText>
        )}
        <View style={styles.bottomRow}>
          <Price
            size="small"
            actualPrice={dataSource.price.actual}
            oldPrice={dataSource.price.old}
          />
          <AddToCartButton productData={cartProductData} />
        </View>
      </View>
      <FavoriteButton
        isFavorite={isFavorite}
        disabled={favoriteProcessing}
        containerStyle={styles.favoriteButtonContainer}
        onPress={onFavoriteButtonPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: SIZE_16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageWrapper: {
    marginRight: SIZE_8,
  },
  image: {
    width: scale(96),
    height: scale(96),
  },
  nameWrapper: {
    marginBottom: scale(4),
    flexWrap: 'wrap',
  },
  favoriteButtonContainer: {
    position: 'absolute',
    top: SIZE_16,
  },
  bottomRow: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: scale(11),
  },
  infoContainer: {
    flexGrow: 1,
    width: '60%',
  },
});

export default memo(ProductListItem, () => true);
