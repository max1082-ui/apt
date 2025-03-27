import {useCollapsible, useMount} from '@hooks';
import React, {FC, useCallback, useEffect, useState} from 'react';
import {Pressable, StyleSheet, View, Linking, AppState} from 'react-native';

import type {AppStateStatus} from 'react-native';

import Modal from 'react-native-modal';

import Animated from 'react-native-reanimated';

import {useSelector, shallowEqual} from 'react-redux';

import {
  Icon,
  AppText,
  AppButton,
  DragIndicator,
  NotificationsSwitch,
} from '@components/atoms';

import {
  checkNotificationsPermissionThunk,
  toggleTopicNotificationsSubscriptionThunk,
  togglePersonalNotificationsSubscriptionThunk,
} from '@state/notifications';
import {useThunkDispatch} from '@state/hooks';
import type {CombinedState, NotificationsSliceState} from '@state/types';

import {DEFAULT_UNEXPECTED_ERROR_TEXT} from '@services/error';

import {showSnack} from '@utils';

import {
  SIZE_8,
  SIZE_16,
  SIZE_24,
  SIZE_32,
  SIZE_40,
  WINDOW_WIDTH,
} from '@styles/sizes';
import {Colors} from '@styles/colors';
import {padding, scaleFont} from '@styles/mixins';

const COLLAPSIBLE_TRANSITION_DURATION = 150;

const NotificationsControl: FC = () => {
  //#region STATE
  const dispatch = useThunkDispatch();
  const {notificationsState, isAuthorized} = useSelector<
    CombinedState,
    {notificationsState: NotificationsSliceState; isAuthorized: boolean}
  >(
    (state) => ({
      notificationsState: state.notifications,
      isAuthorized: state.user.isAuthorized,
    }),
    shallowEqual,
  );
  //#endregion

  //#region CHECK_PERM_SUBSCRIPTION
  useMount(() => {
    dispatch(checkNotificationsPermissionThunk());
    const listener = (state: AppStateStatus) => {
      state === 'active' && dispatch(checkNotificationsPermissionThunk());
    };
    AppState.addEventListener('change', listener);
    return () => {
      AppState.removeEventListener('change', listener);
    };
  });
  //#endregion

  //#region MODAL
  const [notificationModalVisible, setNotificationModalVisible] =
    useState<boolean>(false);
  const dismissModal = useCallback(
    () => setNotificationModalVisible(false),
    [],
  );
  //#endregion

  //#region ANIMIATION
  const {
    onCollapsibleNodeLayout,
    expandNode,
    collapseNode,
    animatedHeight,
    // height,
    // progress,
    state: settingsCollapsibleState,
  } = useCollapsible();
  //#endregion

  //#region SETTINGS WARNING CONTROLS
  const onDismissSettingsAlertButtonPress = useCallback(() => {
    dismissModal();
  }, [dismissModal]);
  const onProceedToSettigsButtonPress = useCallback(async () => {
    try {
      Linking.openSettings();
    } catch (err) {
      onDismissSettingsAlertButtonPress();
    }
  }, [onDismissSettingsAlertButtonPress]);
  //#endregion

  const [currentTopicSwitchValue, setCurrentTopicSwitchValue] =
    useState<boolean>(false);

  const [currentPersonalSwitchValue, setCurrentPersonalSwitchValue] =
    useState<boolean>(false);

  const withNotificationsPermissionCheck = useCallback(
    async (callback: () => Promise<void>) => {
      if (!notificationsState.permissionGranted) {
        expandNode();
      } else {
        try {
          await callback();
        } catch (err) {
          return;
        }
      }
    },
    [expandNode, notificationsState.permissionGranted],
  );

  const onTopicSubscriptionSwitchPress = () =>
    withNotificationsPermissionCheck(async () => {
      await dispatch(toggleTopicNotificationsSubscriptionThunk());
    });

  const onPersonalSubscriptionSwitchPress = () =>
    withNotificationsPermissionCheck(async () => {
      const thunkResult = await dispatch(
        togglePersonalNotificationsSubscriptionThunk(),
      );
      if (
        togglePersonalNotificationsSubscriptionThunk.rejected.match(thunkResult)
      ) {
        showSnack({
          type: 'danger',
          message: thunkResult.error.message || DEFAULT_UNEXPECTED_ERROR_TEXT,
        });
      }
    });

  useEffect(() => {
    if (
      notificationsState.permissionGranted &&
      settingsCollapsibleState === 'expanded'
    ) {
      collapseNode();
      setTimeout(() => {
        setCurrentTopicSwitchValue(notificationsState.topicSubscribed || false);
        setCurrentPersonalSwitchValue(
          notificationsState.personalSubscribed || false,
        );
      }, COLLAPSIBLE_TRANSITION_DURATION);
    } else {
      setCurrentTopicSwitchValue(notificationsState.topicSubscribed || false);
      setCurrentPersonalSwitchValue(
        notificationsState.personalSubscribed || false,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notificationsState]);

  return (
    <>
      <Pressable hitSlop={24} onPress={() => setNotificationModalVisible(true)}>
        <Icon
          name={`notification-${
            notificationsState.permissionGranted ? '4' : 'off'
          }-line`}
          size={24}
          color={
            notificationsState.permissionGranted
              ? Colors.accent.default
              : Colors.gray6
          }
        />
      </Pressable>
      <Modal
        swipeDirection={['down']}
        useNativeDriverForBackdrop
        isVisible={notificationModalVisible}
        backdropColor={Colors.backdropDark}
        onSwipeComplete={dismissModal}
        onBackdropPress={dismissModal}
        onBackButtonPress={dismissModal}
        style={styles.modalBackdrop}>
        <View style={styles.modalControlsContainer}>
          <View style={styles.dragIndicatorContainer}>
            <DragIndicator />
          </View>
          <AppText type="modalTitle" wrapperStyle={styles.modalTitle}>
            {'Получать уведомления'}
          </AppText>
          <NotificationsSwitch
            isLoading={notificationsState.topicProcessing}
            caption={'об акциях'}
            value={currentTopicSwitchValue}
            onPress={onTopicSubscriptionSwitchPress}
          />
          {isAuthorized && (
            <NotificationsSwitch
              isLoading={notificationsState.personalProcessing}
              caption={'о статусах заказов'}
              value={currentPersonalSwitchValue}
              onPress={onPersonalSubscriptionSwitchPress}
            />
          )}
          <Animated.View style={[styles.collapsible, {height: animatedHeight}]}>
            <Animated.View
              onLayout={onCollapsibleNodeLayout}
              style={styles.collapsibleContentContainer}>
              <AppText>
                {
                  'Чтобы подключить Push-уведомления необходимо дать доступ приложению в настройках телефона'
                }
              </AppText>
              <View style={styles.settingsAlertLinksRow}>
                <AppButton
                  type="discard"
                  width="narrow"
                  label="Закрыть"
                  onPress={onDismissSettingsAlertButtonPress}
                />
                <AppButton
                  type="primary"
                  width="narrow"
                  label="В настройки"
                  onPress={onProceedToSettigsButtonPress}
                />
              </View>
            </Animated.View>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  dragIndicatorContainer: {
    position: 'absolute',
    top: SIZE_8,
    alignSelf: 'center',
  },
  modalTitle: {
    marginBottom: SIZE_24,
  },
  modalControlsContainer: {
    width: WINDOW_WIDTH,
    ...padding(SIZE_40, SIZE_16, SIZE_32),
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundColor: Colors.white,
  },
  collapsible: {
    overflow: 'hidden',
  },
  collapsibleContentContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: SIZE_32,
  },
  settingsAlertText: {
    textAlign: 'center',
    marginBottom: SIZE_16,
  },
  settingsAlertLinksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZE_16,
  },
  settingsAlertCloseLink: {
    fontSize: scaleFont(16),
    color: Colors.gray3,
  },
  settingsAlertSettingsLink: {
    fontSize: scaleFont(16),
    color: Colors.black,
    textDecorationLine: 'underline',
  },
});

export default NotificationsControl;
