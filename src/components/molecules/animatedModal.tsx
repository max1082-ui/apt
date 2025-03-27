import React, {FC, useEffect} from 'react';
import {StyleSheet, LayoutChangeEvent} from 'react-native';

import {
  GestureEvent,
  HandlerStateChangeEvent,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import Animated, {Node} from 'react-native-reanimated';

import {SIZE_16, SIZE_24} from '@styles/sizes';
import {Colors} from '@styles/colors';

import type {MapModalState} from '@types';

interface AnimatedModalProps {
  modalState: MapModalState;
  translateY: Node<number>;
  onListLinkPressTrigger?: number;
  onModalHeightLayout: (e: LayoutChangeEvent) => void;
  onGestureEvent: (event: GestureEvent<PanGestureHandlerEventPayload>) => void;
  onHandlerStateChange: (
    event: HandlerStateChangeEvent<PanGestureHandlerEventPayload>,
  ) => void;
  changeModalState: (state: MapModalState) => void;
}

const AnimatedModal: FC<AnimatedModalProps> = ({
  modalState,
  translateY,
  onListLinkPressTrigger,
  onModalHeightLayout,
  onGestureEvent,
  onHandlerStateChange,
  changeModalState,
  children,
}) => {
  useEffect(() => {
    if (modalState === 'full') {
      changeModalState('short');
    } else if (modalState === 'short') {
      changeModalState('full');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onListLinkPressTrigger]);

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}>
      <Animated.View
        onLayout={onModalHeightLayout}
        style={[
          styles.modal,
          {
            transform: [
              {
                translateY: translateY,
              },
            ],
          },
        ]}>
        {children}
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  modal: {
    width: '100%',
    paddingVertical: SIZE_24,
    backgroundColor: Colors.white,
    borderTopLeftRadius: SIZE_16,
    borderTopRightRadius: SIZE_16,
    position: 'absolute',
    bottom: 0,
  },
});

export default AnimatedModal;
