import React, {FC, useState} from 'react';
import {View, Pressable} from 'react-native';

import {AppText, Icon} from '@components/atoms';

import ConfirmationModal from './confirmationModal';

import {Colors} from '@styles/colors';

interface HeaderRightComponentProps {
  modalAction: () => void;
  modalTitle: string;

  modalMessage?: string;

  disabled?: boolean;
  iconName?: string;
  pressableText?: string;
  pressableColor?: string;
}

const HeaderRightComponent: FC<HeaderRightComponentProps> = ({
  modalAction,
  modalTitle,
  modalMessage,
  iconName,
  pressableText,
  disabled = false,
  pressableColor = Colors.error.default,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  return (
    <View>
      <Pressable
        disabled={disabled}
        hitSlop={24}
        onPress={() => setModalVisible(true)}>
        {iconName ? (
          <Icon name={iconName} size={24} color={pressableColor} />
        ) : (
          <AppText type="small" color={pressableColor}>
            {pressableText}
          </AppText>
        )}
      </Pressable>
      <ConfirmationModal
        deriveActionOnModalHide
        visible={modalVisible}
        title={modalTitle}
        message={modalMessage}
        action={modalAction}
        onDismissButtonPress={() => setModalVisible(false)}
      />
    </View>
  );
};

export default HeaderRightComponent;
