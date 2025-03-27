import React, {FC, useMemo} from 'react';

import {useSelector} from 'react-redux';

import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';

import {AppTabs} from './tabs';
import {AuthStack} from './auth';
import {SortStack} from './sort';
import {FilterStack} from './filter';
import {StoresStack} from './stores';
import {ProductStack} from './product';
import {CheckoutStack} from './checkout';
import {PolicyScreen} from '@scenes/root';

import type {RootStackParamList} from './types';

import type {CombinedState} from '@state/types';

import {CommonStyles} from '@styles/common';

const Root = createStackNavigator<RootStackParamList>();

export const RootStack: FC = () => {
  //#region INITIAL ROUTE
  const {authPassed} = useSelector<CombinedState, {authPassed: boolean}>(
    (state) => ({
      authPassed: state.user.authPassed ? true : false,
    }),
  );

  const initialRoute = useMemo(
    () => (!authPassed ? 'AuthStack' : 'AppTabs'),
    [authPassed],
  );
  //#endregion
  return (
    <Root.Navigator
      key="AppRootStackNavigator"
      headerMode="none"
      detachInactiveScreens={true}
      initialRouteName={initialRoute}
      screenOptions={{
        cardStyle: {...CommonStyles.defaultScreenCard, shadowRadius: 0},
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}>
      <Root.Screen
        name="AuthStack"
        component={AuthStack}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        }}
      />
      <Root.Screen name="AppTabs" component={AppTabs} />

      <Root.Screen name="StoresStack" component={StoresStack} />

      <Root.Screen name="ProductStack" component={ProductStack} />

      <Root.Screen name="FilterStack" component={FilterStack} />
      <Root.Screen name="SortStack" component={SortStack} />

      <Root.Screen name="CheckoutStack" component={CheckoutStack} />

      <Root.Screen name="PolicyScreen" component={PolicyScreen} />
    </Root.Navigator>
  );
};
