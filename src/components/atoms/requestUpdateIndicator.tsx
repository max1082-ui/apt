import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';

import type {ActivityIndicatorProps} from 'react-native';

import Loader from './loader';

import {Colors} from '@styles/colors';

interface RequestUpdateIndicatorProps
  extends Pick<ActivityIndicatorProps, 'size' | 'color'> {}

const RequestUpdateIndicator: FC<RequestUpdateIndicatorProps> = ({
  size = 'large',
  ...passThroughProps
}) => (
  <View
    style={[StyleSheet.absoluteFill, {backgroundColor: Colors.backdropLight}]}>
    <Loader size={size} {...passThroughProps} />
  </View>
);

export default RequestUpdateIndicator;
