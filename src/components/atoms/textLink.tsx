import React, {FC} from 'react';
import {StyleProp, StyleSheet, ViewStyle} from 'react-native';

import Icon from './icon';
import AppText from './appText';
import PressableOpacity from './pressableOpacity';

import {SIZE_8} from '@styles/sizes';
import {Colors} from '@styles/colors';
import {AppTextStyleType} from '@styles/typography';

interface TextLinkProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  showArrow?: boolean;
  textType?: AppTextStyleType;
  wrapperStyle?: StyleProp<ViewStyle>;
}

const TextLink: FC<TextLinkProps> = ({
  label,
  onPress,
  wrapperStyle,
  textType = 'h2',
  disabled = false,
  showArrow = true,
}) => (
  <PressableOpacity
    disabled={disabled}
    style={[styles.wrapper, wrapperStyle]}
    onPress={onPress}>
    <AppText type={textType} wrapperStyle={styles.linkTextWrapper}>
      {label}
    </AppText>
    {showArrow && (
      <Icon name="arrow-right-s-line" color={Colors.accent.default} size={20} />
    )}
  </PressableOpacity>
);

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  linkTextWrapper: {
    flex: 1,
    paddingRight: SIZE_8,
  },
});

export default TextLink;
