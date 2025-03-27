import React, {FC} from 'react';
import {View, StyleSheet, Pressable} from 'react-native';

import Icon from './icon';
import AppText from './appText';

import {Colors} from '@styles/colors';
import {SIZE_8, SIZE_24, DEFAULT_CHECKBOX_SIZE} from '@styles/sizes';
import {DEFAULT_ACTIVE_OPACITY, DEFAULT_DISABLED_OPACITY} from '@styles/common';

interface CheckboxProps {
  isActive: boolean;

  onPress: () => void;

  label?: string;
  disabled?: boolean;
}

const Checkbox: FC<CheckboxProps> = ({isActive, onPress, label, disabled}) => {
  return (
    <Pressable disabled={disabled} onPress={onPress} style={styles.container}>
      {(pressed) => (
        <>
          <View
            style={[
              styles.checkbox,
              {
                backgroundColor: isActive ? Colors.gray5 : Colors.white,
                opacity: pressed
                  ? DEFAULT_DISABLED_OPACITY
                  : DEFAULT_ACTIVE_OPACITY,
              },
            ]}>
            <Icon
              name={'check-line'}
              color={Colors.white}
              size={17}
              style={styles.icon}
            />
          </View>
          <AppText>{label}</AppText>
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    height: SIZE_24,
    marginBottom: SIZE_8,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  checkbox: {
    width: DEFAULT_CHECKBOX_SIZE,
    marginRight: SIZE_8,
    aspectRatio: 1,

    borderWidth: 1,
    borderRadius: 4,
    borderColor: Colors.gray5,

    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    lineHeight: DEFAULT_CHECKBOX_SIZE,
  },
});

export default Checkbox;
