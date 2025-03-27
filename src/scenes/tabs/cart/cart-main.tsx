import React, {FC, useCallback, useEffect, useState} from 'react';

import {FlatList, StyleSheet} from 'react-native';

import {useSelector} from 'react-redux';

import type {CartMainScreenProps} from '@navigation/types';

import {
  Loader,
  AppButton,
  FadeInView,
  RequestUpdateIndicator,
} from '@components/atoms';
import {CartListItem, CartMainHeaderRight} from '@components/molecules';
import {DynamicListEmptyComponent} from '@components/organisms';

import {clearCartThunk} from '@state/cart';
import {useThunkDispatch} from '@state/hooks';

import type {CombinedState, CartSliceState} from '@state/types';

import {useApiCall} from '@hooks';

import {getPriceWithValuableDecimals, showSnack} from '@utils';

import {
  SIZE_8,
  SIZE_16,
  SIZE_32,
  SIZE_40,
  WINDOW_WIDTH,
  WINDOW_GUTTER,
} from '@styles/sizes';
import {Colors} from '@styles/colors';
import {scaleFont} from '@styles/mixins';
import {CommonStyles} from '@styles/common';
import {Fonts, Literals} from '@styles/typography';

import {Images} from '@assets';

import type {GetCartRequestParams, GetCartResponse} from '@types';

type CartDataSource = GetCartResponse;

const initialCartDataSource: CartDataSource = {
  cart: [],
};

const CartMainScreen: FC<CartMainScreenProps> = ({
  // route: {name},
  navigation,
}) => {
  //#region STORE
  const dispatch = useThunkDispatch();
  const {data: storedCartProducts} = useSelector<CombinedState, CartSliceState>(
    ({cart: {data}}) => ({
      data,
    }),
  );
  //#endregion

  //#region DATA
  const [dataSource, setDataSource] = useState<CartDataSource>(
    initialCartDataSource,
  );
  const {loadingState, callTrigger} = useApiCall<
    GetCartRequestParams,
    GetCartResponse
  >({
    method: 'GET',
    endpoint: 'cart',
    requestParams: {cart: storedCartProducts},
    responseInterceptor: (r) => {
      setDataSource(r);
      return r;
    },
  });

  useEffect(() => {
    callTrigger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storedCartProducts]);
  //#endregion

  //#region BINDING
  const onCartItemPress = useCallback(
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
  const onProceedButtonPress = useCallback(
    () =>
      navigation.navigate('CheckoutStack', {screen: 'CheckoutPickPointSelect'}),
    [navigation],
  );
  //#endregion

  //#region HEADER PARTS
  const onHeaderRightModalActionButtonPress = useCallback(async () => {
    const thunkResult = await dispatch(clearCartThunk());
    if (clearCartThunk.rejected.match(thunkResult)) {
      showSnack({
        type: 'danger',
        message: 'Произошла ошибка при очистке корзины',
      });
    }
  }, [dispatch]);

  useEffect(() => {
    const cartProductsCount = dataSource.cart.length;
    navigation.setOptions({
      headerRight: () =>
        cartProductsCount > 0 ? (
          <CartMainHeaderRight
            onModalActionButtonPress={onHeaderRightModalActionButtonPress}
          />
        ) : undefined,
    });
  }, [dataSource, navigation, onHeaderRightModalActionButtonPress]);
  //#endregion

  if (loadingState === 'loading') {
    return <Loader size="large" />;
  }
  return (
    <>
      <FlatList
        data={dataSource.cart}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({item}) => (
          <CartListItem
            dataSource={item}
            onPress={() => onCartItemPress(item.id, item.name)}
          />
        )}
        ListEmptyComponent={
          <DynamicListEmptyComponent
            title="Ваша корзина пуста"
            description="Самое время добавить товар в корзину"
            buttonLabel="Перейти в каталог"
            imageSource={Images.emptyCart}
            onButtonPress={onEmptyCartButtonPress}
            containerStyle={styles.listEmptyContainer}
          />
        }
        style={styles.list}
        contentContainerStyle={[
          dataSource.cart.length === 0 && CommonStyles.fill,
          styles.listContentContainer,
        ]}
      />
      {!!dataSource.total && (
        <FadeInView style={styles.proceedButtonContainer}>
          <AppButton
            label="Выбрать аптеку"
            additionalText={`${getPriceWithValuableDecimals(
              dataSource.total,
            )} ${Literals.currency}`}
            onPress={onProceedButtonPress}
          />
        </FadeInView>
      )}
      {loadingState === 'updating' && <RequestUpdateIndicator />}
    </>
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    marginBottom: SIZE_40 + SIZE_8,
  },
  listContentContainer: {
    paddingVertical: SIZE_16 + SIZE_8,
  },
  listHeader: {
    height: SIZE_32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.gray6,
  },
  listHeaderText: {
    ...Fonts.medium,
    color: Colors.accent.default,
    fontSize: scaleFont(10),
    textTransform: 'uppercase',
  },
  listFooterContainer: {
    paddingHorizontal: WINDOW_GUTTER,
    paddingVertical: SIZE_16,
  },
  listFooter: {
    padding: SIZE_16,
    borderRadius: 18,
    backgroundColor: Colors.gray6,
  },
  listFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZE_16,
  },
  listFooterRowText: {
    color: Colors.gray2,
  },
  listFooterTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: SIZE_16,
  },
  listFooterTotalRowText: {
    ...Fonts.semiBold,
    fontSize: scaleFont(16),
  },
  listEmptyContainer: {
    paddingVertical: SIZE_40,
    paddingHorizontal: WINDOW_GUTTER,
  },
  proceedButtonContainer: {
    position: 'absolute',
    bottom: SIZE_16,

    width: WINDOW_WIDTH,
    paddingHorizontal: WINDOW_GUTTER,
  },
});

export default CartMainScreen;
