import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet} from 'react-native';

import {useSelector} from 'react-redux';

import {Transition, Transitioning} from 'react-native-reanimated';
import {FlatList} from 'react-native-gesture-handler';

import type {ProfileFavoriteStoresScreenProps} from '@navigation/types';

import {
  FadeInView,
  SeparatorLine,
  RequestUpdateIndicator,
} from '@components/atoms';
import {FavoriteStoresItem} from '@components/molecules';
import {DynamicListEmptyComponent} from '@components/organisms';
import {DynamicListSkeleton} from '@components/templates';

import type {CombinedState} from '@state/types';

import {useApiCall} from '@hooks';

import {shallowEqual} from '@utils';

import {scale} from '@styles/mixins';
import {CommonStyles} from '@styles/common';
import {SIZE_32, SIZE_48, WINDOW_GUTTER} from '@styles/sizes';

import {Images} from '@assets';

import type {
  Store,
  FavoriteData,
  GetPharmacyListRequestParams,
  GetPharmacyListResponse,
} from '@types';

const transition = (
  <Transition.Sequence>
    <Transition.Out type="fade" interpolation="easeOut" />
    <Transition.Change interpolation="easeInOut" />
    <Transition.In type="fade" interpolation="easeIn" />
  </Transition.Sequence>
);

type SelectedFavoriteStoresData = {
  favoriteStores: FavoriteData;
  favoriteStoresCount: number;
  haveFavoriteStores: boolean;
};

const ProfileFavoriteStoresScreen: FC<ProfileFavoriteStoresScreenProps> = ({
  navigation,
}) => {
  //#region ANIMATION
  const transitionRef = useRef();
  //#endregion

  //#region STORED
  const {favoriteStores: storedFavoriteStores} = useSelector<
    CombinedState,
    SelectedFavoriteStoresData
  >(
    (state) => ({
      favoriteStores: state.favoriteStores.data,
      favoriteStoresCount: state.favoriteStores.data.length,
      haveFavoriteStores: state.favoriteStores.data.length > 0 ? true : false,
    }),
    shallowEqual,
  );
  //#endregion

  //#region DATA
  const [dataSource, setDataSource] = useState<Store[]>([]);
  const {initialized, callTrigger, loadingState} = useApiCall<
    GetPharmacyListRequestParams,
    GetPharmacyListResponse
  >({
    method: 'GET',
    endpoint: 'pharmacy',
    requestParams: {filter: {id: storedFavoriteStores}},
    responseInterceptor: (r) => {
      setDataSource(storedFavoriteStores.length > 0 ? r : []);
      return r;
    },
  });
  //#endregion

  useEffect(
    () => {
      initialized && callTrigger();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [callTrigger, storedFavoriteStores],
  );

  //#endregion

  //#region BINDING
  const onEmptyListButtonPress = useCallback(() => {
    navigation.navigate('StoresStack', {
      screen: 'StoresList',
      params: {selectDefaultStore: false},
    });
  }, [navigation]);
  //#endregion

  if (loadingState === 'loading') {
    return <DynamicListSkeleton height={50} />;
  }

  return (
    <>
      <FadeInView style={CommonStyles.fill}>
        <Transitioning.View //TODO сделай или удали это
          //@ts-ignore
          ref={transitionRef}
          transition={transition}
          style={CommonStyles.fill}>
          <FlatList
            data={dataSource}
            renderItem={({item}) => <FavoriteStoresItem dataSource={item} />}
            keyExtractor={({id}) => id.toString()}
            ItemSeparatorComponent={SeparatorLine}
            ListEmptyComponent={
              <DynamicListEmptyComponent
                title="У вас нет любимых аптек"
                imageSource={Images.emptyFavorite}
                description="У вас нет любимых аптек,
                хотите добавить?"
                buttonLabel="Добавить любимую аптеку"
                onButtonPress={onEmptyListButtonPress}
                containerStyle={styles.listEmptyContainerStyle}
              />
            }
            bounces={dataSource && dataSource.length > 0}
            contentContainerStyle={styles.contentContainer}
          />
        </Transitioning.View>
      </FadeInView>
      {loadingState === 'updating' && <RequestUpdateIndicator />}
    </>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: WINDOW_GUTTER,
    paddingBottom: SIZE_48,
  },
  listEmptyContainerStyle: {
    paddingTop: SIZE_32,
    alignItems: 'center',
  },
  emptyFavImage: {
    marginVertical: SIZE_32,
    width: scale(317),
    height: scale(238),
  },
});

export default ProfileFavoriteStoresScreen;
