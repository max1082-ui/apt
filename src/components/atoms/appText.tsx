import React, {FC, useCallback, useState} from 'react';
import {Text, TextStyle} from 'react-native';

import type {
  TextProps,
  StyleProp,
  ViewStyle,
  ColorValue,
  TextLayoutEventData,
  NativeSyntheticEvent,
} from 'react-native';

import {Colors} from '@styles/colors';
import {AppTextStyles} from '@styles/typography';

import type {AppTextStyleType} from '@styles/typography';

export interface AppTextProps extends Omit<TextProps, 'style'> {
  type?: AppTextStyleType;
  color?: ColorValue;
  align?: TextStyle['textAlign'];

  minNumberOfLines?: number;

  wrapperStyle?: StyleProp<ViewStyle>; //left possibility to add only flex styles
}

type TextLayoutEventHandlerFunc = (
  e: NativeSyntheticEvent<TextLayoutEventData>,
) => void;

const AppText: FC<AppTextProps> = ({
  wrapperStyle,
  onTextLayout,

  type = 'bodyRegular',

  align = 'left',
  color = Colors.black,

  minNumberOfLines = 0,

  ...passThroughProps
}) => {
  const [minHeight, setMinHeight] = useState<number>(0);
  const onTextLayoutHandler = useCallback<TextLayoutEventHandlerFunc>(
    (e) => {
      onTextLayout?.(e);
      if (
        minNumberOfLines &&
        minNumberOfLines > 1 &&
        e.nativeEvent.lines.length > 0
      ) {
        if (minNumberOfLines > e.nativeEvent.lines.length) {
          setMinHeight(minNumberOfLines * e.nativeEvent.lines[0].height);
        }
      }
    },
    [minNumberOfLines, onTextLayout],
  );
  return (
    <Text
      allowFontScaling={false}
      {...passThroughProps}
      onTextLayout={onTextLayoutHandler}
      style={[
        AppTextStyles[type],
        wrapperStyle,
        {color, minHeight, textAlign: align},
      ]}
    />
  );
};

export default AppText;
