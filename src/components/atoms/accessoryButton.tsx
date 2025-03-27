import React, {FC, ReactNode} from 'react';
import {Pressable, StyleSheet} from 'react-native';

import type {
  StyleProp,
  ViewStyle,
  TextStyle,
  PressableProps,
} from 'react-native';

import AppText from './appText';

import {SIZE_16} from '@styles/sizes';
import {Colors} from '@styles/colors';
import {scale} from '@styles/mixins';

interface AccessoryButtonProps extends PressableProps {
  label: string;
  AccessoryComponent?: ReactNode;
  labelStyle?: TextStyle;
  containerStyle?: StyleProp<ViewStyle>;
}

const AccessoryButton: FC<AccessoryButtonProps> = ({
  label,
  containerStyle,
  AccessoryComponent,
  ...passThroughProps
}) => {
  return (
    <Pressable
      {...passThroughProps}
      style={({pressed}) => [
        styles.button,
        containerStyle,
        {
          backgroundColor: pressed ? Colors.gray1 : Colors.gray2,
        },
      ]}>
      {AccessoryComponent}
      <AppText type="control">{label}</AppText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: scale(167),
    height: scale(44),
    paddingHorizontal: SIZE_16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderRadius: 8,
  },
});

export default AccessoryButton;
