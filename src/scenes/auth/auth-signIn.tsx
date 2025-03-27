import React, {FC, useEffect, useState} from 'react';
import {Keyboard, Pressable, StyleSheet, View} from 'react-native';

import type {AuthSignInScreenProps} from '@navigation/types';

import {
  Loader,
  AppText,
  AppButton,
  FadeInView,
  FormTextInput,
} from '@components/atoms';

import ApiService from '@services/api';
import {isExternalError, handleExternalError} from '@services/error';

import {getRawPhone} from '@utils';

import {
  SIZE_8,
  SIZE_16,
  SIZE_32,
  WINDOW_GUTTER,
  DEFAULT_INPUT_HEIGHT,
} from '@styles/sizes';
import {Colors} from '@styles/colors';
import {DEFAULT_ACTIVE_OPACITY, DEFAULT_DISABLED_OPACITY} from '@styles/common';

import type {AuthorizeUserRequestParams, AuthorizeUserResponse} from '@types';

type ValidationState = {
  valid: boolean;
  errorText: string;
};
const initialValidationState = {
  valid: false,
  errorText: '',
};

const VALID_LENGTH = 16;

const AuthSignInScreen: FC<AuthSignInScreenProps> = ({navigation, route}) => {
  const {onSuccessNavigationActionType} = route.params;
  //#region INPUT HANDLING
  const [inputValue, setInputValue] = useState<string>('+7');
  const [validationState, setValidationState] = useState<ValidationState>(
    initialValidationState,
  );

  useEffect(() => {
    if (inputValue.length === VALID_LENGTH) {
      setValidationState({valid: true, errorText: ''});
    } else {
      validationState.valid &&
        setValidationState((current) => ({...current, valid: false}));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);
  //#endregion

  //#region API HANDLING
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const sendApiRequest = async () => {
    try {
      setIsLoading(true);

      const rawPhone = getRawPhone(inputValue);
      if (rawPhone.length !== 11) {
        throw new Error('Неверный формат номера');
      }

      const requestParams = {
        phone: rawPhone,
      };

      const ApiRequest = new ApiService<
        AuthorizeUserRequestParams,
        AuthorizeUserResponse //TODO proper type - обсудить формат передаваемых данных (должен быть какой - либо ответ)
      >('POST', 'user/auth/phone', requestParams);

      await ApiRequest.call();

      const proceedResult = {
        phone: rawPhone,
      };
      return proceedResult;
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  //#endregion

  //#region HANDLERS
  const onProceed = async () => {
    if (inputValue.length !== VALID_LENGTH) {
      setValidationState({
        valid: false,
        errorText:
          inputValue.length <= 2 // default is +7
            ? 'Введите номер телефона'
            : 'Проверьте правильность ввода',
      });
    } else {
      Keyboard.dismiss();
      setTimeout(async () => {
        setValidationState({
          valid: true,
          errorText: '',
        });
        try {
          const apiRequestResult = await sendApiRequest();
          navigation.push('AuthVerification', {
            phone: apiRequestResult.phone,
            onSuccessNavigationActionType,
          });
        } catch (err) {
          if (isExternalError(err)) {
            handleExternalError(err);
          } else {
            setValidationState((current) => ({
              ...current,
              errorText: err.message,
            }));
          }
        }
      }, 150);
    }
  };

  const onPolicyLinkPress = async () => {
    navigation.navigate('PolicyScreen');
  };
  //#endregion

  return (
    <FadeInView style={styles.container}>
      <AppText type="h1" color={Colors.gray9}>
        {'Укажите номер телефона'}
      </AppText>
      <AppText
        type="bodyRegular"
        wrapperStyle={styles.titleTextWrapper}
        color={Colors.gray6}>
        {'Введите номер телефона и мы пришлём четырехзначный код в СМС'}
      </AppText>
      <View>
        <FormTextInput
          value={inputValue}
          editable={!isLoading}
          label="Номер телефона"
          autoCompleteType="tel"
          keyboardType="phone-pad"
          mask={'+7([000])[000]-[00]-[00]'}
          errorText={validationState.errorText}
          onSubmitEditing={onProceed}
          onChangeText={(t) => setInputValue(t)}
        />
        {isLoading && (
          <FadeInView style={styles.loader}>
            <Loader />
          </FadeInView>
        )}
      </View>
      <AppButton
        // disabled={!validationState.valid || isLoading}
        disabled={isLoading}
        label="Далее"
        onPress={onProceed}
        containerStyle={styles.proceedBtn}
      />
      <Pressable onPress={onPolicyLinkPress}>
        {({pressed}) => (
          <AppText
            wrapperStyle={styles.policyTextWrapper}
            type="small"
            color={Colors.gray6}>
            {'Нажимая кнопку далее вы даете '}
            <AppText
              wrapperStyle={{
                opacity: pressed
                  ? DEFAULT_DISABLED_OPACITY
                  : DEFAULT_ACTIVE_OPACITY,
              }}
              type="link"
              color={Colors.gray6}>
              {'согласие на обработку персональных данных'}
            </AppText>
          </AppText>
        )}
      </Pressable>
    </FadeInView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: WINDOW_GUTTER,
    paddingBottom: WINDOW_GUTTER,
  },
  loader: {
    position: 'absolute',
    bottom: 0,
    right: SIZE_8,
    height: DEFAULT_INPUT_HEIGHT,
    alignItems: 'center',
  },
  proceedBtn: {
    marginTop: SIZE_32,
  },
  policyTextWrapper: {
    marginTop: SIZE_16,
  },
  titleTextWrapper: {
    marginTop: SIZE_8,
  },
});

export default AuthSignInScreen;
