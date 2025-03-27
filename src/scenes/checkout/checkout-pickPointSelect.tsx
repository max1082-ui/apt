import React, {FC, useCallback, useMemo, useState} from 'react';
import {View} from 'react-native';

import {useSelector} from 'react-redux';

import {Route as TabViewRoute, SceneMap} from 'react-native-tab-view';

import type {CheckoutPickPointSelectScreenProps} from '@navigation/types';

import {Loader} from '@components/atoms';
import {TopTabBar} from '@components/organisms';
import {PickPointList, PickPointMap} from '@components/templates';

import type {CombinedState, CartSliceState} from '@state/types';

import {useApiCall, useMount} from '@hooks';

import {getCurrentLocation} from '@utils';

import {CommonStyles} from '@styles/common';

import type {
  Location,
  PickPoint,
  PickpointResponse,
  PickpointRequestParams,
  OnProceedToCheckoutButtonPressFn,
} from '@types';

//TODO OPTIMIZE
const CheckoutPickPointSelectScreen: FC<CheckoutPickPointSelectScreenProps> = ({
  navigation,
}) => {
  //#region STORE
  const {data: storedCartProducts} = useSelector<CombinedState, CartSliceState>(
    ({cart: {data}}) => ({
      data,
    }),
  );
  //#endregion

  //#region DATA
  const {data: dataSource, loadingState} = useApiCall<
    PickpointRequestParams,
    PickpointResponse
  >({
    method: 'GET',
    endpoint: 'pharmacy/pickpoint',
    requestParams: {cart: storedCartProducts},
    responseInterceptor: (r) => {
      r.forEach((item) =>
        item.productList.sort((a, b) => {
          if (a.available > 0 && b.available > 0) {
            let diffA = a.available - a.quantity;
            let diffB = b.available - b.quantity;
            return diffA === diffB ? 0 : diffA > diffB ? -1 : 1;
          } else {
            return a.available === b.available
              ? 0
              : a.available > b.available
              ? -1
              : 1;
          }
        }),
      );
      return r;
    },
  });

  const [selectedPickPoint, setSelectedPickPoint] = useState<PickPoint>();
  //#endregion

  //#region LOCATION
  const [userLocation, setUserLocation] = useState<Location | undefined>();

  useMount(() => {
    (async function () {
      const currentLocation = await getCurrentLocation();
      currentLocation && setUserLocation(currentLocation);
    })();
  });
  //#endregion

  //#region PROCEED TO CHECKOUT
  const onProceedToCheckoutButtonPress =
    useCallback<OnProceedToCheckoutButtonPressFn>(
      ({id: deliveryId}: PickPoint, deliveryDay) => {
        navigation.push('CheckoutConfirm', {deliveryId, deliveryDay});
      },
      [navigation],
    );
  //#endregion

  //#region TABS
  const ListRoute = useCallback(
    ({jumpTo}: {jumpTo: (key: string) => void}) => {
      const onPickPointListItemShowOnMapButtonPress = (pp: PickPoint) => {
        setSelectedPickPoint(pp);
        jumpTo('map');
      };
      return (
        <PickPointList
          dataSource={dataSource}
          onProceedToCheckoutButtonPress={onProceedToCheckoutButtonPress}
          onShowOnMapButtonPress={onPickPointListItemShowOnMapButtonPress}
          userLocation={userLocation}
        />
      );
    },
    [dataSource, userLocation, onProceedToCheckoutButtonPress],
  );

  const MapRoute = useCallback(() => {
    return dataSource ? (
      <PickPointMap
        dataSource={dataSource}
        initialPickPoint={selectedPickPoint}
        onProceedToCheckoutButtonPress={onProceedToCheckoutButtonPress}
      />
    ) : null; //TODO empty map component
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSource, selectedPickPoint, userLocation]);

  //#endregion

  //#region TABBAR
  const renderScene = SceneMap({
    list: ListRoute,
    map: MapRoute,
  });

  const routes = useMemo<TabViewRoute[]>(
    () => [
      {key: 'list', title: 'Списком'},
      {key: 'map', title: 'На карте'},
    ],
    [],
  );
  //#endregion

  if (loadingState === 'loading') {
    return <Loader size="large" />;
  }

  return (
    <View style={CommonStyles.fill}>
      <TopTabBar renderScene={renderScene} routes={routes} />
    </View>
  );
};

export default CheckoutPickPointSelectScreen;
