import React, {
  FC,
  useRef,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  View,
  StyleSheet,
  SectionList,
  SectionListRenderItem,
} from 'react-native';

import {useSelector} from 'react-redux';

import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {LIST_TITLES} from '@scenes/stores/stores-list';

import {AppText, Icon, SearchInput} from '@components/atoms';
import {StoresListItem} from '@components/molecules';

import type {
  CombinedState,
  DefaulStoreSliceState,
  FavoriteSliceState,
} from '@state/types';

import {useArraySearch} from '@hooks';

import {Colors} from '@styles/colors';
import {SIZE_16, SIZE_24, SIZE_8, WINDOW_GUTTER} from '@styles/sizes';

import type {Store, Location, StoresSectionList, DefaultStore} from '@types';

interface StoreListProps {
  dataSource: Store[];
  userLocation?: Location;
  onItemPress: (store: Store) => void;
  defaultStoreSelect?: (store: DefaultStore) => void;
  renderListItem?: SectionListRenderItem<Store, StoresSectionList>;
}

const StoresList: FC<StoreListProps> = ({
  dataSource,
  userLocation,
  renderListItem,
  onItemPress,
  defaultStoreSelect,
}) => {
  const {bottom: bottomInset} = useSafeAreaInsets();

  //#region STORED
  const {data: favoriteStores} = useSelector<
    CombinedState,
    {data: FavoriteSliceState['data']}
  >((state) => ({
    data: state.favoriteStores.data,
  }));

  const {data: defaultStoreData} = useSelector<
    CombinedState,
    {data: DefaulStoreSliceState['data']}
  >((state) => ({
    data: state.defaultStore.data,
  }));
  //#endregion

  //#region SEARCH
  const {searchResult, setQuery} = useArraySearch<Store>({
    arr: dataSource,
    searchValueExtractor: (item) => item.address,
  });

  const [internalQuery, setInternalQuery] = useState('');
  const timerRef = useRef<any>();
  const killTimer = useCallback(
    () => timerRef.current && clearTimeout(timerRef.current),
    [],
  );
  useEffect(() => {
    killTimer();
    timerRef.current = setTimeout(() => {
      setQuery(internalQuery);
    }, 300);
    return killTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [internalQuery]);
  const onChangeSearchInput = useCallback((text) => {
    setInternalQuery(text);
  }, []);
  const onSearchInputResetButtonPress = useCallback(() => {
    setInternalQuery('');
  }, []);
  //#endreg

  const sectionsData = useMemo<StoresSectionList[]>(
    () => [
      {
        title: LIST_TITLES.DEFAULT,
        data: searchResult.filter((store) => defaultStoreData?.id === store.id),
      },
      {
        title: LIST_TITLES.FAVORITE,
        data: searchResult.filter((store) =>
          favoriteStores.indexOf(store.id) > -1 &&
          defaultStoreData?.id !== store.id
            ? true
            : false,
        ),
      },
      {
        title: LIST_TITLES.ALL,
        data: searchResult.filter((store) =>
          favoriteStores.indexOf(store.id) === -1 &&
          defaultStoreData?.id !== store.id
            ? true
            : false,
        ),
      },
    ],
    [defaultStoreData?.id, favoriteStores, searchResult],
  );
  //#endregion

  const renderSectionHeader = useCallback(
    ({section: {title, data}}) => (
      <>
        {data.length > 0 ? (
          <View style={styles.sectionHeaderContainer}>
            <Icon
              name={
                title === LIST_TITLES.FAVORITE ? 'heart-3-fill' : 'capsule-fill'
              }
              color={
                title === LIST_TITLES.FAVORITE
                  ? Colors.error.default
                  : Colors.black
              }
              size={20}
            />
            <AppText type="h2" wrapperStyle={styles.headerTextWrapper}>
              {title}
            </AppText>
          </View>
        ) : null}
      </>
    ),
    [],
  );

  const defaultRenderItem = useCallback(
    ({item}: {item: Store}) => (
      <StoresListItem
        dataSource={item}
        onPress={onItemPress}
        userLocation={userLocation}
        onDefaultStoreSelectButtonPress={defaultStoreSelect}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userLocation],
  );

  const internalRenderListItem = renderListItem
    ? renderListItem
    : defaultRenderItem;

  return (
    <View style={styles.container}>
      <View style={styles.searchWrapper}>
        <SearchInput
          //TODO active={isSearchFocused}
          value={internalQuery}
          placeholder="Поиск по адресу"
          onChangeText={onChangeSearchInput}
          onResetButtonPress={onSearchInputResetButtonPress}
        />
      </View>

      <SectionList
        sections={sectionsData}
        keyExtractor={(item: Store) => item.id.toString()}
        renderItem={internalRenderListItem}
        renderSectionHeader={renderSectionHeader}
        scrollIndicatorInsets={{
          bottom: bottomInset,
        }}
        contentContainerStyle={[
          styles.contentContainer,
          {
            paddingBottom: bottomInset + SIZE_24,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: SIZE_8,
  },
  searchWrapper: {
    paddingHorizontal: WINDOW_GUTTER,
    paddingVertical: SIZE_8,
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZE_16,
    backgroundColor: Colors.white,
  },
  contentContainer: {
    paddingHorizontal: WINDOW_GUTTER,
  },
  headerTextWrapper: {
    marginLeft: SIZE_8,
  },
});

export default StoresList;
