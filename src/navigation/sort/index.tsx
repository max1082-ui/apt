import React, {FC} from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {TABS_STACK_COMMON_SCREEN_OPTIONS} from '@navigation/common';

import type {SortStackParamList} from '@navigation/types';

import {SortMainScreen} from '@scenes/sort';

import {AppHeaderTitle} from '@components/atoms';

const Sort = createStackNavigator<SortStackParamList>();

export const SortStack: FC = () => {
  return (
    <Sort.Navigator
      screenOptions={{
        ...TABS_STACK_COMMON_SCREEN_OPTIONS,
        headerTitleAlign: 'center',
        headerTitle: ({children}) => <AppHeaderTitle title={children} />,
      }}>
      <Sort.Screen
        name="SortMain"
        component={SortMainScreen}
        options={{title: 'Сортировка'}}
      />
    </Sort.Navigator>
  );
};
