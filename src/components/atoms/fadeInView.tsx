import React, {FC, useRef} from 'react';
import {ViewProps} from 'react-native';
import Animated, {Clock, useValue} from 'react-native-reanimated';

import {useMount} from '@hooks';
import {runTiming} from '@utils';

export interface FadeInViewProps extends ViewProps {
  duration?: number;
  delay?: number;
}

const FadeInView: FC<FadeInViewProps> = ({
  duration = 150,
  delay = 0,
  style,
  ...passThroughProps
}) => {
  //#region ANIMATION
  const clock = useRef(new Clock()).current;
  const value = useValue<number>(0);
  const dest = useValue<number>(0);
  const animatedOpacity = useRef(
    runTiming({clock, value, dest, duration}),
  ).current;

  const timerRef = useRef<any>();
  const killTimer = () => timerRef.current && clearTimeout(timerRef.current);

  useMount(() => {
    timerRef.current = setTimeout(() => {
      dest.setValue(1);
    }, delay);
    return killTimer;
  });
  //#endregion

  return (
    <Animated.View
      {...passThroughProps}
      style={[style, {opacity: animatedOpacity}]}
    />
  );
};

export default FadeInView;
