import React, {FC, useState} from 'react';

import {Icon, PressableOpacity} from '@components/atoms';
import {ConfirmationModal} from '@components/organisms';

import {Colors} from '@styles/colors';

interface CartMainHeaderRightProps {
  disabled?: boolean;
  onModalActionButtonPress: () => void;
}
const CartMainHeaderRight: FC<CartMainHeaderRightProps> = ({
  disabled = false,
  onModalActionButtonPress,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const onClearButtonPress = () => setModalVisible(true);
  const onModalDismissButtonPress = () => setModalVisible(false);

  return (
    <>
      <PressableOpacity disabled={disabled} onPress={onClearButtonPress}>
        <Icon name="delete-bin-line" size={24} color={Colors.error.default} />
      </PressableOpacity>
      <ConfirmationModal
        visible={modalVisible}
        title="Вы действительно хотите очистить корзину?"
        actionButtonCaption="Да"
        deriveActionOnModalHide
        action={onModalActionButtonPress}
        onDismissButtonPress={onModalDismissButtonPress}
      />
    </>
  );
};

export default CartMainHeaderRight;
