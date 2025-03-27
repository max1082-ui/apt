import React, {FC} from 'react';
import {Pressable} from 'react-native';
import type {PressableProps, StyleProp, ViewStyle} from 'react-native';

import {
  DEFAULT_ACTIVE_OPACITY,
  DEFAULT_DISABLED_OPACITY,
  DEFAULT_PRESSED_OPACITY,
} from '@styles/common';

interface PressableOpacityProps extends Omit<PressableProps, 'style'> {
  style?: StyleProp<ViewStyle>;
}
//TODO implement native android_ripple feedback for small 'icon-buttons'
const PressableOpacity: FC<PressableOpacityProps> = ({
  style,
  disabled,
  ...passThroughProps
}) => (
  <Pressable
    {...passThroughProps}
    disabled={disabled}
    style={({pressed}) => [
      {
        opacity: pressed
          ? DEFAULT_PRESSED_OPACITY
          : disabled
          ? DEFAULT_DISABLED_OPACITY
          : DEFAULT_ACTIVE_OPACITY,
      },
      style,
    ]}
  />
);

export default PressableOpacity;
