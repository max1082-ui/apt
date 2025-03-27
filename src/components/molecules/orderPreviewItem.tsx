import React, {FC} from 'react';
import {View, StyleSheet} from 'react-native';

import {Icon, AppText, PressableOpacity, Price} from '@components/atoms';

import {getFormatDate, toJsTimestamp} from '@utils';

import {Colors} from '@styles/colors';
import {Fonts} from '@styles/typography';
import {CommonStyles} from '@styles/common';
import {scale, scaleFont} from '@styles/mixins';
import {SIZE_8, SIZE_16, SIZE_24} from '@styles/sizes';

import type {OrderPreview} from '@types';

type OrderPreviewProps = {
  dataSource: OrderPreview;
  codeColor: string;
  onPress?: () => void;
};

const OrderPreviewItem: FC<OrderPreviewProps> = ({
  dataSource,
  codeColor,
  onPress,
}) => (
  <View style={styles.container}>
    <View style={CommonStyles.centrizedRow}>
      <AppText
        type="small"
        color={Colors.gray5}
        wrapperStyle={styles.dateWrap}
        numberOfLines={1}>
        {getFormatDate(toJsTimestamp(dataSource.date))}
      </AppText>
      <PressableOpacity
        style={styles.pressableWrapper}
        hitSlop={20}
        onPress={onPress}>
        <AppText type="link" color={Colors.gray6}>
          {'Смотреть заказ'}
        </AppText>
        <Icon
          name={'eye-line'}
          style={styles.icon}
          color={Colors.gray6}
          size={SIZE_16}
        />
      </PressableOpacity>
    </View>
    <View style={[CommonStyles.centrizedRow, {marginTop: scale(11)}]}>
      <AppText
        type="h2"
        color={Colors.gray9}>{`Заказ: ${dataSource.id}`}</AppText>
    </View>
    <View style={[CommonStyles.centrizedRow, {marginTop: scale(18)}]}>
      <AppText
        type="small"
        color={Colors.gray9}
        wrapperStyle={styles.statusWrap}>
        {'Статус: '}
        <AppText type="small" color={codeColor}>
          {dataSource.status}
        </AppText>
      </AppText>
      <Price actualPrice={dataSource.price} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  pressableWrapper: {
    flexDirection: 'row',
  },
  container: {
    width: '100%',
    minHeight: scale(123),
    paddingTop: SIZE_16,
    paddingBottom: SIZE_24,
  },
  icon: {
    marginLeft: SIZE_8,
  },
  number: {
    ...Fonts.semiBold,
    color: Colors.gray1,
    lineHeight: scaleFont(16),
  },
  status: {
    color: Colors.gray2,
    letterSpacing: 0.98,
  },
  statusWrap: {
    flex: 1,
    paddingRight: SIZE_16,
  },
  date: {
    textAlign: 'right',

    ...Fonts.medium,
    color: Colors.gray3,
    letterSpacing: 1.04,
    fontSize: scaleFont(10),
    lineHeight: scaleFont(15),
  },
  dateWrap: {
    flex: 1,
  },
  price: {
    letterSpacing: 0.98,
  },
});

export default OrderPreviewItem;
