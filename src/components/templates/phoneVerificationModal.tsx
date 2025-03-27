import React, {
  forwardRef,
  useRef,
  useState,
  useCallback,
  useImperativeHandle,
} from 'react';
import type {ForwardRefRenderFunction} from 'react';

import {Keyboard, Platform, StyleSheet, View} from 'react-native';

import RNModal from 'react-native-modal';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {CodeConfirm} from '@components/organisms';

import {getUserDataThunk} from '@state/user';
import {useThunkDispatch} from '@state/hooks';

import {
  MANUAL_REJECT_ERROR,
  DEFAULT_UNEXPECTED_ERROR_TEXT,
} from '@services/error';
import ApiService from '@services/api';

import {useMount} from '@hooks';

import {Colors} from '@styles/colors';
import {SIZE_16, SIZE_24} from '@styles/sizes';

import type {
  AuthorizeUserResponse,
  AuthorizeUserRequestParams,
  AuthVerificationResponse,
  AuthVerificationRequestParams,
  PhoneVerificationResolver,
  PhoneVerificationRejecter,
  PhoneVerificationModalRefObject,
} from '@types';

interface PhoneVerificationModalProps {}

const PhoneVerificationModal: ForwardRefRenderFunction<
  PhoneVerificationModalRefObject,
  PhoneVerificationModalProps
> = ({}, ref) => {
  //#region STORE
  const dispatch = useThunkDispatch();
  //#endregion

  //#region MEASURE
  const {bottom: bottomSafeAreaInset} = useSafeAreaInsets();
  //#endregion

  //#region STATE
  const [modalIsVisible, setModalIsVisible] = useState<boolean>(false);
  const [currentPhone, setCurrentPhone] = useState<string>('');
  //#endregion

  //#region PROMISE REFS
  const resolver = useRef<PhoneVerificationResolver>();
  const rejecter = useRef<PhoneVerificationRejecter>();

  const resetRefs = useCallback(() => {
    resolver.current = undefined;
    rejecter.current = undefined;
  }, []);
  //#endregion

  //#region MODAL CONTROLS
  const show = useCallback(() => setModalIsVisible(true), []);
  const hide = useCallback(() => setModalIsVisible(false), []);

  const dismiss = useCallback(() => {
    rejecter.current && rejecter.current({type: 'manual'});
    resetRefs();
    Keyboard.dismiss();
    hide();
  }, [hide, resetRefs]);
  //#endregion

  //#region CLEANUP
  const requestCodeRef =
    useRef<ApiService<AuthorizeUserRequestParams, AuthorizeUserResponse>>();
  const verifyCodeRef =
    useRef<
      ApiService<AuthVerificationRequestParams, AuthVerificationResponse>
    >();

  useMount(() => {
    return () => {
      requestCodeRef.current && requestCodeRef.current.abort();
      verifyCodeRef.current && verifyCodeRef.current.abort();
    }; //cleanup
  });
  //#endregion

  //#region REQUEST CODE CALL
  const requestCode = useCallback(async (phone: string): Promise<void> => {
    const requestParams = {phone: phone};
    requestCodeRef.current = new ApiService<
      AuthorizeUserRequestParams,
      AuthorizeUserResponse
    >('POST', 'user/auth/phone', requestParams);
    await requestCodeRef.current.call();
  }, []);
  //#endregion

  //#region VERIFICATION
  const requestVerification = useCallback(
    async (nextPhone) => {
      try {
        setCurrentPhone(nextPhone);

        //#region REUQEST CODE
        await requestCode(nextPhone);
        //#endregion

        show();
        const result = await new Promise((resolve, reject) => {
          resolver.current = resolve;
          rejecter.current = reject;
        })
          .then((isSuccessful) => isSuccessful)
          .catch((rejectReason) => {
            if (rejectReason?.type === 'manual') {
              throw new Error(MANUAL_REJECT_ERROR);
            } else {
              throw new Error(rejectReason.message);
            }
          });
        return result;
      } catch (err) {
        throw err;
      } finally {
        hide();
      }
    },
    [hide, requestCode, show],
  );
  //#endregion

  //#region EVENTS
  const onRequestCodePress = useCallback(async () => {
    requestCode(currentPhone);
  }, [currentPhone, requestCode]);
  const onSuccessfulCodeConfirm = useCallback(async () => {
    try {
      await dispatch(getUserDataThunk());
    } catch (err) {
      throw err;
    }
  }, [dispatch]);

  const onCodeInputComplete = useCallback(
    async (code) => {
      try {
        const requestParams = {code, phone: currentPhone};

        verifyCodeRef.current = new ApiService<
          AuthVerificationRequestParams,
          AuthVerificationResponse
        >('POST', 'user/confirm/code', requestParams);

        // returns only status
        await verifyCodeRef.current.call();

        //successful verification final action
        await onSuccessfulCodeConfirm();

        //if it works up here - everything go ok
        resolver.current && resolver.current(true);
      } catch (err) {
        rejecter.current &&
          rejecter.current({
            type: 'error',
            message: err.message || DEFAULT_UNEXPECTED_ERROR_TEXT,
          });
      }
    },
    [onSuccessfulCodeConfirm, currentPhone],
  );
  //#endregion

  //#region IMPERIUM
  useImperativeHandle(
    ref,
    () => {
      return {
        dismiss,
        requestVerification,
        isVisible: modalIsVisible,
      };
    },
    [dismiss, requestVerification, modalIsVisible],
  );
  //#endregion

  return (
    <RNModal
      isVisible={modalIsVisible}
      hasBackdrop={true}
      onBackdropPress={dismiss}
      style={styles.modalContainer}>
      <View
        style={[styles.modal, {paddingBottom: bottomSafeAreaInset + SIZE_24}]}>
        <CodeConfirm
          phone={currentPhone}
          autoFocus={false}
          onCodeInputComplete={onCodeInputComplete}
          onRequestCodePress={onRequestCodePress}
          showSnackbarInternally={false}
        />
      </View>
      {Platform.OS === 'ios' && (
        <KeyboardSpacer topSpacing={-bottomSafeAreaInset} />
      )}
    </RNModal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modal: {
    width: '100%',
    paddingHorizontal: SIZE_16,
    paddingTop: SIZE_24,
    backgroundColor: Colors.white,
    borderTopLeftRadius: SIZE_16,
    borderTopRightRadius: SIZE_16,
  },
});

export default forwardRef(PhoneVerificationModal);
