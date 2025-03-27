import React, {FC, useCallback, useMemo, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';

import {useSelector} from 'react-redux';
import {Formik, FormikHelpers} from 'formik';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import type {ProfileReviewAddScreenProps} from '@navigation/types';

import {
  Icon,
  AppText,
  AppButton,
  SelectButton,
  FormTextInput,
  RequestUpdateIndicator,
} from '@components/atoms';
import {Rating, PhotoUpload} from '@components/molecules';
import {ConfirmationModal, SelectListModal} from '@components/organisms';

import {CombinedState} from '@state/types';

import ApiService from '@services/api';
import {DEFAULT_REVIEW_ADD_ERROR_TEXT} from '@services/error';

import {useApiCall} from '@hooks';

import {Colors} from '@styles/colors';
import {CommonStyles} from '@styles/common';
import {padding, scale} from '@styles/mixins';
import {SIZE_16, SIZE_24, WINDOW_GUTTER} from '@styles/sizes';

import type {
  ImageSource,
  ReviewFormData,
  ReviewAddResponse,
  PharmacySelectItem,
  ReviewAddRequestParams,
  GetPharmacyListResponse,
  SelectListModalRefObject,
  GetPharmacyListRequestParams,
} from '@types';
import {showSnack} from '@utils';

const defaultFormData: ReviewFormData = {
  fio: '',
  email: '',
  message: '',
  rating: 0,
  images: [],
};

const ProfileReviewAddScreen: FC<ProfileReviewAddScreenProps> = ({
  navigation,
}) => {
  //#region STATE
  //#region REVIEW ERROR
  const [lastReviewError, setLastReviewError] = useState<string>();
  const resetLastReviewError = useCallback(
    () => setLastReviewError(undefined),
    [],
  );
  //#endregion
  const {initialFormData} = useSelector(
    ({user: {userData}}: CombinedState) => ({
      initialFormData: Object.assign(
        {},
        defaultFormData,
        userData?.fio && {fio: userData.fio},
        userData?.email && {email: userData.email},
      ),
    }),
  );
  //#endregion

  //#region RESULT MODAL
  const [resultModalVisible, setResultModalVisible] = useState<boolean>(false);

  const dismissResultModal = useCallback(() => {
    setResultModalVisible(false);
  }, []);

  const resultModalAction = useCallback(() => {
    if (!lastReviewError) {
      navigation.popToTop();
    } else {
      dismissResultModal();
    }
  }, [lastReviewError, navigation, dismissResultModal]);
  //#endregion

  //#region PHARMACY
  const [selectedPharmacyId, setSelectedPharmacyId] = useState<number>();

  const [pharmacyListDataSource, setPharmacyListDataSource] = useState<
    PharmacySelectItem[]
  >([]);

  const {loadingState: pharmacyListLoadingState} = useApiCall<
    GetPharmacyListRequestParams,
    GetPharmacyListResponse
  >({
    method: 'GET',
    endpoint: 'pharmacy',
    responseInterceptor: (r) => {
      setPharmacyListDataSource(
        Array.from(r, ({id, address, city}) => ({
          id,
          name: `${city}, ${address}`,
        })),
      );
      return r;
    },
  });

  const pharmacySelectModalRef = useRef<SelectListModalRefObject>(null);

  const onSelectPharmacyButtonPress = useCallback(() => {
    pharmacySelectModalRef.current && pharmacySelectModalRef.current.show();
  }, []);
  //#endregion

  //#region PARTS
  const selectPharmacyButtonLabel = useMemo(
    () =>
      pharmacyListDataSource.find((v) => v.id === selectedPharmacyId)?.name ||
      'Выберите аптеку',
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedPharmacyId],
  );

  const ModalBodyComponent = useMemo(
    () => (
      <>
        <View style={styles.modalIcon}>
          <Icon
            name={
              !lastReviewError ? 'checkbox-circle-line' : 'close-circle-line'
            }
            size={40}
            color={
              !lastReviewError ? Colors.accent.default : Colors.error.default
            }
          />
        </View>

        <AppText type="h2">
          {!lastReviewError ? 'Ваш отзыв успешно\nотправлен' : lastReviewError}
        </AppText>
      </>
    ),
    [lastReviewError],
  );
  //#endregion

  //#region SUBMIT
  const onSubmitForm = useCallback(
    async (
      {images, ...fields}: ReviewFormData,
      helpers: FormikHelpers<ReviewFormData>,
    ) => {
      if (fields.rating === 0) {
        showSnack({
          type: 'warning',
          duration: 'long',
          message: 'Пожалуйста, поставьте оценку',
        });
        return;
      }
      try {
        resetLastReviewError();
        helpers.setSubmitting(true);

        const requestData = new FormData();
        selectedPharmacyId &&
          requestData.append('pharmacy', selectedPharmacyId);
        Object.entries(fields).forEach(([key, value]) => {
          requestData.append(key, value);
        });
        images.forEach((img, index) =>
          requestData.append(`images[${index}]`, img),
        );

        const ApiRequest = new ApiService<
          ReviewAddRequestParams,
          ReviewAddResponse
        >('POST', 'user/review', requestData);
        await ApiRequest.call(); //if 200 - OK else catch in apiservice
        helpers.resetForm();
      } catch (err) {
        setLastReviewError(
          `Произошла ошибка:\n${err.message}` || DEFAULT_REVIEW_ADD_ERROR_TEXT,
        );
      } finally {
        helpers.setSubmitting(false);
        setResultModalVisible(true);
      }
    },
    [resetLastReviewError, selectedPharmacyId],
  );
  //#endregion

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={initialFormData}
        onSubmit={onSubmitForm}
        validate={validate}
        validateOnChange={false}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          values,
          errors,
          isSubmitting,
          isValid,
        }) => {
          return (
            <KeyboardAwareScrollView
              extraHeight={0}
              style={CommonStyles.fill}
              contentContainerStyle={styles.contentContainer}>
              <>
                <SelectButton
                  label={selectPharmacyButtonLabel}
                  onPress={onSelectPharmacyButtonPress}
                  showLoadingIndicator={pharmacyListLoadingState === 'loading'}
                />
                <FormTextInput
                  label="ФИО"
                  placeholderText="Введите ФИО"
                  onChangeText={handleChange('fio')}
                  onBlur={handleBlur('fio')}
                  value={values.fio}
                  errorText={errors.fio}
                />
                <FormTextInput
                  label="Email"
                  placeholderText="Введите email"
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  errorText={errors.email}
                />
                <FormTextInput
                  multiline
                  scrollEnabled={true}
                  label="Сообщение"
                  inputStyle={styles.commentInput}
                  placeholderText="Напишите свой отзыв"
                  value={values.message}
                  onChangeText={handleChange('message')}
                  onBlur={handleBlur('message')}
                />
                <AppText type="productPrice" wrapperStyle={styles.title}>
                  {'Оценка'}
                </AppText>
                <View style={styles.rating}>
                  <Rating
                    value={values.rating}
                    onRatingValueChange={(value: number) =>
                      setFieldValue('rating', value)
                    }
                  />
                </View>
                <AppText type="productPrice" wrapperStyle={styles.title}>
                  {'Прикрепить фото'}
                </AppText>
                <View style={styles.imagePickerContainer}>
                  <PhotoUpload
                    images={values.images}
                    countOfImages={5}
                    onUpload={(images: ImageSource[]) =>
                      setFieldValue('images', images)
                    }
                    onDelete={(name: string) => {
                      setFieldValue(
                        'images',
                        values.images.filter(
                          (image: ImageSource) => image.name !== `${name}`,
                        ),
                      );
                    }}
                  />
                </View>
                {isSubmitting && <RequestUpdateIndicator />}
              </>
              <AppButton
                disabled={isSubmitting || !isValid}
                label={'Отправить'}
                onPress={handleSubmit}
                containerStyle={styles.buttonContainer}
              />
            </KeyboardAwareScrollView>
          );
        }}
      </Formik>
      <ConfirmationModal
        visible={resultModalVisible}
        action={resultModalAction}
        actionButtonType={!lastReviewError ? 'primary' : 'discard'}
        actionButtonCaption={!lastReviewError ? 'Вернуться в профиль' : 'Ок'}
        onDismissButtonPress={dismissResultModal}>
        {ModalBodyComponent}
      </ConfirmationModal>
      {pharmacyListDataSource && (
        <SelectListModal
          withSearch
          selectOptionType="radio"
          ref={pharmacySelectModalRef}
          dataSource={pharmacyListDataSource}
          activeOptions={selectedPharmacyId ? [selectedPharmacyId] : []}
          onSelect={({id}) => {
            if (selectedPharmacyId === id) {
              setSelectedPharmacyId(undefined);
            } else {
              setSelectedPharmacyId(id as number);
            }
          }}
        />
      )}
    </>
  );
};

const validate = (values: ReviewFormData) => {
  let errors = {};

  if (values.fio.length === 0) {
    Object.assign(errors, {fio: 'Обязательное поле'});
  } else if (/\d/.test(values.fio)) {
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

const styles = StyleSheet.create({
  contentContainer: {
    ...padding(SIZE_16, WINDOW_GUTTER),
  },
  imagePickerContainer: {
    marginTop: SIZE_16,
    flexDirection: 'row',
  },
  buttonContainer: {
    marginTop: SIZE_24,
  },
  title: {
    marginTop: SIZE_24,
    marginBottom: SIZE_16,
  },
  rating: {
    alignSelf: 'center',
  },
  commentInput: {
    height: scale(120),
    textAlignVertical: 'top',
  },
  modalIcon: {
    marginTop: scale(4),
    marginBottom: SIZE_24,
    alignSelf: 'center',
  },
});

export default ProfileReviewAddScreen;
