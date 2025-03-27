import React from 'react';
import {View, StyleSheet} from 'react-native';

import Icon from './icon';
import AppText from './appText';
import PressableOpacity from './pressableOpacity';

import {scale} from '@styles/mixins';
import {Colors} from '@styles/colors';
import {SIZE_16} from '@styles/sizes';

import type {BaseOptionItem, SelectableOptionType} from './types';

interface SelectableOptionProps<T> {
  item: T;
  isActive: boolean;
  onPress: () => void;
  label?: string;
  disabled?: boolean;
  isAvailable?: boolean;
  type?: SelectableOptionType;
}

const CHECKBOX_SIZE = scale(20);
const CHECKBOX_BORDER_RADIUS = 4;
const RADIOBUTTON_BORDER_RADIUS = 100;

function SelectableOption<T extends BaseOptionItem>({
  item,
  label,
  isActive,
  onPress,
  type = 'checkbox',
  disabled = false,
  isAvailable = true,
}: SelectableOptionProps<T>): JSX.Element {
  return (
    <PressableOpacity disabled={disabled} onPress={onPress}>
      <View style={styles.itemContainer}>
        <AppText
          color={!isAvailable ? Colors.gray6 : Colors.black}
          wrapperStyle={styles.textWrap}>
          {label || item.name}
        </AppText>
        <View
          style={[
            styles.checkbox,
            {
              backgroundColor: isActive ? Colors.gray5 : Colors.white,
              borderRadius:
                type === 'checkbox'
                  ? CHECKBOX_BORDER_RADIUS
                  : RADIOBUTTON_BORDER_RADIUS,
            },
          ]}>
          <Icon
            name={'check-line'}
            color={Colors.white}
            size={17}
            style={styles.icon}
          />
        </View>
      </View>
    </PressableOpacity>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    paddingVertical: SIZE_16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textWrap: {
    flex: 1,
    paddingRight: SIZE_16,
  },
  checkbox: {
    width: CHECKBOX_SIZE,
    aspectRatio: 1,

    borderWidth: 1,
    borderColor: Colors.gray5,

    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    lineHeight: CHECKBOX_SIZE,
  },
});

export default SelectableOption;
