import React, {FC, useCallback, useState} from 'react';
import {View, StyleSheet} from 'react-native';

import Modal from 'react-native-modal';

import {AppButton, AppText} from '@components/atoms';

import {Colors} from '@styles/colors';
import {SIZE_16, SIZE_24} from '@styles/sizes';

import type {ButtonType} from '@components/atoms/types';

interface ConfirmationModalProps {
  visible: boolean;

  title?: string;
  message?: string;

  actionButtonCaption?: string;
  actionButtonType?: ButtonType;

  dismissButtonCaption?: string;
  dismissButtonType?: ButtonType;

  action: () => void;
  onDismissButtonPress: () => void;

  deriveActionOnModalHide?: boolean;
}

const ConfirmationModal: FC<ConfirmationModalProps> = ({
  visible,

  title,
  message,
  actionButtonCaption = 'Да',
  actionButtonType = 'discard',
  dismissButtonCaption = 'Нет',
  dismissButtonType = 'primary',
  children,

  action,
  onDismissButtonPress,

  deriveActionOnModalHide = false,
}) => {
  const [doAction, setDoAction] = useState<boolean>(false); //чтоб не вызывать при нажатии кнопки отмены
  const onModalHide = useCallback(
    () => doAction && deriveActionOnModalHide && action(),
    [action, doAction, deriveActionOnModalHide],
  );

  //#region HANDLERS
  const handleOnAcceptButtonPress = useCallback(() => {
    onDismissButtonPress();
    if (deriveActionOnModalHide) {
      setDoAction(true);
    } else {
      action();
    }
  }, [action, deriveActionOnModalHide, onDismissButtonPress]);

  const handleOnDismissButtonPress = useCallback(() => {
    setDoAction(false);
    onDismissButtonPress();
  }, [onDismissButtonPress]);
  //#endregion

  return (
    <Modal
      isVisible={visible}
      useNativeDriver
      useNativeDriverForBackdrop
      swipeDirection={['down']}
      onSwipeComplete={handleOnDismissButtonPress}
      onBackButtonPress={handleOnDismissButtonPress}
      onBackdropPress={handleOnDismissButtonPress}
      onModalHide={onModalHide}
      style={styles.modalContainer}>
      <View style={styles.modal}>
        {children ? (
          children
        ) : (
          <>
            <AppText type="h2" color={Colors.gray9}>
              {title}
            </AppText>
            {message && (
              <AppText
                type="bodyBold"
                wrapperStyle={styles.message}
                color={Colors.gray7}>
                {message}
              </AppText>
            )}
          </>
        )}
        <View style={styles.buttonsContainer}>
          <AppButton
            label={actionButtonCaption}
            type={actionButtonType}
            width={children ? 'wide' : 'narrow'}
            onPress={handleOnAcceptButtonPress}
          />
          {!children && (
            <AppButton
              label={dismissButtonCaption}
              type={dismissButtonType}
              width="narrow"
              onPress={handleOnDismissButtonPress}
            />
          )}
        </View>
      </View>
    </Modal>
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
    paddingVertical: SIZE_24,
    backgroundColor: Colors.white,
    borderTopLeftRadius: SIZE_16,
    borderTopRightRadius: SIZE_16,
  },
  message: {
    marginTop: SIZE_24,
  },
  buttonsContainer: {
    marginVertical: SIZE_24,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default ConfirmationModal;
