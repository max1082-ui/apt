import React, {FC, useEffect, useRef} from 'react';
import {StyleSheet, View} from 'react-native';

import Animated, {
  Clock,
  useValue,
  interpolateColors,
} from 'react-native-reanimated';

import AnimatedIcon from './animatedIcon';

import {runTiming} from '@utils';

import {CommonStyles} from '@styles/common';
import {AppTextStyles} from '@styles/typography';
import {DEFAULT_BUTTON_BORDER_RADIUS, SIZE_16, SIZE_8} from '@styles/sizes';

import type {ButtonColorConfig} from '@styles/colors';

import type {ButtonBaseProps} from './types';

export interface AnimatedButtonBaseProps extends ButtonBaseProps {
  pressed: boolean;
  colorConfig: ButtonColorConfig;
}

const AnimatedButtonBase: FC<AnimatedButtonBaseProps> = ({
  label,
  iconName,
  colorConfig,
  additionalText,
  pressed = false,
  disabled = false,
}) => {
  //#region BASE VALUES
  const animatedClock = useRef(new Clock()).current;
  const animatedProgress = useValue<number>(disabled ? 1 : 0);
  const animatedDest = useValue<number>(disabled ? 1 : 0);
  const animatedValue = useRef(
    runTiming({
      clock: animatedClock,
      value: animatedProgress,
      dest: animatedDest,
    }),
  ).current;
  //#endregion

  // #region STATE
  // const [currentColors, setCurrentColors] = useState<ButtonStateColors>(
  //   getInitialButtonColors(colorConfig, disabled),
  // );
  // #endregion

  //#region TRIGGER
  useEffect(() => {
    if (disabled) {
      animatedDest.setValue(1);
    } else {
      animatedDest.setValue(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled]);
  //#endregion

  //#region INTERPOLATORS
  const backgroundColor = pressed
    ? colorConfig.backgroundColor.pressed
    : colorConfig.backgroundColor.default;
  const animatedBackgroundColor = interpolateColors(animatedValue, {
    inputRange: [0, 1],
    outputColorRange: [backgroundColor, colorConfig.backgroundColor.disabled],
  }) as any; //shut up TS typerror in backgroundColor style prop

  const color = pressed ? colorConfig.color.pressed : colorConfig.color.default;
  const animatedColor = interpolateColors(animatedValue, {
    inputRange: [0, 1],
    outputColorRange: [color, colorConfig.color.disabled],
  }) as any; //shut up TS typerror in color style prop

  const bordeColor = pressed
    ? colorConfig.borderColor.pressed
    : colorConfig.borderColor.default;
  const animatedBorderColor = interpolateColors(animatedValue, {
    inputRange: [0, 1],
    outputColorRange: [bordeColor, colorConfig.borderColor.disabled],
  }) as any; //shut up TS typerror in borderColor style prop
  //#endregion

  return (
    <Animated.View
      style={[
        styles.button,
        {
          backgroundColor: animatedBackgroundColor,
          borderColor: animatedBorderColor,
        },
      ]}>
      {iconName && (
        <AnimatedIcon
          name={iconName}
          color={animatedColor}
          size={20}
          style={styles.icon}
        />
      )}
      <View
        style={[
          CommonStyles.centrizedRow,
          !!additionalText && CommonStyles.fill,
        ]}>
        <Animated.Text style={[styles.label, {color: animatedColor}]}>
          {label}
        </Animated.Text>
        {additionalText && (
          <Animated.Text style={[styles.label, {color: animatedColor}]}>
            {additionalText}
          </Animated.Text>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SIZE_16,

    borderWidth: 1,
    borderRadius: DEFAULT_BUTTON_BORDER_RADIUS,
  },
  label: {
    ...AppTextStyles.control,
  },
  icon: {
    marginRight: SIZE_8,
  },
});

export default AnimatedButtonBase;
