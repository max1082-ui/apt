import React, {FC, useMemo} from 'react';
import {View, StyleSheet} from 'react-native';

import {AppText} from '@components/atoms';

import {scale} from '@styles/mixins';
import {Colors} from '@styles/colors';
import {SIZE_16, SIZE_8} from '@styles/sizes';
import {AppTextStyleType, Literals} from '@styles/typography';

import type {PickpointProductListItem} from '@types';

interface CheckoutModalOrderListItemProps {
  dataSource: PickpointProductListItem;
  basedOnPickPointAmount?: boolean;
}

const PRODUCT_PARAM_PRICE_WIDTH = scale(80);
const PRODUCT_PARAM_AMOUNT_WIDTH = scale(40);

const WARNING_ARROW_WIDTH = SIZE_16;
const WARNING_ARROW_RIGHT_OFFSET =
  PRODUCT_PARAM_PRICE_WIDTH +
  (PRODUCT_PARAM_AMOUNT_WIDTH / 2 - WARNING_ARROW_WIDTH / 2);

const CheckoutModalOrderListItem: FC<CheckoutModalOrderListItemProps> = ({
  dataSource,
  basedOnPickPointAmount = true,
}) => {
  //#region COMPUTED
  const textStyle: AppTextStyleType = useMemo(
    () =>
      !basedOnPickPointAmount || dataSource.available > 0
        ? 'small'
        : 'productPriceDiscount',
    [dataSource.available, basedOnPickPointAmount],
  );
  const amount = useMemo(
    () =>
      basedOnPickPointAmount
        ? dataSource.available < dataSource.quantity
          ? dataSource.available
          : dataSource.quantity
        : dataSource.totalAvailable < dataSource.quantity
        ? dataSource.totalAvailable
        : dataSource.quantity,
    [basedOnPickPointAmount, dataSource],
  );
  //#endregion
  return (
    <>
      <View style={styles.productRow}>
        <AppText
          wrapperStyle={styles.productNameWrapper}
          type={textStyle}
          color={Colors.gray7}>
          {dataSource.name}
        </AppText>
        <View style={styles.productParamAmountWrap}>
          <AppText type={textStyle} color={Colors.gray7}>
            {`${amount} ${Literals.measure}`}
          </AppText>
        </View>
        <View style={styles.productParamPriceWrap}>
          <AppText type={textStyle} color={Colors.gray7}>
            {`${dataSource.price} ${Literals.currency}`}
          </AppText>
        </View>
      </View>
      {amount > 0 && amount - dataSource.quantity < 0 && (
        <View style={styles.warning}>
          <AppText
            type="small"
            color={
              Colors.white
            }>{`В наличии только ${amount} из ${dataSource.quantity} ${Literals.measure}`}</AppText>
          <View style={styles.warningArrow} />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: SIZE_16,
  },
  productNameWrapper: {
    flex: 1,
  },
  productParamPriceWrap: {
    width: PRODUCT_PARAM_PRICE_WIDTH,
    paddingLeft: SIZE_8,
    alignItems: 'flex-end',
  },
  productParamAmountWrap: {
    width: PRODUCT_PARAM_AMOUNT_WIDTH,
    alignItems: 'center',
  },
  warning: {
    backgroundColor: Colors.warning.default,
    padding: SIZE_8,
    borderRadius: SIZE_8,
    marginTop: SIZE_16,
  },
  warningArrow: {
    width: WARNING_ARROW_WIDTH,
    aspectRatio: 1 / 1,
    borderRadius: scale(4),
    backgroundColor: Colors.warning.default,
    transform: [{rotate: '45deg'}],
    position: 'absolute',
    top: -WARNING_ARROW_WIDTH / 2 + scale(2),
    right: WARNING_ARROW_RIGHT_OFFSET,
  },
});

export default CheckoutModalOrderListItem;
