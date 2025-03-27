import {useState, useCallback, useRef, useMemo} from 'react';

import {
  set,
  Clock,
  useValue,
  interpolateNode,
  add,
  Extrapolate,
  event,
} from 'react-native-reanimated';
import {State} from 'react-native-gesture-handler';
import type {
  PanGestureHandlerGestureEvent,
  PanGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler';

import {runTiming} from '@utils';

import {SIZE_40, WINDOW_HEIGHT} from '@styles/sizes';

import type {MapModalState, ModalSnaps} from '@types';

const START_MODAL_HEIGHT = WINDOW_HEIGHT;

function useStoresMapModalAnimation(snapPointsFromTop: ModalSnaps) {
  const [modalState, setModalState] = useState<MapModalState>('close');

  const start = useMemo(
    () => (snapPointsFromTop.full ? snapPointsFromTop.full : 0),
    [snapPointsFromTop.full],
  );
  const end = useMemo(() => START_MODAL_HEIGHT, []);

  const [lastSnap, setLastSnap] = useState(0);

  const animatedClock = useRef(new Clock()).current;
  const animatedProgress = useValue<number>(end);
  const animatedDest = useValue<number>(end);
  const translateYOffset = useRef(
    runTiming({
      clock: animatedClock,
      value: animatedProgress,
      dest: animatedDest,
    }),
  ).current;

  const dragY = useValue<number>(0);

  const translateY = interpolateNode(add(translateYOffset, dragY), {
    inputRange: [start, end],
    outputRange: [start, end],
    extrapolate: Extrapolate.CLAMP,
  });

  const onGestureEvent = event<PanGestureHandlerGestureEvent>(
    [
      {
        nativeEvent: {
          translationY: (y) => set(dragY, y),
        },
      },
    ],
    {
      useNativeDriver: true,
    },
  );

  const onHandlerStateChange = useCallback<
    (e: PanGestureHandlerStateChangeEvent) => void
  >(
    ({nativeEvent}) => {
      if (nativeEvent.oldState === State.ACTIVE) {
        let {translationY} = nativeEvent;
        let destSnapPoint = lastSnap;
        switch (modalState) {
          case 'short':
            if (snapPointsFromTop.short) {
              if (translationY > SIZE_40 && snapPointsFromTop.close) {
                destSnapPoint = snapPointsFromTop.close;
                setModalState('close');
              } else if (
                translationY < -SIZE_40 &&
                snapPointsFromTop.full !== undefined
              ) {
                destSnapPoint = snapPointsFromTop.full;
                setModalState('full');
              } else {
                destSnapPoint = snapPointsFromTop.short;
              }
            }
            break;
          case 'full':
            if (snapPointsFromTop.full !== undefined) {
              if (translationY > SIZE_40) {
                if (snapPointsFromTop.short) {
                  destSnapPoint = snapPointsFromTop.short;
                  setModalState('short');
                } else if (snapPointsFromTop.close) {
                  destSnapPoint = snapPointsFromTop.close;
                  setModalState('close');
                }
              } else {
                destSnapPoint = snapPointsFromTop.full;
              }
            }
        }
        setLastSnap(destSnapPoint);

        animatedProgress.setValue(lastSnap + translationY);
        dragY.setValue(0);
        animatedDest.setValue(destSnapPoint);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      lastSnap,
      modalState,
      snapPointsFromTop.close,
      snapPointsFromTop.full,
      snapPointsFromTop.short,
    ],
  );

  const changeModalState = useCallback(
    (state: MapModalState) => {
      if (snapPointsFromTop[state] !== undefined) {
        animatedDest.setValue(snapPointsFromTop[state] as number);
        setModalState(state);
        setLastSnap(snapPointsFromTop[state] as number);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [snapPointsFromTop],
  );

  return {
    modalState,
    translateY,
    onGestureEvent,
    onHandlerStateChange,
    changeModalState,
  };
}

export default useStoresMapModalAnimation;
