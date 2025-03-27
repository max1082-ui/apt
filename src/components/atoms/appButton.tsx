import React, {FC} from 'react';

import {Pressable, StyleProp, StyleSheet} from 'react-native';

import type {PressableProps, ViewStyle} from 'react-native';

import AnimatedButtonBase from './animatedButtonBase';

import {scale} from '@styles/mixins';
import {BUTTON_COLOR_CONFIG} from '@styles/colors';

import type {AppButtonWidth, ButtonBaseProps} from './types';

interface AppButtonProps extends ButtonBaseProps, PressableProps {
  width?: AppButtonWidth;
  containerStyle?: StyleProp<ViewStyle>;
}

const AppButton: FC<AppButtonProps> = ({
  label,
  additionalText,
  disabled,
  iconName,
  containerStyle,
  type = 'primary',
  width = 'wide',
  ...passThroughProps
}) => (
  <Pressable
    {...passThroughProps}
    disabled={disabled}
    style={[styles.container, styles[width], containerStyle]}>
    {({pressed}) => (
      <AnimatedButtonBase
        type={type}
        label={label}
        additionalText={additionalText}
        pressed={pressed}
        iconName={iconName}
        disabled={disabled}
        colorConfig={BUTTON_COLOR_CONFIG[type]}
      />
    )}
  </Pressable>
);

const styles = StyleSheet.create({
  container: {
    height: scale(44),
  },
  wide: {
    width: '100%',
  },
  narrow: {
    minWidth: scale(167),
  },
});

export default AppButton;
