import React, {FC} from 'react';
import {PressableProps, StyleSheet} from 'react-native';

import PressableOpacity from './pressableOpacity';
import Icon from './icon';
import AppText from './appText';

import {Colors} from '@styles/colors';
import {scale} from '@styles/mixins';
import {WINDOW_GUTTER, WINDOW_WIDTH} from '@styles/sizes';

type SectionButtonWidth = 'medium' | 'wide';

interface SectionButtonProps extends PressableProps {
  label: string;
  iconName?: string;
  onPress: () => void;
  width?: SectionButtonWidth;
  disabled?: boolean;
}

const SectionButton: FC<SectionButtonProps> = ({
  iconName,
  label,
  onPress,
  width = 'medium',
  disabled,
}) => {
  return (
    <PressableOpacity
      style={[styles.container, styles[width]]}
      onPress={onPress}
      disabled={disabled}>
      {iconName && <Icon name={iconName} size={28} color={Colors.gray6} />}

      <AppText
        type="small"
        wrapperStyle={styles.textContainer}
        color={Colors.gray8}>
        {label}
      </AppText>
    </PressableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.gray2,
    height: scale(96),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  textContainer: {
    marginTop: scale(13),
  },
  wide: {
    width: '100%',
  },
  medium: {
    width: (WINDOW_WIDTH - 2 * WINDOW_GUTTER - scale(8)) / 2,
  },
});

export default SectionButton;
