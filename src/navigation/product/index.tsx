import React, {FC} from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import {ProductDetailScreen} from '@scenes/product';

import {TABS_STACK_COMMON_SCREEN_OPTIONS} from '@navigation/common';

import type {ProductStackParamList} from '@navigation/types';

const Product = createStackNavigator<ProductStackParamList>();

export const ProductStack: FC = () => {
  return (
    <Product.Navigator
      headerMode="screen"
      screenOptions={{
        ...TABS_STACK_COMMON_SCREEN_OPTIONS,
        headerTitle: () => null,
      }}>
      <Product.Screen name="ProductDetail" component={ProductDetailScreen} />
    </Product.Navigator>
  );
};
