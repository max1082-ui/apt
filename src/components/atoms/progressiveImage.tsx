import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import Animated, {useValue, Clock, EasingNode} from 'react-native-reanimated';

import {StyleSheet, View} from 'react-native';

import type {ImageProps} from 'react-native';

import Loader from './loader';

import {runTiming} from '@utils';

import {Colors} from '@styles/colors';

interface ProgressiveImageProps extends ImageProps {
  delay?: number;
}

const ProgressiveImage: FC<ProgressiveImageProps> = ({
  style,
  delay = 0,
  ...passThroughProps
}) => {
  //#region ANIMATION
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const clock = useRef(new Clock()).current;
  const progress = useValue<number>(0);
  const opacity = useValue<number>(0);
  const animatedOpacity = useRef(
    runTiming({
      clock,
      value: progress,
      dest: opacity,
      duration: 200,
      easing: EasingNode.ease,
    }),
  ).current;
  //#endregion

  //#region BINDING
  const onImageLoaded = useCallback(
    () => {
      setTimeout(() => {
        setIsLoaded(true);
      }, delay);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [opacity],
  );
  //#endregion

  //#region EFFECT
  useEffect(() => {
    isLoaded && opacity.setValue(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);
  //#endregion

  return (
    <View>
      <Animated.Image
        onLoad={onImageLoaded}
        style={[style, {opacity: animatedOpacity}]}
        {...passThroughProps}
      />
      {!isLoaded && (
        <View style={StyleSheet.absoluteFillObject}>
          <Loader color={Colors.gray4} />
        </View>
      )}
    </View>
  );
};

export default ProgressiveImage;
