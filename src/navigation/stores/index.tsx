import React, {FC} from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import {StoresListScreen} from '@scenes/stores';

import {TABS_STACK_COMMON_SCREEN_OPTIONS} from '@navigation/common';

import type {StoresStackParamList} from '@navigation/types';

import {AppHeaderTitle} from '@components/atoms';

const Stores = createStackNavigator<StoresStackParamList>();

export const StoresStack: FC = () => {
  return (
    <Stores.Navigator
      screenOptions={{
        ...TABS_STACK_COMMON_SCREEN_OPTIONS,
        headerTitleAlign: 'center',
        headerTitle: ({children}) => <AppHeaderTitle title={children} />,
      }}>
      <Stores.Screen
        name="StoresList"
        component={StoresListScreen}
        options={{title: 'Аптеки'}}
      />
    </Stores.Navigator>
  );
};
