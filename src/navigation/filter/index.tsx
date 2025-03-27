import React, {FC} from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import {FilterMainScreen, FilterOptionsScreen} from '@scenes/filter';

import {TABS_STACK_COMMON_SCREEN_OPTIONS} from '@navigation/common';

import type {FilterStackParamList} from '@navigation/types';

import {AppHeaderTitle} from '@components/atoms';

const Filter = createStackNavigator<FilterStackParamList>();

export const FilterStack: FC = () => {
  return (
    <Filter.Navigator
      screenOptions={{
        ...TABS_STACK_COMMON_SCREEN_OPTIONS,
        headerTitleAlign: 'center',
        headerTitle: ({children}) => <AppHeaderTitle title={children} />,
      }}>
      <Filter.Screen
        name="FilterMain"
        component={FilterMainScreen}
        options={{title: 'Фильтры'}}
      />
      <Filter.Screen
        name="FilterOptions"
        component={FilterOptionsScreen}
        options={({route}) => ({title: route.params.dataSource.name})}
      />
    </Filter.Navigator>
  );
};
