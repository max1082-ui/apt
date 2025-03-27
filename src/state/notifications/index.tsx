import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';

import ApiService from '@services/api';
import Notifications from '@services/notifications';
import {DEFAULT_UNEXPECTED_ERROR_TEXT} from '@services/error';

import type {
  NotificationsSliceState,
  CheckNotificationsPermissionThunkArg,
  CheckNotificationsPermissionThunkConfig,
  CheckNotificationsPermissionThunkReturn,
  ToggleTopicNotificationsSubscriptionThunkArg,
  ToggleTopicNotificationsSubscriptionThunkConfig,
  ToggleTopicNotificationsSubscriptionThunkReturn,
} from '../types';

import type {
  NotificationsFcmTokenResponse,
  NotificationsFcmTokenRequestParams,
} from '@types';

export const checkNotificationsPermissionThunk = createAsyncThunk<
  CheckNotificationsPermissionThunkReturn,
  CheckNotificationsPermissionThunkArg,
  CheckNotificationsPermissionThunkConfig
>('notifications/checkPermission', async (_, {getState}) => {
  try {
    const permissionGranted = await Notifications.requestPermission();
    const {
      user: {isAuthorized},
    } = getState();
    let result = {
      permissionGranted,
    };
    if (permissionGranted) {
      const fcmToken = await Notifications.getToken();
      const topicSubscribed =
        await Notifications.checkTopicSubscriptionStatus();
      Object.assign(result, {fcmToken, topicSubscribed});
      if (isAuthorized) {
        const personalSubscribed =
          await Notifications.checkPersonalSubscriptionStatus();
        if (personalSubscribed === null) {
          //---- once per installation ----
          const ApiRequest = new ApiService<
            NotificationsFcmTokenRequestParams,
            NotificationsFcmTokenResponse
          >('POST', 'user/notifications/subscription', {fcmToken});

          const response = await ApiRequest.call();
          if (response?.subscribed) {
            Object.assign(result, {personalSubscribed: response.subscribed});
            await Notifications.setPersonalSubscriptionStatus(
              response.subscribed,
            );
          }
          //---- once per installation ----
        } else {
          Object.assign(result, {personalSubscribed});
        }
      }
    }
    return result;
  } catch (err) {
    const {notifications: currentState} = getState();
    return currentState;
  }
});

//#region TOGGLE

export const toggleTopicNotificationsSubscriptionThunk = createAsyncThunk<
  ToggleTopicNotificationsSubscriptionThunkReturn,
  ToggleTopicNotificationsSubscriptionThunkArg,
  ToggleTopicNotificationsSubscriptionThunkConfig
>('notifications/toggleTopicSubscription', async (_, {getState}) => {
  const {
    notifications: {topicSubscribed},
  } = getState();
  let nextTopicSubscribed: boolean;
  if (topicSubscribed) {
    await Notifications.unsubscribeTopic();
    nextTopicSubscribed = false;
  } else {
    await Notifications.subscribeTopic();
    nextTopicSubscribed = true;
  }
  return nextTopicSubscribed;
});

export const togglePersonalNotificationsSubscriptionThunk = createAsyncThunk<
  ToggleTopicNotificationsSubscriptionThunkReturn,
  ToggleTopicNotificationsSubscriptionThunkArg,
  ToggleTopicNotificationsSubscriptionThunkConfig
>('notifications/togglePersonalSubscription', async (_, {getState}) => {
  try {
    const {
      notifications: {personalSubscribed, fcmToken},
    } = getState();
    let requestParams: NotificationsFcmTokenRequestParams = {};
    !personalSubscribed && Object.assign(requestParams, {fcmToken});
    const ApiRequest = new ApiService<
      NotificationsFcmTokenRequestParams,
      NotificationsFcmTokenResponse
    >('POST', 'user/notifications/subscription', requestParams);

    const response = await ApiRequest.call();
    if (response?.hasOwnProperty('subscribed')) {
      await Notifications.setPersonalSubscriptionStatus(response.subscribed);
      return response.subscribed;
    } else {
      throw new Error(DEFAULT_UNEXPECTED_ERROR_TEXT);
    }
  } catch (err) {
    throw err;
  }
});
//#endregion
const initialState: NotificationsSliceState = {
  permissionGranted: false,

  topicProcessing: false,
  personalProcessing: false,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //#region NOTIFICATIONS
    builder.addCase(
      checkNotificationsPermissionThunk.fulfilled,
      (state, {payload}) => {
        const {
          fcmToken,
          topicSubscribed,
          permissionGranted,
          personalSubscribed,
        } = payload;

        state.permissionGranted = permissionGranted;
        state.fcmToken = fcmToken;
        state.topicSubscribed = topicSubscribed;
        state.personalSubscribed = personalSubscribed;
      },
    );
    //#endregion
    //#region TOPIC
    builder.addCase(
      toggleTopicNotificationsSubscriptionThunk.pending,
      (state) => {
        state.topicProcessing = true;
      },
    );
    builder.addCase(
      toggleTopicNotificationsSubscriptionThunk.fulfilled,
      (state, {payload}) => {
        state.topicProcessing = false;
        state.topicSubscribed = payload;
      },
    );
    builder.addCase(
      toggleTopicNotificationsSubscriptionThunk.rejected,
      (state) => {
        state.topicProcessing = false;
      },
    );
    //#endregion
    //#region PERSONAL
    builder.addCase(
      togglePersonalNotificationsSubscriptionThunk.pending,
      (state) => {
        state.personalProcessing = true;
      },
    );
    builder.addCase(
      togglePersonalNotificationsSubscriptionThunk.fulfilled,
      (state, {payload}) => {
        state.personalProcessing = false;
        state.personalSubscribed = payload;
      },
    );
    builder.addCase(
      togglePersonalNotificationsSubscriptionThunk.rejected,
      (state) => {
        state.personalProcessing = false;
      },
    );
    //#endregion
  },
});

export default notificationsSlice.reducer;
