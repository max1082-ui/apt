import React, {FC} from 'react';
import {ActivityIndicator} from 'react-native';

import type {ActivityIndicatorProps} from 'react-native';

import {Colors} from '@styles/colors';
import {CommonStyles} from '@styles/common';

const Loader: FC<ActivityIndicatorProps> = ({
  style,
  color = Colors.gray4,
  ...passTroughProps
}) => (
  <ActivityIndicator
    {...passTroughProps}
    color={color}
    style={[CommonStyles.fill, style]}
  />
);

export default Loader;
