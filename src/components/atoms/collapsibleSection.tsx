import React, {FC, ReactNode} from 'react';
import {StyleSheet, View} from 'react-native';
import Animated, {
  concat,
  EasingNode,
  interpolateNode,
} from 'react-native-reanimated';

import type {StyleProp, ViewStyle} from 'react-native';

import Icon from './icon';
import AppText from './appText';
import PressableOpacity from './pressableOpacity';

import {useCollapsible} from '@hooks';

import {Colors} from '@styles/colors';
import {SIZE_16} from '@styles/sizes';
import {scale} from '@styles/mixins';

interface CollapsibleSectionProps {
  title: string;
  InnerComponent: ReactNode;
  disabled?: boolean;
  expanded?: boolean;
  duration?: number;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

const CollapsibleSection: FC<CollapsibleSectionProps> = ({
  title,
  InnerComponent,
  expanded,
  contentContainerStyle,
  disabled = false,
  duration = 400,
}) => {
  //#region ANIMATION
  const {
    onCollapsibleNodeLayout,
    onCollapsibleTriggerFire,
    animatedHeight,
    height,
    progress,
  } = useCollapsible({
    duration,
    easing: EasingNode.ease,
    defaultState: expanded ? 'expanded' : 'collapsed',
  });

  const rotateY = interpolateNode(progress, {
    inputRange: [0, height],
    outputRange: [0, 180],
  });
  //#endregion
  return (
    <View style={styles.wrapper}>
      <PressableOpacity
        disabled={disabled}
        onPress={onCollapsibleTriggerFire}
        style={styles.titleWrapper}>
        <AppText type="bodyBold" color={Colors.gray5} numberOfLines={1}>
          {title}
        </AppText>
        <Animated.View style={{transform: [{rotateZ: concat(rotateY, 'deg')}]}}>
          <Icon
            name="arrow-down-s-line"
            size={24}
            color={Colors.accent.default}
          />
        </Animated.View>
      </PressableOpacity>
      <Animated.View style={[styles.collapsible, {height: animatedHeight}]}>
        <Animated.View
          onLayout={onCollapsibleNodeLayout}
          style={[styles.contentContainer, contentContainerStyle]}>
          {InnerComponent}
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: SIZE_16,
  },
  titleWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: scale(24),
  },
  collapsible: {
    overflow: 'hidden',
  },
  contentContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: scale(9),
  },
});

export default CollapsibleSection;
