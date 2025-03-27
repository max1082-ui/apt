import React, {FC, useRef, useEffect, useState} from 'react';
import {Image, ImageBackground, Platform, StyleSheet, View} from 'react-native';

import Animated, {
  set,
  block,
  useCode,
  useValue,
  Clock,
  EasingNode,
  interpolateNode,
} from 'react-native-reanimated';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import {
  AuthSignInScreen,
  AuthWelcomeScreen,
  AuthVerificationScreen,
} from '@scenes/auth';

import {useNavigationState} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {HeaderRightDismissButton, Icon} from '@components/atoms';

import {runTiming} from '@utils';

import {scale} from '@styles/mixins';
import {Colors} from '@styles/colors';
import {CommonStyles} from '@styles/common';
import {SIZE_40, SIZE_48, WINDOW_HEIGHT, WINDOW_WIDTH} from '@styles/sizes';

import {Images} from '@assets';

import type {AuthStackParamList} from '../types';

const SCREEN_HEIGHT = scale(387);
const IMAGE_HEIGHT = scale(339);
const TRANSITION_DURATION = 400;

const Auth = createStackNavigator<AuthStackParamList>();

export const AuthStack: FC = () => {
  //#region BASE VALUES
  const animatedClock = useRef(new Clock()).current;
  const animatedProgress = useValue<number>(0);
  const animatedValue = useValue(0);
  //#endregion

  //#region STATE
  const [isWelcomeScreen, setIsWelcomeScreen] = useState<boolean>(true);
  const [secondGirlVisible, setSecondGirlVisible] = useState<boolean>(false);

  const currentRoutes = useNavigationState(
    (state) => state.routes[0].state?.routes,
  );
  //#endregion

  //#region TRIGGER
  useEffect(() => {
    if (
      !currentRoutes ||
      currentRoutes[currentRoutes.length - 1].name === 'AuthWelcome'
    ) {
      setIsWelcomeScreen(true);
      setTimeout(() => setSecondGirlVisible(false), TRANSITION_DURATION / 2);
    } else {
      setIsWelcomeScreen(false);
      setTimeout(() => setSecondGirlVisible(true), TRANSITION_DURATION / 2);
    }
  }, [currentRoutes, isWelcomeScreen]);
  //#endregion

  //#region ANIMATION
  useCode(() => {
    return block([
      set(animatedProgress, isWelcomeScreen ? 1 : 0),
      set(
        animatedValue,
        runTiming({
          clock: animatedClock,
          value: animatedValue,
          dest: animatedProgress,
          duration: TRANSITION_DURATION,
          easing: EasingNode.ease,
        }),
      ),
      set(animatedProgress, isWelcomeScreen ? 0 : 1),
    ]);
  }, [isWelcomeScreen]);
  //#endregion

  //#region INTERPOLATION
  const firstGirlOpacity = interpolateNode(animatedValue, {
    inputRange: [0, 0.55, 1],
    outputRange: [0, 0, 1],
  });
  const secondGirlOpacity = interpolateNode(animatedValue, {
    inputRange: [0, 0.45, 1],
    outputRange: [1, 0, 0],
  });
  //#endregion

  return (
    <ImageBackground
      source={Images.authBg}
      resizeMode="cover"
      style={styles.backgroundContainer}>
      {secondGirlVisible ? (
        <Animated.View
          style={[
            WINDOW_HEIGHT - SCREEN_HEIGHT < IMAGE_HEIGHT
              ? styles.girlContainerTopPosition
              : styles.girlContainerBottomPosition,
            {opacity: secondGirlOpacity},
          ]}>
          <Image source={Images.authGirl} style={styles.girlImage} />
        </Animated.View>
      ) : (
        <Animated.View
          style={[
            WINDOW_HEIGHT - SCREEN_HEIGHT < IMAGE_HEIGHT
              ? styles.girlContainerTopPosition
              : styles.girlContainerBottomPosition,
            {opacity: firstGirlOpacity},
          ]}>
          <Image source={Images.welcomeGirl} style={styles.girlImage} />
        </Animated.View>
      )}

      <View style={styles.screenContainer}>
        <Auth.Navigator
          headerMode="screen"
          screenOptions={{
            headerTintColor: Colors.black,
            headerBackTitleVisible: false,
            headerStyle: CommonStyles.defaultHeader,
            headerLeftContainerStyle: CommonStyles.defaultHeaderLeftContainer,
            cardStyle: {
              height: SCREEN_HEIGHT,
              alignSelf: 'flex-end',
              width: '100%',
              backgroundColor: Colors.white,
            },
            headerTitle: () => null,
            headerBackImage: () => (
              <Icon
                name="arrow-left-s-line"
                size={30}
                color={Colors.accent.default}
              />
            ),
          }}>
          <Auth.Screen name="AuthWelcome" component={AuthWelcomeScreen} />
          <Auth.Screen
            name="AuthSignIn"
            initialParams={{
              dismissButtonActionType: 'skip',
              onSuccessNavigationActionType: 'replace',
            }}
            component={AuthSignInScreen}
            options={({
              navigation,
              route: {
                params: {dismissButtonActionType},
              },
            }) => {
              return {
                headerStatusBarHeight: 0,
                headerRightContainerStyle:
                  CommonStyles.defaultHeaderRightContainer,
                headerStyle: [
                  CommonStyles.defaultHeader,
                  {
                    height: scale(50),
                  },
                ],
                headerLeft: () => null,
                headerRight: () => (
                  <HeaderRightDismissButton
                    actionType={dismissButtonActionType}
                    onPress={() => {
                      if (dismissButtonActionType === 'dismiss') {
                        navigation.pop();
                      } else {
                        navigation.replace('AppTabs');
                      }
                    }}
                  />
                ),
              };
            }}
          />
          <Auth.Screen
            name="AuthVerification"
            component={AuthVerificationScreen}
            initialParams={{onSuccessNavigationActionType: 'replace'}}
            options={{
              headerStatusBarHeight: 0,
              headerRightContainerStyle:
                CommonStyles.defaultHeaderRightContainer,
              headerTransparent: true,
              headerStyle: [
                CommonStyles.defaultHeader,
                {
                  height: scale(80),
                },
              ],
            }}
          />
        </Auth.Navigator>
      </View>
      {/* FIXME некорректно работает на андроид (отрабатывает совместно с нативной функцией поднятия компонента, поэтому создается пустое пространство над клавиатурой), на ios появляется warning */}
      {Platform.OS === 'ios' && (
        <KeyboardSpacer topSpacing={-(SIZE_40 + SIZE_48)} /> //TODO проверить topSpacing на других устройствах, подогнать если че
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  girlContainerTopPosition: {
    position: 'absolute',
    top: 0,
  },
  girlContainerBottomPosition: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT - scale(16),
  },
  girlImage: {
    height: IMAGE_HEIGHT,
    width: WINDOW_WIDTH,
    resizeMode: 'contain',
  },
  screenContainer: {
    height: SCREEN_HEIGHT,
  },
});
