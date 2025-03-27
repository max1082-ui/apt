import React, {
  FC,
  useRef,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from 'react';

import {View, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';

import type {NativeScrollEvent, NativeSyntheticEvent} from 'react-native';

import Animated, {
  eq,
  neq,
  set,
  and,
  cond,
  event,
  block,
  lessThan,
  greaterThan,
  Clock,
  useValue,
} from 'react-native-reanimated';

import type {ProductListScreenProps} from '@navigation/types';

import {
  Loader,
  AppText,
  PressableOpacity,
  RequestUpdateIndicator,
} from '@components/atoms';
import {
  ProductListHeaderFilter,
  ProductListHeaderSearch,
} from '@components/molecules';
import {ProductList} from '@components/templates';

import ApiService from '@services/api';
import {DEFAULT_SORT_ID} from '@services/sort';
import {FILTER_PRODUCT_ID_PROP_NAME} from '@services/filter';
import {DEFAULT_UNEXPECTED_ERROR_TEXT} from '@services/error';

import {useApiCall} from '@hooks';

import {runTiming, showSnack} from '@utils';

import {
  SIZE_8,
  SIZE_16,
  SIZE_48,
  WINDOW_GUTTER,
  PRODUCT_LIST_ITEM_MIN_HEIGHT,
} from '@styles/sizes';
import {scale} from '@styles/mixins';
import {Colors} from '@styles/colors';
import {boxShadow} from '@styles/mixins';
import {CommonStyles} from '@styles/common';

import type {
  Filter,
  SortOption,
  ProductPreview,
  ProdudctListRefObject,
  GetFilterResponse,
  GetFilterRequestParams,
  GetProductListResponse,
  GetProductListRequestParams,
  GetSearchResultRequestParams,
  GetSearchResultResponse,
  ProductListHeaderSearchRefObject,
} from '@types';
import {CombinedState, DefaulStoreSliceState} from '@state/types';

const INITIAL_NUM_TO_RENDER = 5;
const SHADOW_RADIUS = 6;
const HEADER_SEARCH_HEIGHT = SIZE_48;
const ANIMATED_HEADER_HEIGHT = scale(108);

type PaginationState = {
  isLastPage: boolean;
  page: number;
};
const initialPaginationState = {
  isLastPage: true,
  page: 1,
};

const ProductListScreen: FC<ProductListScreenProps> = ({
  route: {
    key: setParamsKey,
    params: {filter, sortId, excludeFilters, initialSearchQuery},
  },
  navigation,
}) => {
  //#region  ANIMATION
  const animatedHeaderHeight = useValue<number>(0); //TODO use for indicator insets somehow

  const scrollToOpen = useValue<number>(PRODUCT_LIST_ITEM_MIN_HEIGHT / 3);
  const scrollToClose = useValue<number>(PRODUCT_LIST_ITEM_MIN_HEIGHT);
  const isSearchShown = useValue<number>(1);

  const headerSearchClock = useRef(new Clock()).current;
  const headerSearchValue = useValue<number>(48);
  const headerSearchDest = useValue<number>(48);
  const headerAnimatedSearchHeight = useRef(
    runTiming({
      clock: headerSearchClock,
      value: headerSearchValue,
      dest: headerSearchDest,
      duration: 150,
    }),
  ).current;

  const listRef = useRef<ProdudctListRefObject>(null);
  const scrollY = useValue(0);

  const headerOpacityClock = useRef(new Clock()).current;
  const headerInvisibleShadow = useValue<number>(0);
  const headerVisibleOpacity = useValue<number>(0);
  const headerAnimatedShadowRadius = useRef(
    runTiming({
      clock: headerOpacityClock,
      value: headerInvisibleShadow,
      dest: headerVisibleOpacity,
      duration: 80,
    }),
  ).current;
  //#region HANDLERS
  const onScrollBeginDrag = useCallback(
    ({
      nativeEvent: {
        contentOffset: {y},
      },
    }: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (y > 0) {
        scrollToOpen.setValue(y - PRODUCT_LIST_ITEM_MIN_HEIGHT / 2);
        scrollToClose.setValue(y + PRODUCT_LIST_ITEM_MIN_HEIGHT);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const onScroll = event(
    [
      {
        nativeEvent: {
          contentOffset: {
            y: (y: number) =>
              block([
                set(scrollY, y),
                cond(
                  greaterThan(y, scale(10)),
                  cond(
                    neq(headerVisibleOpacity, SHADOW_RADIUS),
                    set(headerVisibleOpacity, SHADOW_RADIUS),
                  ),
                  cond(
                    neq(headerVisibleOpacity, 0),
                    set(headerVisibleOpacity, 0),
                  ),
                ),

                cond(
                  and(eq(isSearchShown, 1), greaterThan(y, scrollToClose)),
                  block([set(isSearchShown, 0), set(headerSearchDest, 0)]),
                ),
                cond(
                  and(eq(isSearchShown, 0), lessThan(y, scrollToOpen)),
                  block([
                    set(isSearchShown, 1),
                    set(headerSearchDest, HEADER_SEARCH_HEIGHT),
                  ]),
                ),
              ]),
          },
        },
      },
    ],
    {
      useNativeDriver: true,
    },
  );
  //#endregion
  //#endregion

  //#region DATA
  const [{isLastPage, page}, setPaginationState] = useState<PaginationState>(
    initialPaginationState,
  );

  //#region INDICATE FILTER/SORT REFRESH
  const [isReloading, setIsReloading] = useState<boolean>(false);
  //#endregion

  //#region DEFAULT STORE STATE
  const {data: defaultStoreData} = useSelector<
    CombinedState,
    {data: DefaulStoreSliceState['data']}
  >((state) => ({
    data: state.defaultStore.data,
  }));
  //#endregion

  const [dataSource, setDataSource] = useState<ProductPreview[]>([]);
  const {initialized, loadingState, callTrigger} = useApiCall<
    GetProductListRequestParams,
    GetProductListResponse
  >({
    method: 'GET',
    endpoint: 'catalog',
    requestParams: {
      filter,
      page,
      sort: sortId,
      defaultStoreId: defaultStoreData?.id,
    },
    responseInterceptor: (r) => {
      setPaginationState((prev) => {
        const next = {...prev};
        Object.assign(
          next,
          {isLastPage: r.isLastPage},
          !r.isLastPage && {page: r.page + 1},
        );
        return next;
      });
      setDataSource((prev) => (page === 1 ? r.list : [...prev, ...r.list]));
      setIsReloading(false);
      if (!initialSortDataSource && r.sortList?.values) {
        setinitialSortDataSource(r.sortList.values);
        sortId !== r.sortList.active &&
          navigation.setParams({sortId: r.sortList.active});
      }
      return r;
    },
    onError: () => {
      setIsReloading(false);
    },
  });

  const onListEndReached = useCallback(
    () =>
      !isLastPage && dataSource.length > INITIAL_NUM_TO_RENDER && callTrigger(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataSource.length, isLastPage],
  );
  //#endregion

  //#region SORT
  const [initialSortDataSource, setinitialSortDataSource] =
    useState<SortOption[]>();

  useEffect(() => {
    if (initialized && sortId) {
      setIsReloading(true); // resets inside useApiCall responseInterceptor
      listRef.current && listRef.current.scrollToTop();
      setPaginationState(initialPaginationState);
      callTrigger();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortId]);

  const sortButtonLabel = useMemo(
    () =>
      sortId && sortId !== DEFAULT_SORT_ID && initialSortDataSource
        ? initialSortDataSource.filter((item) => item.id === sortId)[0].name
        : 'Сортировка',
    [initialSortDataSource, sortId],
  );

  const onSortButtonPress = useCallback(() => {
    if (initialSortDataSource) {
      navigation.navigate('SortStack', {
        screen: 'SortMain',
        params: {
          setParamsKey,
          activeSortId: sortId,
          sortData: initialSortDataSource,
        },
      });
    }
  }, [initialSortDataSource, navigation, setParamsKey, sortId]);
  //#endregion

  //#region FILTER
  const [filterIsLoading, setFilterIsLoading] = useState<boolean>(false);
  const [initialFilterDataSource, setInitialFilterDataSource] =
    useState<Filter[]>();

  const hasActiveFilter = useMemo(
    () =>
      filter
        ? Object.keys(filter).reduce(
            (r, k) => (excludeFilters?.includes(k) ? r + 0 : r + 1),
            0,
          ) > 0
          ? true
          : false
        : false,
    [excludeFilters, filter],
  );

  const navigateFilter = useCallback<(filterData: Filter[]) => void>(
    (filterData) => {
      navigation.navigate('FilterStack', {
        screen: 'FilterMain',
        params: {
          setParamsKey,
          filterResult: filter,
          filterData,
        },
      });
    },
    [filter, navigation, setParamsKey],
  );

  const requestFilterDataSourceAsync = useCallback(async () => {
    try {
      setFilterIsLoading(true);
      const requestData = {filter};
      const ApiRequest = new ApiService<
        GetFilterRequestParams,
        GetFilterResponse
      >('GET', 'catalog/filter', requestData);
      const response = await ApiRequest.call();
      return response;
    } catch ({message}) {
      showSnack({
        message,
        type: 'danger',
        duration: 'long',
      });
      return;
    } finally {
      setFilterIsLoading(false);
    }
  }, [filter]);

  const formatFilterApiData = useCallback(
    (filterApiData: Filter[] = []) => {
      let result = filterApiData;
      if (excludeFilters) {
        let excludeFiltersInternal = excludeFilters ? excludeFilters : [];
        for (const [optionIndex, filterOption] of Object.entries(
          filterApiData,
        )) {
          if (excludeFiltersInternal.includes(filterOption.id)) {
            delete result[parseInt(optionIndex, 10)];
          }
        }
      }
      return result.sort((item) => (item.values instanceof Array ? 1 : -1));
    },
    [excludeFilters],
  );

  useEffect(() => {
    if (initialized) {
      setIsReloading(true); // resets inside useApiCall responseInterceptor
      listRef.current && listRef.current.scrollToTop();
      setPaginationState(initialPaginationState);
      callTrigger();
      (async () => {
        const filterApiData = await requestFilterDataSourceAsync();
        if (filterApiData) {
          const filterApiResult = formatFilterApiData(filterApiData);
          setInitialFilterDataSource(
            (current) =>
              current
                ? [
                    ...current.filter((exOpt) =>
                      filterApiResult.findIndex(
                        (newOpt) => newOpt.id === exOpt.id,
                      ) > -1
                        ? false
                        : true,
                    ),
                    ...filterApiResult,
                  ]
                : filterApiResult, //USE THIS //MOVE LOGIC ABOVE TO BACKEND
          );
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const onFilterButtonPress = useCallback(async () => {
    if (!initialFilterDataSource) {
      const filterApiData = await requestFilterDataSourceAsync();
      if (filterApiData) {
        const filterApiResult = formatFilterApiData(filterApiData);
        setInitialFilterDataSource(filterApiResult);
        navigateFilter(filterApiResult);
      }
    } else {
      navigateFilter(initialFilterDataSource);
    }
  }, [
    navigateFilter,
    formatFilterApiData,
    initialFilterDataSource,
    requestFilterDataSourceAsync,
  ]);
  //#endregion

  //#region SEARCH
  const headerSearchRef = useRef<ProductListHeaderSearchRefObject>(null);
  const onSearchInit = useCallback<(query: string) => void>(
    async (query) => {
      if (
        !filter[FILTER_PRODUCT_ID_PROP_NAME] ||
        filter[FILTER_PRODUCT_ID_PROP_NAME] !== query
      ) {
        if (query.length > 0 || initialSearchQuery) {
          setIsReloading(true); // resets inside useApiCall responseInterceptor
          try {
            const ApiRequest = new ApiService<
              GetSearchResultRequestParams,
              GetSearchResultResponse
            >('GET', 'catalog/search', {
              query: encodeURI(
                query.length > 0 ? query : initialSearchQuery || '',
              ),
            });
            const response = await ApiRequest.call();

            if (response && response.length > 0) {
              navigation.setParams({
                filter: {...filter, [FILTER_PRODUCT_ID_PROP_NAME]: response},
                excludeFilters: excludeFilters
                  ? [...excludeFilters, FILTER_PRODUCT_ID_PROP_NAME]
                  : [FILTER_PRODUCT_ID_PROP_NAME],
              });
            } else {
              setIsReloading(false);
              showSnack({
                type: 'warning',
                message: 'По вашему запросу ничего не найдено',
              });
            }
          } catch (err) {
            setIsReloading(false); // resets inside useApiCall responseInterceptor
            showSnack({
              type: 'danger',
              message: err.message || DEFAULT_UNEXPECTED_ERROR_TEXT,
            });
          }
        } else {
          navigation.setParams({
            filter: (({[FILTER_PRODUCT_ID_PROP_NAME]: _, ...rest}) => rest)(
              filter,
            ),
          });
        }
      }
    },
    [excludeFilters, filter, initialSearchQuery, navigation],
  );
  //#endregion

  //#region BINDING
  const onProductItemPress = useCallback(
    ({id: productId, name: productName}: ProductPreview) =>
      navigation.navigate('ProductStack', {
        screen: 'ProductDetail',
        params: {productId, productName},
      }),
    [navigation],
  );
  //#endregion

  //#region PARTS
  const ListEmptyComponent = useMemo(
    () =>
      loadingState !== 'idle' ? null : (
        <View style={styles.listEmptyComponent}>
          {hasActiveFilter ? (
            <>
              <AppText align="center" color={Colors.gray6}>
                {'Нет товаров, удовлетворяющих установленному фильтру'}
              </AppText>
              <PressableOpacity
                onPress={onFilterButtonPress}
                style={{marginTop: SIZE_16}}>
                <AppText type="link">{'Изменить фильтр'}</AppText>
              </PressableOpacity>
            </>
          ) : filter[FILTER_PRODUCT_ID_PROP_NAME] ? (
            <>
              <AppText align="center" color={Colors.gray6}>
                {'По вашему запросу\nв данном разделе товар не найден'}
              </AppText>
              <PressableOpacity
                onPress={() => {
                  navigation.push('ProductList', {
                    title: headerSearchRef?.current?.query || 'Поиск',
                    sortId: DEFAULT_SORT_ID,
                    filter: {id: filter[FILTER_PRODUCT_ID_PROP_NAME]},
                    excludeFilters: ['id'],
                    initialSearchQuery: headerSearchRef.current?.query || '',
                  });
                  headerSearchRef.current && headerSearchRef.current.reset();
                }}
                style={{marginTop: SIZE_16}}>
                <AppText type="link">{`Искать${
                  headerSearchRef.current?.query
                    ? ` "${headerSearchRef.current.query}" `
                    : ' '
                }по всему каталогу`}</AppText>
              </PressableOpacity>
            </>
          ) : (
            <>
              <AppText align="center" color={Colors.gray6}>
                {'В данном разделе нет товаров'}
              </AppText>
              <PressableOpacity
                onPress={() => navigation.goBack()}
                style={{marginTop: SIZE_16}}>
                <AppText type="link">{'Вернуться назад'}</AppText>
              </PressableOpacity>
            </>
          )}
        </View>
      ),
    [filter, hasActiveFilter, loadingState, navigation, onFilterButtonPress],
  );
  //#endregion

  if (loadingState === 'loading') {
    return <Loader size="large" />;
  }

  return (
    <Animated.View style={CommonStyles.fill}>
      {/**
       * cheats above - animated must stay animated
       */}
      <Animated.View
        style={[
          styles.headerContainer,
          boxShadow(
            Colors.black,
            {height: 0, width: 0},
            headerAnimatedShadowRadius,
          ),
        ]}
        onLayout={({
          nativeEvent: {
            layout: {height},
          },
        }) => animatedHeaderHeight.setValue(height)}>
        <Animated.View style={{height: headerAnimatedSearchHeight}}>
          <ProductListHeaderSearch
            ref={headerSearchRef}
            initialValue={initialSearchQuery}
            editable={!isReloading}
            onSearchInit={onSearchInit}
          />
        </Animated.View>

        <ProductListHeaderFilter
          filterDisabled={filterIsLoading}
          filterLoading={!initialFilterDataSource && filterIsLoading}
          sortButtonLabel={sortButtonLabel}
          hasActiveFilter={hasActiveFilter}
          onSortButtonPress={onSortButtonPress}
          onFilterButtonPress={onFilterButtonPress}
        />
      </Animated.View>

      <>
        <ProductList
          ref={listRef}
          onScroll={onScroll}
          scrollEventThrottle={16}
          dataSource={dataSource}
          onProductItemPress={onProductItemPress}
          initialNumToRender={INITIAL_NUM_TO_RENDER}
          maxToRenderPerBatch={INITIAL_NUM_TO_RENDER}
          onEndReachedThreshold={2}
          onListEndReached={onListEndReached}
          ListFooterComponent={() =>
            !isLastPage && dataSource.length > 0 ? (
              <View style={styles.loader}>
                <Loader size="large" />
              </View>
            ) : null
          }
          ListEmptyComponent={ListEmptyComponent}
          contentContainerStyle={{paddingTop: ANIMATED_HEADER_HEIGHT}}
          onScrollBeginDrag={onScrollBeginDrag}
        />
        {isReloading && <RequestUpdateIndicator />}
      </>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  loader: {
    height: scale(80),
  },
  listEmptyComponent: {
    alignItems: 'center',
    paddingVertical: SIZE_48,
  },
  headerContainer: {
    backgroundColor: Colors.white,
    paddingTop: SIZE_8,
    paddingHorizontal: WINDOW_GUTTER,
    borderBottomLeftRadius: SIZE_16,
    borderBottomRightRadius: SIZE_16,
    zIndex: 1,

    position: 'absolute',
    top: 0,
    width: '100%',
  },
});

export default ProductListScreen;
