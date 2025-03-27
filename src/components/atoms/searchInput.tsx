import React, {FC} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';

import type {TextInputProps, StyleProp, ViewStyle} from 'react-native';

import Icon from './icon';
import PressableOpacity from './pressableOpacity';

import {Colors} from '@styles/colors';
import {Fonts} from '@styles/typography';
import {SIZE_16, SIZE_8} from '@styles/sizes';
import {scale, scaleFont} from '@styles/mixins';

interface SearchInputProps extends TextInputProps {
  active?: boolean;
  buttonMode?: boolean;

  onPress?: () => void;

  onResetButtonPress?: () => void;

  wrapperStyle?: StyleProp<ViewStyle>;
}

const SearchInput: FC<SearchInputProps> = ({
  active,

  onPress,
  onResetButtonPress,

  style,
  wrapperStyle,

  value = '',
  placeholder = 'Поиск лекарств и товаров',

  buttonMode = false,
  ...passThroughProps
}) => {
  return (
    <View
      onTouchEnd={() => buttonMode && onPress && onPress()}
      style={[
        styles.wrapper,
        active && {
          borderColor: Colors.gray3,
        },
        wrapperStyle,
      ]}>
      <Icon name="search-line" size={18} color={Colors.gray5} />
      {buttonMode ? (
        <Text style={[styles.input, {color: Colors.gray5}]}>{placeholder}</Text>
      ) : (
        <>
          <TextInput
            value={value}
            selectionColor={Colors.accent.default}
            placeholder={placeholder}
            placeholderTextColor={Colors.gray5}
            rejectResponderTermination={true}
            returnKeyType="search"
            style={[styles.input, style]}
            {...passThroughProps}
          />
          {value.length > 0 && (
            <PressableOpacity onPress={onResetButtonPress}>
              <Icon name="close-line" size={20} color={Colors.gray5} />
            </PressableOpacity>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    minHeight: scale(40),
    paddingHorizontal: SIZE_16,

    borderWidth: 1,
    borderRadius: 100,

    borderColor: Colors.gray2,
    backgroundColor: Colors.gray1,
  },
  input: {
    flex: 1,
    justifyContent: 'center',

    marginLeft: SIZE_8,

    ...Fonts.regular,
    fontSize: scaleFont(15),
    color: Colors.black,
  },
});

export default SearchInput;
