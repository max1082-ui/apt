import React, {FC, memo} from 'react';
import {View} from 'react-native';

import type {ColorValue} from 'react-native';

import {margin} from '@styles/mixins';
import {Colors} from '@styles/colors';

interface SeparatorLineProps {
  color?: ColorValue;
  height?: number;
  vertical?: boolean;
  offsets?: {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
  };
}
const SeparatorLine: FC<SeparatorLineProps> = ({
  vertical,
  height = 1,
  color = Colors.gray2,
  offsets,
}) => (
  <View
    style={[
      {backgroundColor: color},
      // eslint-disable-next-line react-native/no-inline-styles
      vertical ? {height: '100%', width: height} : {height},
      offsets && {
        ...margin(
          offsets.top || 0,
          offsets.right || 0,
          offsets.bottom || 0,
          offsets.left || 0,
        ),
      },
    ]}
  />
);

export default memo(SeparatorLine, () => false);
