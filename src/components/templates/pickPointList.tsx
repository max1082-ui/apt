import React, {
  FC,
  memo,
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

import {
  Icon,
  Loader,
  AppText,
  SearchInput,
  // PickPointListDateFilter,
} from '@components/atoms';
import {PickPointListItem} from '@components/molecules';

import {useArraySearch} from '@hooks';

import {
  SIZE_8,
  SIZE_16,
  SIZE_24,
  SIZE_32,
  SIZE_48,
  WINDOW_GUTTER,
} from '@styles/sizes';
import {Colors} from '@styles/colors';

import type {
  Location,
  PickPoint,
  PickPointSectionListDate,
  PickPointSectionListItem,
  PickPointSectionListDataSource,
  OnProceedToCheckoutButtonPressFn,
} from '@types';
import {CombinedState, DefaulStoreSliceState} from '@state/types';

const LIST_TITLES = {
  DEFAULT: 'Ваша аптека',
  FAVORITE: 'Любимые аптеки',
  ALL_IN_STOCK: 'Есть все',
  PART_IN_STOCK: 'Есть частично',
  TAKE_TOMORROW: 'Забрать все завтра',
};

const AVAILABILITY_DAY = {
  today: 'сегодня',
  tomorrow: 'завтра',
};

interface PickPointListProps {
  dataSource?: PickPoint[];
  userLocation?: Location;
  onShowOnMapButtonPress: (item: PickPoint) => void;
  onProceedToCheckoutButtonPress: OnProceedToCheckoutButtonPressFn;
}

type PickPointSectionListBase = Partial<
  {[K in keyof typeof LIST_TITLES]: PickPointSectionListItem}
>;

const PickPointList: FC<PickPointListProps> = ({
  userLocation,
  onShowOnMapButtonPress,
  onProceedToCheckoutButtonPress,
  dataSource = [],
}) => {
  const {bottom: bottomInset} = useSafeAreaInsets();

  //#region FILTER STATE
  const [
    activeDateFilter,
    //  setActiveDateFilter
  ] = useState<PickPointSectionListDate>('today');

  // const onPickPointListDateFilterItemPress = useCallback(() => {
  //   setActiveDateFilter((current) =>
  //     current === 'today' ? 'tomorrow' : 'today',
  //   );
  // }, []);
  //#endregion

  //#region DEFAULT STORE STATE
  const {data: defaultStoreData} = useSelector<
    CombinedState,
    {data: DefaulStoreSliceState['data']}
  >((state) => ({
    data: state.defaultStore.data,
  }));
  //#endregion

  //#region SECTIONS
  //#region SEARCH
  const {
    searchResult,
    setQuery,
    query: searchQuery,
  } = useArraySearch({
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
  //#endregion

  const [sectionsInitialized, setSectionsInitialized] =
    useState<boolean>(false);

  const sectionsData = useMemo<PickPointSectionListDataSource>(() => {
    if (searchResult.length > 0) {
      let sectionsDataSource: PickPointSectionListBase = {};
      for (let i = 0; i < searchResult.length; i++) {
        if (
          //FIXME -------------TEST--------------
          typeof searchResult[i].timeUntilClosing === 'number' &&
          searchResult[i].timeUntilClosing === 0
          //FIXME -------------TEST--------------
        ) {
          continue;
        }
        if (defaultStoreData && defaultStoreData.id === searchResult[i].id) {
          if (!sectionsDataSource.DEFAULT) {
            sectionsDataSource.DEFAULT = {
              title: LIST_TITLES.DEFAULT,
              data: [],
            };
          }
          sectionsDataSource.DEFAULT.data.push(searchResult[i]);
          continue;
        }
        switch (searchResult[i].blockType) {
          case 'favoritePharm': {
            if (!sectionsDataSource.FAVORITE) {
              sectionsDataSource.FAVORITE = {
                title: LIST_TITLES.FAVORITE,
                data: [],
              };
            }
            sectionsDataSource.FAVORITE.data.push(searchResult[i]);
            break;
          }
          case 'fullAvailable': {
            if (!sectionsDataSource.ALL_IN_STOCK) {
              sectionsDataSource.ALL_IN_STOCK = {
                title: LIST_TITLES.ALL_IN_STOCK,
                data: [],
              };
            }
            sectionsDataSource.ALL_IN_STOCK.data.push(searchResult[i]);
            break;
          }
          case 'partAvailable': {
            if (!sectionsDataSource.PART_IN_STOCK) {
              sectionsDataSource.PART_IN_STOCK = {
                title: LIST_TITLES.PART_IN_STOCK,
                data: [],
              };
            }
            sectionsDataSource.PART_IN_STOCK.data.push(searchResult[i]);
            break;
          }
        }

        if (searchResult[i].blockType !== 'favoritePharm') {
          if (!sectionsDataSource.TAKE_TOMORROW) {
            sectionsDataSource.TAKE_TOMORROW = {
              title: LIST_TITLES.TAKE_TOMORROW,
              data: [],
            };
          }
          sectionsDataSource.TAKE_TOMORROW.data.push(searchResult[i]);
        }
      }
      const sectionsResult = Object.values(sectionsDataSource).sort((a, b) =>
        Object.values(LIST_TITLES).indexOf(a.title) >
        Object.values(LIST_TITLES).indexOf(b.title)
          ? 1
          : -1,
      );
      return {
        today: sectionsResult.filter(
          (s) => s.title !== LIST_TITLES.TAKE_TOMORROW,
        ),
        tomorrow: sectionsResult.filter((s) =>
          [LIST_TITLES.FAVORITE, LIST_TITLES.TAKE_TOMORROW].includes(s.title),
        ),
      };
    } else {
      return {
        today: [],
        tomorrow: [],
      };
    }
  }, [defaultStoreData, searchResult]);

  useEffect(() => {
    !sectionsInitialized && setSectionsInitialized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionsData]);
  //#endregion

  //#region PARTS
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

  const renderItem = useCallback<
    SectionListRenderItem<PickPoint, PickPointSectionListItem>
  >(
    ({item}: {item: PickPoint}) => (
      <PickPointListItem
        dataSource={item}
        onProceedToCheckoutButtonPress={onProceedToCheckoutButtonPress}
        onShowOnMapButtonPress={onShowOnMapButtonPress}
        userLocation={userLocation}
        dateFilter={activeDateFilter}
      />
    ),
    [
      userLocation,
      activeDateFilter,
      onShowOnMapButtonPress,
      onProceedToCheckoutButtonPress,
    ],
  );
  const ListEmptyComponent = useMemo(
    () =>
      searchQuery.length > 0 ? (
        <AppText color={Colors.gray6} wrapperStyle={styles.listEmptyText}>
          {'По данному адресу аптек не найдено'}
        </AppText>
      ) : sectionsInitialized ? (
        sectionsData[activeDateFilter].length === 0 ? (
          <AppText color={Colors.gray6} wrapperStyle={styles.listEmptyText}>
            {`На ${AVAILABILITY_DAY[activeDateFilter]} нет доступных аптек`}
          </AppText>
        ) : dataSource.length > 0 ? (
          <Loader style={styles.listEmptyLoader} />
        ) : null
      ) : null,
    [
      activeDateFilter,
      dataSource.length,
      searchQuery.length,
      sectionsData,
      sectionsInitialized,
    ],
  );
  //#endregion

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
        sections={sectionsData[activeDateFilter]}
        ListEmptyComponent={ListEmptyComponent}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        // ListHeaderComponent={
        //   <PickPointListDateFilter
        //     activeFilter={activeDateFilter}
        //     onFilterItemPress={onPickPointListDateFilterItemPress}
        //   />
        // }
        scrollIndicatorInsets={{
          bottom: bottomInset + SIZE_48,
        }}
        contentContainerStyle={[
          styles.contentContainer,
          {
            paddingBottom: bottomInset + SIZE_24 + SIZE_48,
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
  listEmptyText: {
    marginTop: SIZE_16,
    alignSelf: 'center',
  },
  listEmptyLoader: {
    marginTop: SIZE_32,
  },
});

export default memo(PickPointList, () => true);
