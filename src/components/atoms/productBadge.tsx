import React, {FC, memo, useMemo} from 'react';
import {View, StyleSheet} from 'react-native';

import type {ViewProps} from 'react-native';

import AppText from './appText';

import {Colors} from '@styles/colors';
import {Fonts} from '@styles/typography';
import {scaleFont} from '@styles/mixins';
import {SIZE_24, SIZE_8} from '@styles/sizes';

const BADGE_STYLES = {
  hit: {
    borderWidth: 2,
    borderColor: '#F9AAAA',
    backgroundColor: Colors.white,
  },
  new: {
    borderWidth: 2,
    borderColor: '#A4D8B9',
    backgroundColor: Colors.white,
  },
  discount: {
    backgroundColor: Colors.black,
  },
  quantity: {
    width: SIZE_24,
    borderRadius: SIZE_24,
    backgroundColor: Colors.black,
  },
};
const CAPTION_COLORS = {
  hit: '#ED7A7A',
  new: '#4EAD75',
  discount: Colors.white,
  quantity: Colors.white,
};
interface ProductBadgeProps extends ViewProps {
  type: 'hit' | 'discount' | 'new' | 'quantity';
  discountValue?: string | number;
  quantityValue?: number;
}
const ProductBadge: FC<ProductBadgeProps> = ({
  type,
  style,
  discountValue,
  quantityValue,
  ...passThroughProps
}) => {
  const caption = useMemo(() => {
    let c: string;
    switch (type) {
      case 'quantity':
        c = `${quantityValue || 0}`;
        break;
      case 'discount':
        c = `-${discountValue}%`;
        break;
      case 'hit':
        c = 'хит';
        break;
      case 'new':
        c = 'new';
        break;
    }
    return c;
  }, [discountValue, quantityValue, type]);
  if (!caption) {
    return null;
  }
  return (
    <View style={styles.wrapper}>
      <View
        {...passThroughProps}
        style={[styles.badge, BADGE_STYLES[type], style]}>
        <AppText
          customTextStyle={[
            styles.badgeCaption,
            {color: CAPTION_COLORS[type]},
          ]}>
          {caption}
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  badge: {
    justifyContent: 'center',
    minWidth: SIZE_24,
    height: SIZE_24,
    borderRadius: 8,
    paddingHorizontal: SIZE_8,
    marginBottom: SIZE_8 / 2,
  },
  badgeCaption: {
    ...Fonts.semiBold,
    fontSize: scaleFont(12),
    textTransform: 'uppercase',
    textAlign: 'center',
  },
});

export default memo(ProductBadge);
