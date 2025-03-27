import React, {FC, useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';

import type {
  TextInputProps,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native';

import TextInputMask from 'react-native-text-input-mask';

import AppText from './appText';

import {Colors} from '@styles/colors';
import {Fonts} from '@styles/typography';
import {scaleFont} from '@styles/mixins';
import {DEFAULT_INPUT_HEIGHT, SIZE_16, SIZE_8} from '@styles/sizes';
interface FormTextInputProps extends TextInputProps {
  placeholderText?: string;
  value: string;
  onChangeText:
    | ((formatted: string, extracted?: string | undefined) => void)
    | undefined;
  errorText?: string | boolean;
  mask?: string;
  label?: string;
  inputStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  errorTextColor?: string;
}

const FormTextInput: FC<FormTextInputProps> = ({
  label,

  mask,

  errorText,
  placeholderText,

  inputStyle,
  containerStyle,

  onBlur,
  onChangeText,

  value = '',
  editable = true,
  errorTextColor = Colors.error.default,

  ...passThroughProps
}) => {
  const [isFocused, setIsFocused] = useState<number>(0);

  //#region  BINDING
  const handleOnBlur = (
    e: NativeSyntheticEvent<TextInputFocusEventData>,
  ): void => {
    setIsFocused(0);
    onBlur && onBlur(e);
  };
  //#endregion

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <AppText type="small" wrapperStyle={styles.label} color={Colors.gray6}>
          {label}
        </AppText>
      )}
      <View
        style={[
          styles.inputWrapper,
          !!isFocused && styles.focusedWrapper,
          !!errorText && {borderColor: errorTextColor},
        ]}>
        {mask ? ( //@ts-ignore Ошибка в types TextInputMask
          <TextInputMask
            style={[
              styles.input,
              !editable && {color: Colors.gray5},
              !!errorText && {color: errorTextColor},
              inputStyle,
            ]}
            value={value}
            mask={mask}
            onChangeText={onChangeText}
            onFocus={() => setIsFocused(1)}
            onBlur={handleOnBlur}
            placeholder={placeholderText}
            placeholderTextColor={Colors.gray7}
            editable={editable}
            {...passThroughProps}
          />
        ) : (
          <TextInput
            style={[
              styles.input,
              !editable && {color: Colors.gray5},
              !!errorText && {color: errorTextColor},
              inputStyle,
            ]}
            value={value}
            onChangeText={onChangeText}
            onFocus={() => setIsFocused(1)}
            onBlur={handleOnBlur}
            placeholder={placeholderText}
            placeholderTextColor={Colors.gray7}
            editable={editable}
            {...passThroughProps}
          />
        )}
        {!!errorText && (
          <AppText wrapperStyle={styles.errorText} color={errorTextColor}>
            {errorText}
          </AppText>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: SIZE_16,
  },
  label: {
    marginBottom: SIZE_8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    minHeight: DEFAULT_INPUT_HEIGHT,
    paddingHorizontal: SIZE_16,
    borderWidth: 1,
    borderColor: Colors.gray2,
    backgroundColor: Colors.gray1,
    borderRadius: 8,
  },
  focusedWrapper: {
    borderColor: Colors.gray3,
  },
  input: {
    ...Fonts.regular,
    flex: 1,
    color: Colors.black,
    fontSize: scaleFont(15),
    height: DEFAULT_INPUT_HEIGHT,
    // backgroundColor: Colors.accent.default,
  },
  errorText: {
    ...Fonts.regular,
    fontSize: scaleFont(12),
    position: 'absolute',
    bottom: -20,
  },
});

export default FormTextInput;
