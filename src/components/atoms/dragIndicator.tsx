import React, {FC} from 'react';
import {StyleSheet} from 'react-native';

import type {FlexStyle, StyleProp} from 'react-native';

import PressableOpacity from './pressableOpacity';

import {scale} from '@styles/mixins';
import {Colors} from '@styles/colors';

interface DragIndicatorProps {
  wrapperStyle?: StyleProp<FlexStyle>;
}

const DragIndicator: FC<DragIndicatorProps> = ({wrapperStyle}) => (
  <PressableOpacity style={[styles.indicator, wrapperStyle]} />
);

const styles = StyleSheet.create({
  indicator: {
    width: scale(63),
    height: scale(6),
    borderRadius: 100,
    backgroundColor: Colors.gray3,
  },
});

export default DragIndicator;
