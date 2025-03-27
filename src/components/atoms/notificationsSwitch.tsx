import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';

import type {StyleProp, ViewStyle} from 'react-native';

import {Switch as RNSwitch} from 'react-native-switch';

import Loader from './loader';
import AppText from './appText';

import {Colors} from '@styles/colors';
import {Fonts} from '@styles/typography';
import {SIZE_32, SIZE_8} from '@styles/sizes';
import {scale, scaleFont} from '@styles/mixins';

interface NotificationsSwitchProps {
  value: boolean;
  caption: string;
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

const NotificationsSwitch: FC<NotificationsSwitchProps> = ({
  value,
  caption,
  disabled,
  onPress,
  containerStyle,
  isLoading = false,
}) => (
  <View style={[styles.container, containerStyle]}>
    <AppText type="control">{caption}</AppText>
    <RNSwitch
      disabled={isLoading || disabled}
      value={value}
      onValueChange={onPress}
      circleSize={SIZE_32}
      circleBorderWidth={0}
      renderInsideCircle={() => (
        <View style={styles.innerCircle}>
          {isLoading && <Loader size="small" color={Colors.gray4} />}
        </View>
      )}
      backgroundActive={Colors.accent.default}
      backgroundInactive={Colors.gray2}
      circleActiveColor={Colors.accent.default}
      circleInActiveColor={Colors.gray2}
      renderActiveText={false}
      renderInActiveText={false}
      switchLeftPx={3}
      switchRightPx={3}
      switchWidthMultiplier={1.5}
    />
  </View>
);
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZE_8,
  },
  caption: {
    ...Fonts.medium,
    fontSize: scaleFont(12),
    lineHeight: scale(15),
    letterSpacing: 1.04,
    textTransform: 'uppercase',
  },
  innerCircle: {
    width: SIZE_32 - SIZE_8 / 2,
    aspectRatio: 1,
    borderRadius: 100,
    backgroundColor: Colors.white,
  },
  captionDesc: {
    ...Fonts.medium,
    fontSize: scaleFont(10),
    lineHeight: scale(12),
    letterSpacing: 1.04,
    textTransform: 'uppercase',
    color: Colors.gray4,
  },
});

export default NotificationsSwitch;
