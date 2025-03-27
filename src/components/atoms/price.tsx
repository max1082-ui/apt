import React, {FC, memo} from 'react';
import {View, ViewProps, StyleSheet, FlexStyle} from 'react-native';

import {Literals} from '@styles/typography';
import {Colors} from '@styles/colors';

import AppText from './appText';
import {SIZE_8, SIZE_16} from '@styles/sizes';

import {getPriceWithValuableDecimals} from '@utils';

type PriceSize = 'large' | 'small';
type PriceAlign = 'left' | 'right';
interface PriceProps extends ViewProps {
  actualPrice: number;
  oldPrice?: number;
  size?: PriceSize;
  align?: PriceAlign;
}

const CONTENT_ALIGN_JC: {[K in PriceAlign]: FlexStyle['justifyContent']} = {
  left: 'flex-start',
  right: 'flex-end',
};

/**
 * Rendering price component with actual and old (before discount) values
 * @param actualPrice required
 * @param oldPrice
 * @param size default: small
 */
const Price: FC<PriceProps> = ({
  style,
  actualPrice,
  oldPrice,
  size = 'small',
  align = 'left',
  ...passThroughProps
}) => (
  <View
    {...passThroughProps}
    style={[styles.wrapper, {justifyContent: CONTENT_ALIGN_JC[align]}, style]}>
    <AppText
      type={size === 'small' ? 'productPrice' : 'productPriceFull'}
      wrapperStyle={
        align === 'left' &&
        styles[size === 'small' ? 'alignLeftOffsetSm' : 'alignLeftOffsetLg']
      }>
      {`${getPriceWithValuableDecimals(actualPrice)} ${Literals.currency}`}
    </AppText>
    {oldPrice && (
      <AppText
        type="productPriceDiscount"
        color={Colors.gray5}
        wrapperStyle={
          align === 'right' &&
          styles[size === 'small' ? 'alignRightOffsetSm' : 'alignRightOffsetLg']
        }>
        {`${getPriceWithValuableDecimals(oldPrice)} ${Literals.currency}`}
      </AppText>
    )}
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  alignLeftOffsetSm: {
    marginRight: SIZE_8,
  },
  alignLeftOffsetLg: {
    marginRight: SIZE_16,
  },
  alignRightOffsetSm: {
    marginLeft: SIZE_8,
  },
  alignRightOffsetLg: {
    marginLeft: SIZE_16,
  },
});

export default memo(
  Price,
  (p, n) => p.actualPrice === n.actualPrice && p.oldPrice === n.oldPrice,
);
