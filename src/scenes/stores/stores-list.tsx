import React, {FC, useCallback, useMemo, useState} from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';

import {SceneMap} from 'react-native-tab-view';
import type {Route as TabViewRoute} from 'react-native-tab-view';

import type {StoresListScreenProps} from '@navigation/types';

import {Loader, RequestUpdateIndicator} from '@components/atoms';
import {TopTabBar} from '@components/organisms';
import {MapScreen, StoresList} from '@components/templates';

import {getCurrentLocation} from '@utils';
import {useApiCall, useMount} from '@hooks';
import {useThunkDispatch} from '@state/hooks';

import {addDefaultStoreThunk} from '@state/defaultStore';

import {CommonStyles} from '@styles/common';

import type {
  Store,
  Location,
  GetPharmacyListResponse,
  GetPharmacyListRequestParams,
  DefaultStore,
} from '@types';
import {CombinedState, DefaulStoreSliceState} from '@state/types';

export const LIST_TITLES = {
  DEFAULT: 'Ваша аптека',
  FAVORITE: 'Любимые аптеки',
  ALL: 'Все аптеки',
};

const StoresListScreen: FC<StoresListScreenProps> = ({
  route: {
    params: {selectDefaultStore: selectDefaultStoreFlag},
  },
}) => {
  const dispatch = useThunkDispatch();

  //#region DATA

  const {data: dataSource, loadingState} = useApiCall<
    GetPharmacyListRequestParams,
    GetPharmacyListResponse
  >({
    method: 'GET',
    endpoint: 'pharmacy',
  });

  const [selectedStore, setSelectedStore] = useState<Store>();

  const {loading: defaultStoreLoadingState} = useSelector<
    CombinedState,
    {loading: DefaulStoreSliceState['loading']}
  >((state) => ({
    loading: state.defaultStore.loading,
  }));
  //#endregion

  //#region HANDLERS
  const defaultStoreSelect = useCallback(async (store: DefaultStore) => {
    await dispatch(addDefaultStoreThunk(store));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //#endregion

  //#region LOCATION
  const [userLocation, setUserLocation] = useState<Location>();

  useMount(() => {
    (async function () {
      const currentLocation = await getCurrentLocation();
      currentLocation && setUserLocation(currentLocation);
    })();
  });
  //#endregion

  //#region TAB SCREENS
  const renderListRoute = useCallback(
    ({jumpTo}: {jumpTo: (key: string) => void}) => {
      const onItemPress = (store: Store) => {
        setSelectedStore(store);
        jumpTo('map');
      };

      return dataSource ? (
        <StoresList
          dataSource={dataSource}
          onItemPress={(store: Store) => onItemPress(store)}
          userLocation={userLocation}
          defaultStoreSelect={
            selectDefaultStoreFlag ? defaultStoreSelect : undefined
          }
        />
      ) : null; // TODO empty component
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataSource, userLocation],
  );

  const renderMapRoute = useCallback(() => {
    return dataSource ? (
      <MapScreen
        dataSource={dataSource}
        initialStore={selectedStore}
        userLocation={userLocation}
        defaultStoreSelect={
          selectDefaultStoreFlag ? defaultStoreSelect : undefined
        }
      />
    ) : null; //TODO empty component
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSource, selectedStore]);
  //#endregion

  //#region TABBAR
  const renderScene = SceneMap({
    list: renderListRoute,
    map: renderMapRoute,
  });

  const routes = useMemo<TabViewRoute[]>(
    () => [
      {key: 'list', title: 'Списком'},
      {key: 'map', title: 'На карте'},
    ],
    [],
  );
  //#endregion

  //#region LOADING
  if (loadingState === 'loading') {
    return <Loader size="large" />;
  }
  //#endregion

  return (
    <>
      <View style={CommonStyles.fill}>
        <TopTabBar renderScene={renderScene} routes={routes} />
      </View>
      {(loadingState === 'updating' ||
        defaultStoreLoadingState === 'pending') && <RequestUpdateIndicator />}
    </>
  );
};

export default StoresListScreen;
