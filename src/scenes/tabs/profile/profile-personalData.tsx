import React, {FC, useCallback, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';

import {useSelector} from 'react-redux';

import {Formik, FormikHelpers} from 'formik';

import type {ProfilePersonalDataScreenProps} from '@navigation/types';

import {
  AppButton,
  AppText,
  FormTextInput,
  PressableOpacity,
  RequestUpdateIndicator,
} from '@components/atoms';
import {ConfirmationModal} from '@components/organisms';

import {useThunkDispatch} from '@state/hooks';
import {deleteAccountThunk, patchUserDataThunk} from '@state/user';

import {CommonStyles} from '@styles/common';
import {SIZE_24, WINDOW_GUTTER} from '@styles/sizes';
import {scale} from '@styles/mixins';
import {Colors} from '@styles/colors';

import {showSnack} from '@utils';

import type {CombinedState, UserSliceState} from '@state/types';
import type {User, UserPersonalData, UserUpdateFormResult} from '@types';

import {DEFAULT_UNEXPECTED_ERROR_TEXT} from '@services/error';

const getApiErrorByType = (type: string, field?: string): string => {
  switch (type) {
    case 'emptyField':
      return 'Заполните обязательное поле';
    case 'errorField':
      return 'Проверьте введенные данные';
    case 'noUniqueField':
      return `${
        field === 'phone'
          ? 'Введенный номер телефона'
          : field === 'email'
          ? 'Введенный адрес электронной почты'
          : 'Введенные данные'
      } уже есть в базе`;
    default:
      return '';
  }
};

const initialUserPersonalData: UserPersonalData = {
  fio: '',
  email: '',
  phone: '+7',
};

type UserDataFormState = {
  personalData: UserPersonalData;
};

/**
 * @param pd - personalData
 */
const getFormResult = (pd: UserPersonalData): UserUpdateFormResult => ({...pd});

const ProfilePersonalDataScreen: FC<ProfilePersonalDataScreenProps> = ({
  navigation,
}) => {
  const dispatch = useThunkDispatch();
  const {userData: storedUserData} = useSelector<
    CombinedState,
    {userData: UserSliceState['userData']}
  >((state) => ({
    userData: state.user.userData,
  }));

  const [userData, setUserData] = useState<UserDataFormState>({
    personalData: initialUserPersonalData,
  });

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    if (storedUserData) {
      const {personalData: nextPersonalData} = (({
        id: _id,
        ...rest
      }: User): UserDataFormState => ({
        personalData: rest,
      }))(storedUserData);

      setUserData({
        personalData: nextPersonalData,
      });
    } else {
      setUserData({
        personalData: initialUserPersonalData,
      });
    }
  }, [storedUserData]);

  const onSubmitForm = async (
    personalData: UserPersonalData,
    helpers: FormikHelpers<UserPersonalData>,
  ) => {
    try {
      helpers.setSubmitting(true);

      const formResult = getFormResult(personalData);
      const thunkResult = await dispatch(patchUserDataThunk(formResult));
      if (patchUserDataThunk.fulfilled.match(thunkResult)) {
        showSnack({
          type: 'success',
          message: 'Данные обновлены',
        });
      } else if (patchUserDataThunk.rejected.match(thunkResult)) {
        if (thunkResult.payload) {
          const {payload: errorPayload} = thunkResult;
          let formErrors: {[key: string]: string} = {};
          for (const [errorType, fields] of Object.entries(errorPayload)) {
            if (fields) {
              for (const field of fields) {
                if (!formErrors[field]) {
                  Object.assign(formErrors, {
                    [field]: getApiErrorByType(errorType, field),
                  });
                }
              }
            }
          }
          helpers.setErrors(formErrors);
        } else if (thunkResult.error) {
          throw thunkResult.error;
        } else {
          throw new Error('Произошла ошибка');
        }
      }
    } catch (err) {
      let error = err as Error;
      showSnack({
        type: 'danger',
        message: error?.message || DEFAULT_UNEXPECTED_ERROR_TEXT,
      });
    } finally {
      helpers.setSubmitting(false);
    }
  };

  const [isProceeding, setIsProceeding] = useState<boolean>(false);

  const deleteAccount = useCallback(async () => {
    try {
      setIsProceeding(true);
      await dispatch(deleteAccountThunk());
      navigation.pop();
    } catch (err) {
      let error = err as Error;
      showSnack({
        type: 'danger',
        message: error?.message || DEFAULT_UNEXPECTED_ERROR_TEXT,
      });
    } finally {
      setIsProceeding(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //#endregion

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={userData.personalData}
        onSubmit={onSubmitForm}
        validate={validate}
        validateOnChange={false}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          isSubmitting,
          isValid,
        }) => (
          <View style={[CommonStyles.fill, styles.contentContainer]}>
            <View>
              <AppText type="h3">{'Личная информация'}</AppText>
              <FormTextInput
                editable={false}
                label="Телефон"
                onChangeText={handleChange('phone')}
                onBlur={handleBlur('phone')}
                value={values.phone}
                mask={'+7([000])[000]-[00]-[00]'}
                errorText={errors.phone}
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
              {isSubmitting && <RequestUpdateIndicator />}
            </View>
            <View>
              <AppButton
                disabled={isSubmitting || !isValid}
                label={'Сохранить'}
                onPress={handleSubmit}
                containerStyle={styles.submitButton}
              />
              <PressableOpacity
                hitSlop={15}
                style={styles.deleteAccountButton}
                onPress={() => setModalVisible(true)}>
                <AppText color={Colors.gray6} type="control">
                  {'Удалить аккаунт'}
                </AppText>
              </PressableOpacity>
            </View>
          </View>
        )}
      </Formik>
      <ConfirmationModal
        visible={modalVisible}
        title={'Подтвердите действие'}
        message={
          'Вы уверены, что хотите удалить аккаунт?\nБаллы будут обнулены, а история заказов удалена. Отменить это действие будет невозможно'
        }
        actionButtonCaption={'Удалить'}
        action={deleteAccount}
        onDismissButtonPress={() => setModalVisible(false)}
      />
      {isProceeding && <RequestUpdateIndicator />}
    </>
  );
};

const validate = (values: UserPersonalData) => {
  let errors = {};

  // PHONE IS DISABLED FOR NOW
  // if (values.phone.length > 0 && values.phone.length < 16) {
  //   Object.assign(errors, {phone: 'Проверьте правильность ввода'});
  // }

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

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: WINDOW_GUTTER,
    marginTop: scale(31),
    justifyContent: 'space-between',
  },
  submitButton: {
    marginBottom: scale(16),
  },
  deleteAccountButton: {
    alignSelf: 'center',
    marginBottom: SIZE_24,
  },
});

export default ProfilePersonalDataScreen;
