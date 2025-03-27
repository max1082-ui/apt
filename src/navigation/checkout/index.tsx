import React, {FC} from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import {
  CheckoutFinalScreen,
  CheckoutConfirmScreen,
  CheckoutPickPointSelectScreen,
} from '@scenes/checkout';

import {TABS_STACK_COMMON_SCREEN_OPTIONS} from '@navigation/common';

import type {CheckoutStackParamList} from '@navigation/types';

import {AppHeaderTitle} from '@components/atoms';

const Checkout = createStackNavigator<CheckoutStackParamList>();

export const CheckoutStack: FC = () => {
  return (
    <Checkout.Navigator
      screenOptions={{
        ...TABS_STACK_COMMON_SCREEN_OPTIONS,
        headerTitleAlign: 'center',
        headerTitle: ({children}) => <AppHeaderTitle title={children} />,
      }}>
      <Checkout.Screen
        name="CheckoutPickPointSelect"
        component={CheckoutPickPointSelectScreen}
        options={{title: 'Выбор аптеки'}}
      />
      <Checkout.Screen
        name="CheckoutConfirm"
        component={CheckoutConfirmScreen}
        options={{title: 'Оформление заказа'}}
      />
      <Checkout.Screen
        name="CheckoutFinal"
        component={CheckoutFinalScreen}
        options={{title: 'Заказ успешно оформлен'}}
      />
    </Checkout.Navigator>
  );
};
