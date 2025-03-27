import React, {FC} from 'react';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';

import Tabs from '@scenes/tabs';

import {TABS_STACK_COMMON_SCREEN_OPTIONS} from '@navigation/common';

import type {
  AppTabsParamList,
  HomeStackParamList,
  SearchStackParamList,
  CartStackParamList,
  FavoriteStackParamList,
  ProfileStackParamList,
} from '../types';

import {
  TabBarIcon,
  AppHeaderTitle,
  CartStackBadgeQuantity,
} from '@components/atoms';
import {NotificationsControl} from '@components/organisms';

import {DEFAULT_SORT_ID} from '@services/sort';

import {Colors} from '@styles/colors';
import {scaleFont} from '@styles/mixins';
import {CommonStyles} from '@styles/common';
import {AppTextStyles, Fonts} from '@styles/typography';

//#region HOME
const Home = createStackNavigator<HomeStackParamList>();
const HomeStack: FC = () => {
  return (
    <Home.Navigator
      headerMode="screen"
      screenOptions={{
        ...TABS_STACK_COMMON_SCREEN_OPTIONS,
        headerTitleAlign: 'center',
        headerTitle: ({children}) => <AppHeaderTitle title={children} />,
      }}>
      <Home.Screen
        name="HomeMain"
        component={Tabs.Home.HomeMainScreen}
        options={{
          headerShown: false,
        }}
      />
      <Home.Screen
        name="HomeBannerDetail"
        component={Tabs.Home.HomeBannerDetailScreen}
        options={{
          title: 'Деталка баннера',
        }}
      />
      <Home.Screen
        name="CatalogSectionList"
        component={Tabs.Catalog.CatalogSectionList}
        options={({
          route: {
            params: {title},
          },
        }) => ({
          title,
        })}
      />
      <Home.Screen
        name="ProductList"
        component={Tabs.Product.ProductListScreen}
        initialParams={{sortId: DEFAULT_SORT_ID}} //TODO this is default. remove defaults in navigation.navigate's
        options={({
          route: {
            params: {title},
          },
        }) => ({
          title,
        })}
      />
    </Home.Navigator>
  );
};
//#endregion

//#region CATALOG
const Search = createStackNavigator<SearchStackParamList>();
const SearchStack: FC = () => {
  return (
    <Search.Navigator
      headerMode="screen"
      screenOptions={{
        ...TABS_STACK_COMMON_SCREEN_OPTIONS,
        headerTitleAlign: 'center',
        headerTitle: ({children}) => <AppHeaderTitle title={children} />,
      }}>
      <Search.Screen
        name="SearchMain"
        component={Tabs.Search.SearchMainScreen}
        options={{
          title: 'Поиск',
        }}
      />
      <Search.Screen
        name="ProductList"
        component={Tabs.Product.ProductListScreen}
        initialParams={{sortId: DEFAULT_SORT_ID}}
        options={({
          route: {
            params: {title},
          },
        }) => ({
          title,
        })}
      />
    </Search.Navigator>
  );
};
//#endregion

//#region CART
const Cart = createStackNavigator<CartStackParamList>();
const CartStack: FC = () => {
  return (
    <Cart.Navigator
      // mode="modal"
      screenOptions={{
        ...TABS_STACK_COMMON_SCREEN_OPTIONS,
        headerRightContainerStyle: CommonStyles.defaultHeaderRightContainer,
      }}>
      <Cart.Screen
        name="CartMain"
        options={{
          title: 'Корзина',
          headerTitleAlign: 'left',
          headerTitle: ({children}) => (
            <AppHeaderTitle title={children} fullWidth />
          ),
        }}
        component={Tabs.Cart.CartMainScreen}
      />
    </Cart.Navigator>
  );
};
//#endregion

//#region FAVORITE
const Favorite = createStackNavigator<FavoriteStackParamList>();
const FavoriteStack: FC = () => {
  return (
    <Favorite.Navigator
      headerMode="screen"
      screenOptions={{
        ...TABS_STACK_COMMON_SCREEN_OPTIONS,
        headerTitleAlign: 'center',
        headerTitle: ({children}) => <AppHeaderTitle title={children} />,
      }}>
      <Favorite.Screen
        name="FavoriteMain"
        component={Tabs.Favorite.FavoriteMainScreen}
        options={{
          title: 'Избранное',
        }}
      />
    </Favorite.Navigator>
  );
};
//#endregion

//#region PROFILE
const Profile = createStackNavigator<ProfileStackParamList>();
const ProfileStack: FC = () => {
  return (
    <Profile.Navigator
      screenOptions={{
        ...TABS_STACK_COMMON_SCREEN_OPTIONS,
        headerRightContainerStyle: CommonStyles.defaultHeaderRightContainer,
        headerTitleAlign: 'center',
        headerTitle: ({children}) => <AppHeaderTitle title={children} />,
      }}>
      <Profile.Screen
        name="ProfileMain"
        component={Tabs.Profile.ProfileMainScreen}
        options={{
          title: 'Профиль',
          headerLeft: () => <NotificationsControl />,
        }}
      />
      <Profile.Screen
        name="ProfilePersonalData"
        component={Tabs.Profile.ProfilePersonalDataScreen}
        options={{
          title: 'Мои данные',
        }}
      />
      <Profile.Screen
        name="ProfileOrderList"
        component={Tabs.Profile.ProfileOrderListScreen}
        options={{
          title: 'Мои заказы',
        }}
      />
      <Profile.Screen
        name="ProfileOrderDetail"
        component={Tabs.Profile.ProfileOrderDetailScreen}
        options={{title: undefined}}
      />
      <Profile.Screen
        name="ProfileFavoriteStores"
        component={Tabs.Profile.ProfileFavoriteStoresScreen}
        options={{
          title: 'Любимые аптеки',
        }}
      />
      <Profile.Screen
        name="ProfileReviewAdd"
        component={Tabs.Profile.ProfileReviewAddScreen}
        options={{
          title: 'Добавить отзыв',
        }}
      />
      <Profile.Screen
        name="ProfileHelp"
        component={Tabs.Profile.ProfileHelpScreen}
        options={{
          title: 'Нужна помощь?',
        }}
      />
    </Profile.Navigator>
  );
};
//#endregion

//#region APP_TABS
const App = createBottomTabNavigator<AppTabsParamList>();
export const AppTabs: FC = () => {
  return (
    <App.Navigator
      tabBarOptions={{
        showLabel: true,
        activeTintColor: Colors.accent.default,
        inactiveTintColor: Colors.gray6,
        labelStyle: AppTextStyles.tabBarLabel,
      }}>
      <App.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          tabBarLabel: 'Главная',
          tabBarIcon: ({color}) => (
            <TabBarIcon color={color} name="home-line" />
          ),
        }}
      />
      <App.Screen
        name="SearchStack"
        component={SearchStack}
        options={{
          tabBarLabel: 'Поиск',
          tabBarIcon: ({color}) => (
            <TabBarIcon color={color} name="search-line" />
          ),
        }}
      />
      <App.Screen
        name="CartStack"
        component={CartStack}
        options={{
          tabBarBadge: CartStackBadgeQuantity(),
          tabBarBadgeStyle: {
            ...Fonts.semiBold,
            fontSize: scaleFont(12),
            color: Colors.white,
            backgroundColor: Colors.accent.pressed,
            textAlign: 'center',
            textAlignVertical: 'center',
          },
          tabBarLabel: 'Корзина',
          tabBarIcon: ({color}) => (
            <TabBarIcon color={color} name="shopping-basket-2-line" />
          ),
        }}
      />
      <App.Screen
        name="FavoriteStack"
        component={FavoriteStack}
        options={{
          tabBarLabel: 'Избранное',
          tabBarIcon: ({color}) => (
            <TabBarIcon color={color} name="heart-3-line" />
          ),
        }}
      />
      <App.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={{
          tabBarLabel: 'Профиль',
          tabBarIcon: ({color}) => (
            <TabBarIcon color={color} name="user-line" />
          ),
        }}
      />
    </App.Navigator>
  );
};
//#endregion
