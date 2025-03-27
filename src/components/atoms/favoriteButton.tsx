import React, {FC, useCallback, useState} from 'react';
import {Pressable} from 'react-native';

import type {StyleProp, ViewStyle} from 'react-native';

import {useNavigation} from '@react-navigation/native';

import Icon from './icon';
import {ConfirmationModal} from '@components/organisms';

import {useIsAuthorized} from '@state/hooks';

import {Colors} from '@styles/colors';
import {DEFAULT_ACTIVE_OPACITY, DEFAULT_DISABLED_OPACITY} from '@styles/common';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onPress: () => void;
  size?: number;
  disabled?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

const FavoriteButton: FC<FavoriteButtonProps> = ({
  isFavorite,
  onPress,
  size = 26,
  disabled = false,
  containerStyle = {},
}) => {
  const navigation = useNavigation();
  const isAuthorized = useIsAuthorized();

  const [modalVisible, setModalVisible] = useState(false);

  const onModalActionButtonPress = useCallback(() => {
    navigation.navigate('AuthStack', {
      screen: 'AuthSignIn',
      params: {
        dismissButtonActionType: 'dismiss',
        onSuccessNavigationActionType: 'pop',
      },
      initial: true,
    });
  }, [navigation]);

  const onModalDismissButtonPress = useCallback(
    () => setModalVisible(false),
    [],
  );

  const onPressHandler = useCallback(() => {
    if (isAuthorized) {
      onPress();
    } else {
      setModalVisible(true);
    }
  }, [onPress, isAuthorized]);
  return (
    <>
      <Pressable
        hitSlop={10}
        disabled={disabled}
        style={containerStyle}
        onPress={onPressHandler}>
        {({pressed}) => (
          <Icon
            name={isFavorite ? 'heart-3-fill' : 'heart-3-line'}
            color={Colors.accent.default}
            size={size}
            style={{
              opacity:
                pressed || disabled
                  ? DEFAULT_DISABLED_OPACITY
                  : DEFAULT_ACTIVE_OPACITY,
            }}
          />
        )}
      </Pressable>
      <ConfirmationModal
        visible={modalVisible}
        title="Для добавления в избранное необходимо авторизоваться"
        actionButtonType="primary"
        dismissButtonType="discard"
        actionButtonCaption="Войти"
        dismissButtonCaption="Отмена"
        deriveActionOnModalHide
        action={onModalActionButtonPress}
        onDismissButtonPress={onModalDismissButtonPress}
      />
    </>
  );
};

export default FavoriteButton;
