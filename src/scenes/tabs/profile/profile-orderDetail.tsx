import React, {
  FC,
  Fragment,
  useRef,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {StyleSheet, View, FlatList} from 'react-native';

import type {ProfileOrderDetailScreenProps} from '@navigation/types';

import {
  AppText,
  AppButton,
  FadeInView,
  SeparatorLine,
  AppHeaderTitle,
  RequestUpdateIndicator,
} from '@components/atoms';
import {OrderProductItem} from '@components/molecules';
import {DynamicListSkeleton} from '@components/templates';
import {HeaderRightComponent} from '@components/organisms';

import {useThunkDispatch} from '@state/hooks';
import {multipleAddToCartThunk} from '@state/cart';

import type {StoredCartData} from '@state/types';

import ApiService from '@services/api';
import {ExternalError} from '@services/types';
import {DEFAULT_UNEXPECTED_ERROR_TEXT, isExternalError} from '@services/error';

import {useApiCall, useMount} from '@hooks';

import {
  getFormatDate,
  getPriceWithValuableDecimals,
  showSnack,
  toJsTimestamp,
} from '@utils';

import {Literals} from '@styles/typography';
import {CommonStyles} from '@styles/common';
import {Colors, STATUS_CODE_COLORS} from '@styles/colors';
import {SIZE_16, SIZE_48, SIZE_8, WINDOW_GUTTER} from '@styles/sizes';

import type {
  GetOrderDetailRequestParams,
  GetOrderDetailResponse,
  OrderCancelRequestParams,
  OrderCancelResponse,
} from '@types';

const ProfileOrderDetailScreen: FC<ProfileOrderDetailScreenProps> = ({
  route: {
    params: {orderId},
  },
  navigation,
}) => {
  //#region DATA
  const {
    data: dataSource,
    loadingState,
    initialized,
    callTrigger,
  } = useApiCall<GetOrderDetailRequestParams, GetOrderDetailResponse>({
    method: 'GET',
    endpoint: 'user/order',
    requestParams: {id: orderId},
  });

  useEffect(() => {
    initialized && dataSource && dataSource.id !== orderId && callTrigger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);
  //#endregion

  //#region ORDER CANCEL
  const requestRef =
    useRef<ApiService<OrderCancelRequestParams, OrderCancelResponse>>();

  useMount(() => {
    return requestRef.current && requestRef.current.abort(); //cleanup
  });

  const [orderCancelProcessing, setOrderCancelProcessing] =
    useState<boolean>(false);

  const onCancelOrderButtonPress = useCallback(async () => {
    try {
      setOrderCancelProcessing(true);
      const requestParams = {id: orderId};
      requestRef.current = new ApiService<
        OrderCancelRequestParams,
        OrderCancelResponse
      >('PATCH', 'user/order', requestParams);
      await requestRef.current.call(); //returns 200 if everything OK - other codes catched in ApiService
      showSnack({
        type: 'success',
        message: `Заказ №${orderId} отменен`,
      });
      callTrigger(); // reload
    } catch (err) {
      if (isExternalError(err)) {
        let externalError: ExternalError = err;
        externalError.show();
      } else {
        showSnack({
          type: 'danger',
          message: err.message || DEFAULT_UNEXPECTED_ERROR_TEXT,
        });
      }
    } finally {
      setOrderCancelProcessing(false);
    }
  }, [callTrigger, orderId]);
  //#endregion

  //#region HEADER PARTS
  useEffect(() => {
    navigation.setOptions({
      headerTitleAlign: 'left',
      headerTitleContainerStyle: {
        left: SIZE_48,
      },
      title: `Заказ ${orderId}`,
      headerTitle: ({children}) => (
        <AppHeaderTitle title={children} fullWidth />
      ),
      headerRight: () => (
        <HeaderRightComponent
          disabled={dataSource?.isCancelable ? false : true}
          pressableText={'Отменить заказ'}
          pressableColor={
            dataSource?.isCancelable ? Colors.error.default : Colors.gray5
          }
          modalTitle={`Вы действительно хотите\nотменить заказ №${orderId}`}
          modalAction={onCancelOrderButtonPress}
        />
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSource]);
  //#endregion

  //#region BINDING
  const onProductItemPress = useCallback(
    (productId, productName) => {
      navigation.navigate('ProductStack', {
        screen: 'ProductDetail',
        params: {
          productId,
          productName,
        },
        initial: true,
      });
    },
    [navigation],
  );
  //#endregion

  //#region LIST_PARTS
  const renderListFooter = useMemo(() => {
    if (!dataSource) {
      return null;
    }
    return dataSource.totalPrice ? (
      <View style={styles.footerContainer}>
        {dataSource.totalPrice.map((item, index) =>
          !item.isTotal ? (
            <View key={index.toString()} style={styles.footerRow}>
              <AppText type="bodyRegular">{`${item.name}:`}</AppText>
              <AppText type="bodyRegular">
                {`${item?.sign ? item.sign : ''}${getPriceWithValuableDecimals(
                  item.value,
                )} ${Literals.currency}`}
              </AppText>
            </View>
          ) : (
            <Fragment key={index.toString()}>
              <SeparatorLine color={Colors.gray3} />
              <View style={[styles.footerRow, styles.footerRowTotal]}>
                <AppText type="bodyBold">{`${item.name}:`}</AppText>
                <AppText type="bodyBold">
                  {`${getPriceWithValuableDecimals(item.value)} ${
                    Literals.currency
                  }`}
                </AppText>
              </View>
            </Fragment>
          ),
        )}
      </View>
    ) : null;
  }, [dataSource]);
  //#endregion

  //#region ORDER REPEAT
  const dispatch = useThunkDispatch();
  const onRepeatOrderButtonPress = useCallback(() => {
    if (dataSource && dataSource.products.length > 0) {
      const products = dataSource.products.reduce<StoredCartData>(
        (r, c) =>
          c.store.amount > 0 && c.store.availability > 0
            ? {...r, [c.id]: c.quantity}
            : r,
        {},
      );
      dispatch(multipleAddToCartThunk({products}));
    }
  }, [dataSource, dispatch]);
  //#endregion

  if (loadingState === 'loading') {
    return <DynamicListSkeleton />;
  }

  return dataSource ? (
    <>
      <FadeInView style={CommonStyles.fill}>
        <FlatList
          data={dataSource.products}
          renderItem={({item}) => (
            <OrderProductItem
              dataSource={item}
              onPress={() => onProductItemPress(item.id, item.name)}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          stickyHeaderIndices={[0]}
          ListHeaderComponent={() => (
            <View style={styles.header}>
              <View style={styles.headerRow}>
                <AppText type="small" color={Colors.gray6}>
                  {`От ${getFormatDate(toJsTimestamp(dataSource.date))}`}
                </AppText>
                <AppText
                  type="small"
                  color={STATUS_CODE_COLORS[dataSource.code].color}>
                  {dataSource.status}
                </AppText>
              </View>
              {dataSource.store && (
                <>
                  <SeparatorLine
                    color={Colors.gray3}
                    offsets={{top: SIZE_8, bottom: SIZE_8}}
                  />
                  <View style={styles.headerRow}>
                    <AppText
                      type="small"
                      color={
                        Colors.gray6
                      }>{`${dataSource.store.city} ${dataSource.store.address}`}</AppText>
                  </View>
                </>
              )}
            </View>
          )}
          ListFooterComponent={renderListFooter}
          ItemSeparatorComponent={() => (
            <View style={{paddingHorizontal: WINDOW_GUTTER}}>
              <SeparatorLine />
            </View>
          )}
          contentContainerStyle={styles.contentContainer}
        />
      </FadeInView>
      <FadeInView delay={400} style={styles.addButtonWrapper}>
        <AppButton
          label={'Повторить заказ'}
          onPress={onRepeatOrderButtonPress}
        />
      </FadeInView>
      {(orderCancelProcessing || loadingState === 'updating') && (
        <RequestUpdateIndicator />
      )}
    </>
  ) : null; //TODO обработать
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: SIZE_48,
    paddingHorizontal: WINDOW_GUTTER,
  },
  header: {
    paddingHorizontal: WINDOW_GUTTER,
    paddingVertical: SIZE_8,
    backgroundColor: Colors.gray1,
    borderRadius: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerContainer: {
    backgroundColor: Colors.gray1,
    marginVertical: SIZE_16,
    padding: SIZE_16,
    borderRadius: 8,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZE_8,
  },
  footerRowTotal: {
    marginBottom: 0,
    marginTop: SIZE_8,
  },
  addButtonWrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: SIZE_16,
    paddingBottom: SIZE_16,
  },
});

export default ProfileOrderDetailScreen;
