/**
 * V2 //TODO Протестировать, должно все работать отлично (инициализация без анимирования)
 */
import {useState, useCallback, useRef} from 'react';

import type {LayoutChangeEvent} from 'react-native';

import {
  eq,
  neq,
  set,
  cond,
  block,
  Clock,
  Value,
  useCode,
  useValue,
} from 'react-native-reanimated';

import {runTiming} from '@utils';

import type {CollapsibleConfig, CollapsibleState} from './types';

function useCollapsible(config?: CollapsibleConfig) {
  const [height, setHeight] = useState(0);
  const [state, setState] = useState<CollapsibleState>(
    config?.defaultState || 'collapsed',
  );

  const initialized = useValue(0);
  const clock = useRef(new Clock()).current;
  const dest = useValue<number>(0);
  const animatedHeight = useRef(new Value(0)).current;

  useCode(() => {
    const isOpening = new Value(state === 'expanded' ? 1 : 0);
    return block([
      cond(eq(isOpening, 1), set(dest, height), set(dest, 0)),
      cond(
        eq(initialized, 0),
        block([
          cond(neq(dest, animatedHeight), set(animatedHeight, dest)),
          set(initialized, 1),
        ]),
        cond(
          neq(dest, animatedHeight),
          runTiming({
            clock,
            value: animatedHeight,
            dest,
            duration: config?.duration,
            easing: config?.easing,
          }),
        ),
      ),
    ]);
  }, [state, height]);

  const onCollapsibleTriggerFire = useCallback(() => {
    setState((prev) => (prev === 'collapsed' ? 'expanded' : 'collapsed'));
  }, []);

  const collapseNode = useCallback(() => {
    state === 'expanded' && setState('collapsed');
  }, [state]);

  const expandNode = useCallback(() => {
    state === 'collapsed' && setState('expanded');
  }, [state]);

  const onCollapsibleNodeLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const measuredHeight = event.nativeEvent.layout.height;
      if (height !== measuredHeight) {
        setHeight(measuredHeight);
      }
    },
    [height],
  );

  return {
    onCollapsibleNodeLayout,
    onCollapsibleTriggerFire,
    collapseNode,
    expandNode,
    progress: animatedHeight,
    animatedHeight,
    height,
    state,
  };
}

export default useCollapsible;

/**
 * V1 deprecated //Осталось в качестве быстрого фолбэка
 */
// import {useState, useCallback, useRef, useEffect} from 'react';
// import type {LayoutChangeEvent} from 'react-native';

// import {Clock, useValue} from 'react-native-reanimated';

// import {runTiming} from '@utils';

// import type {CollapsibleConfig, CollapsibleState} from './types';

// function useCollapsible(config?: CollapsibleConfig) {
//   const [height, setHeight] = useState(0);
//   const [state, setState] = useState<CollapsibleState>(
//     config?.defaultState || 'collapsed',
//   );

//   const clock = useRef(new Clock()).current;
//   const progress = useValue<number>(0);
//   const animation = useValue<number>(0);
//   const animatedHeight = useRef(
//     runTiming(clock, progress, animation, config?.duration, config?.easing),
//   ).current;

//   useEffect(() => {
//     if (state === 'collapsed') {
//       animation.setValue(0);
//     } else {
//       animation.setValue(height);
//     }
//   }, [state, height, animation]);

//   const onCollapsibleTriggerFire = useCallback(() => {
//     setState((prev) => (prev === 'collapsed' ? 'expanded' : 'collapsed'));
//   }, []);

//   const collapseNode = useCallback(() => {
//     state === 'expanded' && setState('collapsed');
//   }, [state]);

//   const expandNode = useCallback(() => {
//     state === 'collapsed' && setState('expanded');
//   }, [state]);

//   const onCollapsibleNodeLayout = useCallback(
//     (event: LayoutChangeEvent) => {
//       const measuredHeight = event.nativeEvent.layout.height;
//       if (height !== measuredHeight) {
//         setHeight(measuredHeight);
//       }
//     },
//     [height],
//   );

//   return {
//     onCollapsibleNodeLayout,
//     onCollapsibleTriggerFire,
//     collapseNode,
//     expandNode,
//     progress,
//     animatedHeight,
//     height,
//     state,
//   };
// }

// export default useCollapsible;
