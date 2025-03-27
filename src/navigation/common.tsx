import React from 'react';

import {CardStyleInterpolators} from '@react-navigation/stack';

import {Icon} from '@components/atoms';

import {Colors} from '@styles/colors';
import {CommonStyles} from '@styles/common';

export const TABS_STACK_COMMON_SCREEN_OPTIONS = {
  headerBackTitleVisible: false,
  headerTintColor: Colors.accent.default,
  headerStyle: CommonStyles.defaultHeader,

  headerLeftContainerStyle: CommonStyles.defaultHeaderLeftContainer,
  headerBackImage: () => (
    <Icon name="arrow-left-s-line" size={30} color={Colors.accent.default} />
  ),

  cardStyle: CommonStyles.defaultScreenCard,
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
};
