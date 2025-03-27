import React, {FC, useRef, useState, useEffect, useCallback} from 'react';

import {FlatList, StyleSheet} from 'react-native';

import {shallowEqual, useSelector} from 'react-redux';

import type {FavoriteMainScreenProps} from '@navigation/types';

import {Loader, RequestUpdateIndicator, SeparatorLine} from '@components/atoms';
import {ProductListItem} from '@components/molecules';
import {DynamicListEmptyComponent} from '@components/organisms';

import type {CombinedState} from '@state/types';

import {useApiCall} from '@hooks';

import {
  SIZE_16,
  WINDOW_GUTTER,
  PRODUCT_LIST_SEPARATOR_HEIGHT,
} from '@styles/sizes';
import {CommonStyles} from '@styles/common';

import {Images} from '@assets';

import {
  FavoriteData,
  ProductPreview,
  GetFavoriteProductListResponse,
  GetFavoriteProductListRequestParams,
} from '@types';

type SelectedFavoriteData = {
  favoriteProducts: FavoriteData;
  favoriteProductsCount: number;
  haveFavoriteProducts: boolean;
};

const FavoriteMainScreen: FC<FavoriteMainScreenProps> = ({navigation}) => {
  //#region STORED
  const {favoriteProducts: storedFavoriteProducts} = useSelector<
    CombinedState,
    SelectedFavoriteData
  >(
    (state) => ({
      favoriteProducts: state.favorite.data,
      favoriteProductsCount: state.favorite.data.length,
      haveFavoriteProducts: state.favorite.data.length > 0 ? true : false,
    }),
    shallowEqual,
  );
  //#endregion

  //#region DATA
  const listRef = useRef<FlatList<ProductPreview>>(null);

  const [dataSource, setDataSource] = useState<ProductPreview[]>([]);

  const {callTrigger, initialized, loadingState} = useApiCall<
    GetFavoriteProductListRequestParams,
    GetFavoriteProductListResponse
  >({
    method: 'GET',
    endpoint: 'catalog/favorite',
    requestParams: {id: storedFavoriteProducts},
    responseInterceptor: (r) => {
      setDataSource(r);
      return r;
    },
  });

  useEffect(
    () => {
      if (storedFavoriteProducts.length < dataSource.length) {
        setDataSource((prev) =>
          prev.filter((value) => storedFavoriteProducts.includes(value.id)),
        );
      } else {
        initialized && callTrigger();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [storedFavoriteProducts],
  );
  //#endregion

  //#region BINDING
  const onProductItemPress = useCallback(
    (productId: number, productName: string) =>
      navigation.navigate('ProductStack', {
        screen: 'ProductDetail',
        params: {
          productId,
          productName,
        },
      }),
    [navigation],
  );
  const onEmptyCartButtonPress = useCallback(
    () => navigation.jumpTo('HomeStack'),
    [navigation],
  );
  //#endregion

  if (loadingState === 'loading') {
    return <Loader size="large" />;
  }

  return (
    <>
      <FlatList
        ref={listRef}
        data={dataSource}
        keyExtractor={({id}) => id.toString()}
        renderItem={({item}) => (
          <ProductListItem
            dataSource={item}
            onPress={() => onProductItemPress(item.id, item.name)}
          />
        )}
        ItemSeparatorComponent={() => (
          <SeparatorLine height={PRODUCT_LIST_SEPARATOR_HEIGHT} />
        )}
        ListEmptyComponent={
          <DynamicListEmptyComponent
            title="Пока здесь пусто"
            description="Добавьте часто приобритаемые товары"
            buttonLabel="Перейти в каталог"
            imageSource={Images.emptyFavorite}
            onButtonPress={onEmptyCartButtonPress}
            containerStyle={styles.listEmptyContainer}
          />
        }
        style={CommonStyles.fill}
        contentContainerStyle={[
          dataSource.length === 0 && CommonStyles.fill,
          styles.listContentContainer,
        ]}
      />
      {loadingState === 'updating' && <RequestUpdateIndicator />}
    </>
  );
};

const styles = StyleSheet.create({
  listContentContainer: {
    paddingHorizontal: WINDOW_GUTTER,
    paddingBottom: SIZE_16,
  },
  listEmptyContainer: {},
});

export default FavoriteMainScreen;
