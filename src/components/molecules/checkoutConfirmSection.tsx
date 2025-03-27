import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';

import type {ViewProps} from 'react-native';

import {AppText} from '@components/atoms';

import {SIZE_16, SIZE_24} from '@styles/sizes';

interface CheckoutConfirmSectionProps extends ViewProps {
  label: string;
}

const CheckoutConfirmSection: FC<CheckoutConfirmSectionProps> = ({
  label,
  children,
  style,
  ...passThroughProps
}) => (
  <View style={[styles.container, style]} {...passThroughProps}>
    <AppText type="h3" wrapperStyle={styles.labelWrap}>
      {label}
    </AppText>
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginTop: SIZE_24,
  },
  labelWrap: {
    marginBottom: SIZE_16,
  },
});

export default CheckoutConfirmSection;
