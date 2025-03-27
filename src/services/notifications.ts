/**
 * V1 //FIXME Весь функционал описанный здесь подлежит переработке в будущем, сейчас это по факту - рабочая заглушка
 */
import {Platform} from 'react-native';

import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';

import AsyncStorage from '@react-native-async-storage/async-storage';

import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

const FCM_TOKEN = 'FCM_TOKEN';

const TOPIC_NAME = 'sale';
const TOPIC_STORAGE_NAME = `${TOPIC_NAME.toUpperCase()}_TOPIC_SUBSCRIPTION`;

const PERSONAL_NAME = 'personal';
const PERSONAL_STORAGE_NAME = `${PERSONAL_NAME.toUpperCase()}_NOTIFICATIONS_SUBSCRIPTION`;

const SUBSCRIBED = 'SUBSCRIBED';
const UNSUBSCRIBED = 'UNSUBSCRIBED';

const backgroundMessageHandler = (
  message: FirebaseMessagingTypes.RemoteMessage,
) => {
  return message;
};

const setBackgroundHandler = () => {
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    backgroundMessageHandler(remoteMessage);
  });
};

const requestPermission = async () => {
  const status = await messaging().requestPermission();
  return (
    status === messaging.AuthorizationStatus.AUTHORIZED ||
    status === messaging.AuthorizationStatus.PROVISIONAL
  );
};

const getToken = async () => {
  let fcmToken = await AsyncStorage.getItem(FCM_TOKEN);
  if (fcmToken === null) {
    fcmToken = await messaging().getToken();
    if (fcmToken) {
      await AsyncStorage.setItem(FCM_TOKEN, fcmToken);
    } else {
      return;
    }
  }
  return fcmToken;
};

//#region TOPIC SUBSCRIPTION
/**
 * Check topic subscription
 */
const checkTopicSubscriptionStatus = async () => {
  const status = await AsyncStorage.getItem(TOPIC_STORAGE_NAME);
  if (status === null) {
    await subscribeTopic();
    return true;
  } else {
    return status === SUBSCRIBED;
  }
};
/**
 * Subscribe device to sale topic
 */
const subscribeTopic = async () => {
  await messaging().subscribeToTopic(TOPIC_NAME);
  await AsyncStorage.setItem(TOPIC_STORAGE_NAME, SUBSCRIBED);
};
/**
 * Unsubscribe from sale topic
 */
const unsubscribeTopic = async () => {
  await messaging().unsubscribeFromTopic(TOPIC_NAME);
  await AsyncStorage.setItem(TOPIC_STORAGE_NAME, UNSUBSCRIBED);
};
//#endregion

//#region PERSONAL SUBSCRIPTION
const checkPersonalSubscriptionStatus = async (): Promise<boolean | null> => {
  const status = await AsyncStorage.getItem(PERSONAL_STORAGE_NAME);
  return status === null ? status : status === SUBSCRIBED;
};
const setPersonalSubscriptionStatus = async (
  subscribed: boolean,
): Promise<void> => {
  await AsyncStorage.setItem(
    PERSONAL_STORAGE_NAME,
    subscribed ? SUBSCRIBED : UNSUBSCRIBED,
  );
};
//#endregion

const clearBadges = Platform.select({
  ios: () => {
    PushNotificationIOS.setApplicationIconBadgeNumber(0);
  },
  android: () => {
    PushNotification.cancelAllLocalNotifications();
  },
  default: () => {},
});

export default {
  requestPermission,
  getToken,
  setBackgroundHandler,
  clearBadges,
  checkTopicSubscriptionStatus,
  subscribeTopic,
  unsubscribeTopic,
  checkPersonalSubscriptionStatus,
  setPersonalSubscriptionStatus,
  TOPIC_STORAGE_NAME,
  SUBSCRIBED,
  UNSUBSCRIBED,
};
