import React, {FC, useCallback, useEffect, useRef, useState} from 'react';

import {View, Platform, StyleSheet} from 'react-native';
import type {NativeSyntheticEvent, TextInputFocusEventData} from 'react-native';

import {useSelector} from 'react-redux';

import {Formik, FormikHelpers} from 'formik';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import type {CheckoutConfirmScreenProps} from '@navigation/types';

import {
  Loader,
  AppText,
  AppButton,
  FormTextInput,
  SeparatorLine,
  PressableOpacity,
  RequestUpdateIndicator,
} from '@components/atoms';
import {CheckoutConfirmSection} from '@components/molecules';
import {PhoneVerificationModal} from '@components/templates';

import {clearCartThunk} from '@state/cart';
import {getUserDataThunk} from '@state/user';
import {useIsAuthorized, useThunkDispatch} from '@state/hooks';

import type {CartSliceState, CombinedState} from '@state/types';

import {
  DEFUALT_ERROR_TITLE,
  MANUAL_REJECT_ERROR,
  DEFAULT_UNEXPECTED_ERROR_TEXT,
} from '@services/error';
import ApiService from '@services/api';

import {useApiCall, useMount} from '@hooks';

import {getPriceWithValuableDecimals, getRawPhone, showSnack} from '@utils';

import {
  SIZE_16,
  SIZE_24,
  WINDOW_GUTTER,
  DEFAULT_BORDER_RADIUS,
  DEFAULT_BUTTON_BORDER_RADIUS,
  SIZE_48,
} from '@styles/sizes';
import {scale} from '@styles/mixins';
import {Colors} from '@styles/colors';
import {Literals} from '@styles/typography';
import {CommonStyles} from '@styles/common';

import type {
  PaymentOption,
  PromocodeResult,
  CheckoutFormData,
  UserPersonalData,
  CreateOrderResponse,
  CreateOrderRequestParams,
  GetCalculatedOrderDataResponse,
  GetCalculatedOrderDataRequestParams,
  PhoneVerificationModalRefObject,
} from '@types';

const SCROLLVIEW_ADDITIONAL_INSET = SIZE_24 + DEFAULT_BUTTON_BORDER_RADIUS;

const CheckoutConfirmScreen: FC<CheckoutConfirmScreenProps> = ({
  navigation,
  route: {
    params: {deliveryId: routeDeliveryId, deliveryDay: routeDeliveryDay},
  },
}) => {
  //#region CONTROL
  const scrollRef = useRef<KeyboardAwareScrollView>(null);
  //#endregion

  //#region STORE
  const dispatch = useThunkDispatch();
  const isAuthorized = useIsAuthorized();
  const {data: storedCartProducts} = useSelector<CombinedState, CartSliceState>(
    ({cart: {data}}) => ({
      data,
    }),
  );
  //#endregion

  //#region DATA
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [selectedPaymentOption, setSelectedPaymentOption] =
    useState<PaymentOption>();

  //#region PROMOCODE
  const [promocode, setPromocode] = useState<string>();
  const [promocodeResult, setPromocodeResult] = useState<PromocodeResult>();
  //#endregion

  const {
    data: dataSource,
    loadingState,
    initialized,
    callTrigger,
  } = useApiCall<
    GetCalculatedOrderDataRequestParams,
    GetCalculatedOrderDataResponse
  >({
    method: 'GET',
    endpoint: 'order',
    requestParams: {
      cart: storedCartProducts,
      deliveryId: routeDeliveryId,
      deliveryDay: routeDeliveryDay,
      promocode,
    },
    responseInterceptor: (r) => {
      setSelectedPaymentOption(r.paymentList[0]);

      setTotalPrice(r.total.filter((t) => t.isTotal)[0].value);

      if (r.promocode) {
        r.promocode && setPromocodeResult(r.promocode);
        scrollRef.current && scrollRef.current.scrollToEnd();
      } else {
        setPromocodeResult(undefined);
      }
      return r;
    },
  });

  useEffect(() => {
    initialized && callTrigger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [promocode]);
  //#endregion
  //#region COMMON
  const {bottom: safeAreaBottomInset} = useSafeAreaInsets();
  //#endregion

  //#region BINDING
  const onChangePickPointButtonPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);
  //#endregion

  //#region VERIFICATION
  const phoneVerificationRef = useRef<PhoneVerificationModalRefObject>(null);

  //---- должно решить вопрос с обновлением данных в профиле, по значению этой переменной буду запускать обновление данных профиля юзера по факту оформления
  // const [checkoutAsUnauthorized, setCheckoutAsUnauthorized] =
  //   useState<boolean>(false);
  //----
  //#endregion

  //#region ORDER CREATE
  let requestRef =
    useRef<ApiService<CreateOrderRequestParams, CreateOrderResponse>>();

  useMount(() => {
    return requestRef.current && requestRef.current.abort(); //cleanup
  });

  const onOrderCreateSuccess = useCallback(
    async (
      {
        id: orderId,
        info: warningText,
        total,
        status,
        address,
        photo,
      }: CreateOrderResponse,
      updateUserData: boolean = false,
    ) => {
      try {
        await dispatch(clearCartThunk());

        if (updateUserData) {
          await dispatch(getUserDataThunk());
        }
      } finally {
        const descriptionData = [
          {title: 'Адрес аптеки', text: address},
          {title: 'Статус', text: status},
        ];

        for (let k in total) {
          descriptionData.push({
            title: total[k].name,
            text: `${total[k].sign || ''}${getPriceWithValuableDecimals(
              total[k].value,
            )} ${Literals.currency}`,
          });
        }

        navigation.replace('CheckoutFinal', {
          orderId,
          descriptionData,
          warningText,
          imageSource: photo,
        });
      }
    },
    [dispatch, navigation],
  );
  //#endregion

  //#region FORM
  const onSubmitForm = async (
    formData: CheckoutFormData,
    helpers: FormikHelpers<CheckoutFormData>,
  ) => {
    try {
      if (!dataSource || !selectedPaymentOption) {
        throw new Error(DEFAULT_UNEXPECTED_ERROR_TEXT);
      }
      helpers.setSubmitting(false); //TODO как без костыля этого? при handleSubmit сам устанавливает isSubmitting в true
      //#region VALIDATE
      let errors: Partial<{[K in keyof CheckoutFormData]: string}> = {};

      if (formData.phone.length === 0 || formData.phone.length === 3) {
        //3 = +7( - default mask input
        Object.assign(errors, {phone: 'Обязательное поле'});
      } else if (getRawPhone(formData.phone).length < 11) {
        Object.assign(errors, {phone: 'Проверьте правильность ввода'});
      }

      if (formData.fio.length === 0) {
        Object.assign(errors, {fio: 'Обязательное поле'});
      }

      if (Object.keys(errors).length > 0) {
        helpers.setErrors(errors);
        scrollRef.current && scrollRef.current.scrollToPosition(0, 0, true);
        return;
      }
      //#endregion

      let needToUpdateUser = false;

      if (!isAuthorized && phoneVerificationRef.current) {
        //returns true if everything gone well / otherwise - throws
        await phoneVerificationRef.current.requestVerification(formData.phone);
        needToUpdateUser = true;
      }

      helpers.setSubmitting(true);

      requestRef.current = new ApiService<
        CreateOrderRequestParams,
        CreateOrderResponse
      >('POST', 'order', {
        cart: storedCartProducts,
        recipient: (({promocode: _, ...rest}) => rest)(formData),
        deliveryDay: routeDeliveryDay,
        deliveryId: dataSource?.pickPointData.id,
        paymentId: selectedPaymentOption.id,
      });

      const response = await requestRef.current.call();
      if (response) {
        onOrderCreateSuccess(response, needToUpdateUser);
      } else {
        throw new Error(DEFAULT_UNEXPECTED_ERROR_TEXT);
      }
      helpers.setSubmitting(false);
    } catch (err) {
      if (err.message !== MANUAL_REJECT_ERROR) {
        showSnack({
          message: DEFUALT_ERROR_TITLE,
          description: err.message,
          type: 'danger',
        });
      }
      helpers.setSubmitting(false);
    }
  };
  //#endregion

  if (loadingState === 'loading') {
    return <Loader size="large" />;
  }

  if (!dataSource) {
    return null; //TODO error component
  }

  return (
    <View style={[CommonStyles.fill, {marginBottom: safeAreaBottomInset}]}>
      <Formik
        enableReinitialize
        initialValues={{...dataSource.recipient, promocode: ''}}
        onSubmit={onSubmitForm}
        validate={validate}
        // validateOnBlur={false}
        validateOnChange={false}
        // validateOnMount={true}
      >
        {({
          handleBlur,
          handleChange,
          handleSubmit,

          values,
          errors,

          isSubmitting,
          isValid,
        }) => (
          <>
            <KeyboardAwareScrollView
              ref={scrollRef}
              extraScrollHeight={Platform.select({android: SIZE_48, ios: 0})}
              enableOnAndroid={true}
              keyboardDismissMode="interactive"
              style={styles.scrollContainer}
              contentContainerStyle={styles.contentContainer}
              scrollIndicatorInsets={{
                bottom: SCROLLVIEW_ADDITIONAL_INSET,
              }}>
              <CheckoutConfirmSection label="Контактные данные">
                <>
                  <FormTextInput
                    label="Телефон*"
                    value={values.phone}
                    keyboardType="phone-pad"
                    mask={'+7([000])[000]-[00]-[00]'}
                    onChangeText={handleChange('phone')}
                    onBlur={handleBlur('phone')}
                    placeholderText="Введите номер телефона"
                    errorText={errors.phone}
                  />
                  <FormTextInput
                    label="ФИО*"
                    value={values.fio}
                    onChangeText={handleChange('fio')}
                    onBlur={handleBlur('fio')}
                    placeholderText="Введите ФИО"
                    errorText={errors.fio}
                  />
                  <FormTextInput
                    label="Email"
                    value={values.email}
                    keyboardType="email-address"
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    placeholderText="Введите email"
                    errorText={errors.email}
                  />
                </>
              </CheckoutConfirmSection>
              <CheckoutConfirmSection label="Аптека самовывоза">
                <View style={CommonStyles.centrizedRow}>
                  <AppText type="control">
                    {dataSource.pickPointData.address}
                  </AppText>
                  <PressableOpacity onPress={onChangePickPointButtonPress}>
                    <AppText type="link" color={Colors.gray8}>
                      {'Изменить'}
                    </AppText>
                  </PressableOpacity>
                </View>
              </CheckoutConfirmSection>
              <CheckoutConfirmSection label="Время самовывоза">
                <AppText type="control">{dataSource.deliveryDay}</AppText>
              </CheckoutConfirmSection>
              {selectedPaymentOption && (
                <CheckoutConfirmSection label="Оплата">
                  <View style={styles.paymentContainer}>
                    <AppText>{selectedPaymentOption.name}</AppText>
                  </View>
                </CheckoutConfirmSection>
              )}
              <CheckoutConfirmSection label="Промокод">
                <FormTextInput
                  //TODO add reset functionality
                  label="Промокод"
                  placeholder="Введите промокод"
                  onChangeText={handleChange('promocode')}
                  onBlur={Platform.select<
                    (e: NativeSyntheticEvent<TextInputFocusEventData>) => void
                  >({
                    ios: ({nativeEvent: {text}}) => {
                      setPromocode(text);
                      handleBlur('promocode');
                    },
                    android: () => {
                      setPromocode(values.promocode);
                      handleBlur('promocode');
                    },
                  })}
                  value={values.promocode}
                  errorTextColor={
                    !errors.promocode && promocodeResult?.applied
                      ? Colors.success.default
                      : Colors.error.default
                  }
                  errorText={errors.promocode || promocodeResult?.message || ''}
                  containerStyle={styles.promocodeInputContainer}
                />
              </CheckoutConfirmSection>
              <SeparatorLine
                color={Colors.gray4}
                offsets={{top: SIZE_24, bottom: SIZE_24}}
              />
              <View style={styles.totalPriceContainer}>
                {dataSource.total.map((item, index) => (
                  <View
                    key={index.toString(10)}
                    style={[
                      styles.totalPriceTextRow,
                      index + 1 !== dataSource.total.length &&
                        styles.totalPriceTextRowOffset,
                    ]}>
                    <AppText>{item.name}</AppText>
                    <AppText type="control">{`${
                      item.sign ? `${item.sign} ` : ''
                    }${getPriceWithValuableDecimals(item.value)} ${
                      Literals.currency
                    }`}</AppText>
                  </View>
                ))}
              </View>
            </KeyboardAwareScrollView>
            <AppButton
              label="Оформить"
              disabled={isSubmitting || !isValid}
              additionalText={`${getPriceWithValuableDecimals(totalPrice)} ${
                Literals.currency
              }`}
              onPress={handleSubmit}
              containerStyle={styles.proceedButtonContainer}
            />
            {!phoneVerificationRef.current?.isVisible &&
              (isSubmitting || loadingState === 'updating') && (
                <RequestUpdateIndicator />
              )}
          </>
        )}
      </Formik>
      {/* TODO phone verification backend*/}
      <PhoneVerificationModal ref={phoneVerificationRef} />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    marginBottom: SCROLLVIEW_ADDITIONAL_INSET,
  },
  contentContainer: {
    paddingHorizontal: WINDOW_GUTTER,
    paddingBottom: SCROLLVIEW_ADDITIONAL_INSET,
  },
  //#region PAYMENT
  paymentContainer: {
    justifyContent: 'center',
    paddingHorizontal: SIZE_16,
    height: scale(52),
    borderRadius: DEFAULT_BORDER_RADIUS,
    backgroundColor: Colors.gray2,
  },
  //#endregion
  //#region PROMOCODE
  promocodeInputContainer: {
    paddingTop: 0,
  },
  //#endregion
  //#region TOTAL
  totalPriceContainer: {
    marginBottom: SIZE_24,
  },
  totalPriceTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalPriceTextRowOffset: {
    marginBottom: SIZE_16,
  },
  //#endregion
  //#region PROCEED
  proceedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    marginBottom: SIZE_24,
    paddingHorizontal: WINDOW_GUTTER,
  },
  //#endregion
});

const validate = (values: UserPersonalData) => {
  //TODO create service for form validation
  let errors = {};

  if (values.phone.length !== 0 && getRawPhone(values.phone).length < 11) {
    Object.assign(errors, {phone: 'Проверьте правильность ввода'});
  }

  if (/\d/.test(values.fio)) {
    Object.assign(errors, {fio: 'Имя не должно содержать цифр'});
  }

  if (
    values.email.length > 0 &&
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
  ) {
    Object.assign(errors, {email: 'Неверный адрес электронной почты'});
  }

  return errors;
};

export default CheckoutConfirmScreen;
