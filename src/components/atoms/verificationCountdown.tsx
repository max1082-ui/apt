import React, {FC, useEffect, useRef, useState} from 'react';
import {StyleSheet} from 'react-native';

import Animated, {Clock, useValue} from 'react-native-reanimated';

import AppText from './appText';
import PressableOpacity from './pressableOpacity';

import {runTiming} from '@utils';

import {Colors} from '@styles/colors';

type VerificationCountdownProps = {
  onActiveActionPress: () => void;
  enabled?: boolean;
};

const AVAILABILITY_DELAY_SEC = 59;

/**
 * @param {boolean} enabled - timer will stop if false then restart when change to true
 * @param {Function} onActiveActionPress - handle onPress when link become active
 */
const VerificationCountdown: FC<VerificationCountdownProps> = ({
  onActiveActionPress,
  enabled = true,
}) => {
  //#region TIMER
  const [time, setTime] = useState<number>(AVAILABILITY_DELAY_SEC);
  const [isRunning, setIsRunning] = useState<boolean>(true);

  useEffect(() => {
    setIsRunning(enabled);
  }, [enabled]);

  const timerRef = useRef<any>();
  const killInterval = () => {
    timerRef.current && clearInterval(timerRef.current);
  };

  useEffect(() => {
    killInterval();
    if (isRunning) {
      if (time > 0) {
        timerRef.current = setTimeout(() => {
          setTime((current) => current - 1);
        }, 1000);
      } else {
        setIsRunning(false);
        setTime(AVAILABILITY_DELAY_SEC);
      }
    }
    return () => killInterval();
  }, [isRunning, time]);
  //#endregion

  //#region UNDERLINE ANIMATION
  const [underlineMaxWidth, setUnderlineMaxWidth] = useState<number>(0);
  const animatedClock = useRef(new Clock()).current;
  const animationProgress = useValue<number>(0);
  const animationDest = useValue<number>(0);
  const underlineWidth = useRef(
    runTiming({
      clock: animatedClock,
      value: animationProgress,
      dest: animationDest,
    }),
  ).current;

  useEffect(() => {
    if (isRunning) {
      animationDest.setValue(0);
    } else {
      animationDest.setValue(underlineMaxWidth);
    }
  }, [animationDest, isRunning, underlineMaxWidth]);
  //#endregion

  //#region HANDLERS
  const onPress = () => {
    onActiveActionPress && onActiveActionPress();
    setIsRunning(true);
  };
  //#endregion
  return (
    <>
      <PressableOpacity
        disabled={!enabled || isRunning}
        onPress={onPress}
        style={styles.textWrapper}>
        <AppText
          type="bodyRegular"
          color={Colors.gray6}
          onLayout={({
            nativeEvent: {
              layout: {width},
            },
          }) => setUnderlineMaxWidth(width)}>
          {'Получить новый код'}
        </AppText>
        <AppText type="bodyRegular" color={Colors.gray6}>
          {isRunning
            ? ` можно через 00:${time / 10 >= 1 ? time : '0' + time}`
            : ''}
        </AppText>
      </PressableOpacity>
      <Animated.View style={[styles.underline, {width: underlineWidth}]} />
    </>
  );
};

const styles = StyleSheet.create({
  textWrapper: {
    flexDirection: 'row',
  },
  underline: {
    height: 0.5,
    backgroundColor: Colors.gray4,
  },
});

export default VerificationCountdown;
