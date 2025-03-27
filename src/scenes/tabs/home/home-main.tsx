import React, {FC, useCallback, useMemo, useState} from 'react';
import {useSelector} from 'react-redux';
import {ImageBackground, ScrollView, StyleSheet, View} from 'react-native';

import {useSafeAreaInsets} from 'react-native-safe-area-context';

import type {HomeMainScreenProps} from '@navigation/types';

import {
  AppText,
  Icon,
  Loader,
  PressableOpacity,
  ProgressiveImage,
  SearchInput,
} from '@components/atoms';
import {HorizontalListProductItem} from '@components/molecules';
import {
  BannerSlider,
  ConfirmationModal,
  HorizontalList,
} from '@components/organisms';

import {
  FILTER_SECTION_ID_PROP_NAME,
  FILTER_CONTENT_TYPE_PROP_NAME,
  FILTER_CONTENT_TYPE_SALE,
  FILTER_CONTENT_TYPE_STOCK,
  FILTER_CONTENT_TYPE_SALE_TITLE,
  FILTER_CONTENT_TYPE_STOCK_TITLE,
} from '@services/filter';
import {DEFAULT_SORT_ID} from '@services/sort';

import {useApiCall} from '@hooks';

import {
  SIZE_8,
  SIZE_16,
  SIZE_24,
  SIZE_32,
  SIZE_48,
  WINDOW_GUTTER,
} from '@styles/sizes';
import {scale} from '@styles/mixins';
import {Colors} from '@styles/colors';

import {Images} from '@assets';

import type {
  Banner,
  HomeScreenData,
  CatalogSection,
  ProductPreview,
  GetMainPageResponse,
  GetMainPageRequestParams,
} from '@types';
import {CombinedState, DefaulStoreSliceState} from '@state/types';

const initialDataSource: HomeScreenData = {
  banners: [],
  sections: [],
};

const HomeMainScreen: FC<HomeMainScreenProps> = ({navigation}) => {
  const {top: topInset} = useSafeAreaInsets();

  //#region STATE
  const {data: defaultStoreData} = useSelector<
    CombinedState,
    {data: DefaulStoreSliceState['data']}
  >((state) => ({
    data: state.defaultStore.data,
  }));

  const [defaultStoreModalVisible, setDefaultStoreModalVisible] =
    useState<boolean>(defaultStoreData ? false : true);
  //#endregion

  //#region DATA
  const [dataSource, setDataSource] =
    useState<HomeScreenData>(initialDataSource);

  const {loadingState} = useApiCall<
    GetMainPageRequestParams,
    GetMainPageResponse
  >({
    method: 'GET',
    endpoint: 'mainpage',
    responseInterceptor: (r) => {
      setDataSource(r);
      return r;
    },
  });
  //#endregion

  //#region BINDINGS
  const dismissDefaultStoreModal = useCallback(() => {
    setDefaultStoreModalVisible(false);
  }, []);
  const onSearchInputPress = useCallback(
    () => navigation.jumpTo('SearchStack'),
    [navigation],
  );
  const onSelectStoreButtonPress = useCallback(
    () =>
      navigation.navigate('StoresStack', {
        screen: 'StoresList',
        params: {selectDefaultStore: true},
      }),
    [navigation],
  );
  const onBannerSliderItemPress = useCallback(
    (_item: Banner) => navigation.push('HomeBannerDetail'),
    [navigation],
  );

  const onSectionButtonPress = useCallback(
    ({id, isMaxDepth, name: title}: CatalogSection) => {
      if (isMaxDepth) {
        let filter = {[FILTER_SECTION_ID_PROP_NAME]: id};
        return navigation.push('ProductList', {
          title,
          filter,
          sortId: DEFAULT_SORT_ID,
          excludeFilters: Object.keys(filter),
        });
      } else {
        return navigation.push('CatalogSectionList', {
          title,
          sectionId: id,
        });
      }
    },
    [navigation],
  );

  const onSaleShowAllButtonPress = useCallback(() => {
    let filter = {[FILTER_CONTENT_TYPE_PROP_NAME]: FILTER_CONTENT_TYPE_SALE};
    return navigation.push('ProductList', {
      filter,
      title: FILTER_CONTENT_TYPE_SALE_TITLE,
      sortId: DEFAULT_SORT_ID,
      excludeFilters: Object.keys(filter),
    });
  }, [navigation]);

  const onStockShowAllButtonPress = useCallback(() => {
    let filter = {[FILTER_CONTENT_TYPE_PROP_NAME]: FILTER_CONTENT_TYPE_STOCK};
    return navigation.push('ProductList', {
      filter,
      title: FILTER_CONTENT_TYPE_STOCK_TITLE,
      sortId: DEFAULT_SORT_ID,
      excludeFilters: Object.keys(filter),
    });
  }, [navigation]);

  const onHorizontalListProductItemPress = useCallback(
    ({id: productId, name: productName}: ProductPreview) => {
      navigation.navigate('ProductStack', {
        screen: 'ProductDetail',
        params: {productId, productName},
      });
    },
    [navigation],
  );
  //#endregion

  const ModalBodyComponent = useMemo(
    () => (
      <>
        <View style={styles.modalImage}>
          <ProgressiveImage source={Images.emptyCart} />
        </View>

        <AppText type="h2">{'Выберите аптеку для получения заказа'}</AppText>
      </>
    ),
    [],
  );

  const renderSections = useCallback(
    () =>
      dataSource.sections.map((section, i) => {
        return (
          <View key={i.toString()} style={styles.sectionContainer}>
            <AppText type="h2" wrapperStyle={{marginBottom: SIZE_24}}>
              {section.name}
            </AppText>
            <View style={styles.subSectionsContainer}>
              {section.subSections &&
                section.subSections.map((subSection, j, a) => (
                  <PressableOpacity
                    key={j.toString()}
                    onPress={() => onSectionButtonPress(subSection)}
                    style={[
                      styles.sectionBlock,
                      j % 2 === 0 &&
                        j + 1 === a.length &&
                        styles.singleSectionBlock,
                    ]}>
                    <AppText
                      align="center"
                      type="control"
                      color={Colors.gray7}
                      numberOfLines={3}>
                      {subSection.name}
                    </AppText>
                  </PressableOpacity>
                ))}
            </View>
          </View>
        );
      }),
    [dataSource.sections, onSectionButtonPress],
  );

  if (loadingState === 'loading') {
    return <Loader size="large" />;
  }

  return (
    <View style={{marginTop: topInset}}>
      <ScrollView
        contentContainerStyle={{paddingBottom: SIZE_24}}
        stickyHeaderIndices={[0]}>
        <View style={styles.searchInputContainer}>
          <SearchInput buttonMode onPress={onSearchInputPress} />
        </View>

        <PressableOpacity
          onPress={onSelectStoreButtonPress}
          style={styles.storeSelectContainer}>
          <ImageBackground
            source={Images.storeSelect}
            style={styles.storeSelectContent}>
            <View style={styles.storeSelectTitle}>
              <AppText type="small" color={Colors.gray1}>
                {defaultStoreData
                  ? 'Адрес аптеки для получения заказа'
                  : 'Выберите аптеку для получения заказа'}
              </AppText>
              <Icon name="arrow-right-s-line" size={16} color={Colors.gray1} />
            </View>
            {defaultStoreData && (
              <AppText
                type="h3"
                color={Colors.gray1}
                wrapperStyle={styles.selectedStoreWrapper}>
                {defaultStoreData.address}
              </AppText>
            )}
          </ImageBackground>
        </PressableOpacity>

        {/* <PressableOpacity
          onPress={onStoresButtonPress}
          style={{paddingHorizontal: WINDOW_GUTTER, paddingTop: SIZE_16}}>
          <ImageBackground source={Images.mapBanner} style={styles.mapBanner}>
            <Icon
              name="map-pin-2-line"
              size={21}
              color={Colors.accent.default}
            />
            <View style={{marginLeft: SIZE_16}}>
              <AppText type="h3" color={Colors.accent.default}>
                {'Аптеки на карте'}
              </AppText>
              <AppText type="small" color={Colors.gray8}>
                {'Заберите покупки в 30 аптеках'}
              </AppText>
            </View>
          </ImageBackground>
        </PressableOpacity> */}

        <BannerSlider
          dataSource={dataSource.banners}
          onPress={onBannerSliderItemPress}
        />

        {dataSource.products?.stock && (
          <HorizontalList
            title={FILTER_CONTENT_TYPE_STOCK_TITLE}
            dataSource={dataSource.products.stock}
            onShowAllButtonPress={onStockShowAllButtonPress}
            renderItem={({item}) => (
              <HorizontalListProductItem
                dataSource={item}
                onPress={() => onHorizontalListProductItemPress(item)}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            style={styles.horizontalListContainer}
          />
        )}

        {renderSections()}

        {dataSource.products?.sale && (
          <HorizontalList
            title={FILTER_CONTENT_TYPE_SALE_TITLE}
            dataSource={dataSource.products.sale}
            onShowAllButtonPress={onSaleShowAllButtonPress}
            renderItem={({item}) => (
              <HorizontalListProductItem
                dataSource={item}
                onPress={() =>
                  navigation.navigate('ProductStack', {
                    screen: 'ProductDetail',
                    params: {
                      productId: item.id,
                      productName: item.name,
                    },
                  })
                }
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            style={styles.horizontalListContainer}
          />
        )}
      </ScrollView>

      <ConfirmationModal
        visible={defaultStoreModalVisible}
        action={onSelectStoreButtonPress}
        actionButtonType={'primary'}
        actionButtonCaption={'Выбрать'}
        onDismissButtonPress={dismissDefaultStoreModal}>
        {ModalBodyComponent}
      </ConfirmationModal>
    </View>
  );
};

const styles = StyleSheet.create({
  searchInputContainer: {
    paddingHorizontal: WINDOW_GUTTER,
    paddingTop: SIZE_24,
    paddingBottom: SIZE_8,

    backgroundColor: Colors.white,
  },
  storeSelectContainer: {
    paddingHorizontal: WINDOW_GUTTER,
    paddingTop: SIZE_16,
  },
  storeSelectContent: {
    paddingHorizontal: SIZE_16,
    height: scale(75),
    borderRadius: 16,
    justifyContent: 'center',
  },
  storeSelectTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedStoreWrapper: {
    marginTop: SIZE_8,
  },
  mapBanner: {
    paddingHorizontal: SIZE_16,
    height: scale(96),
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  horizontalListContainer: {
    marginTop: SIZE_32,
    marginBottom: SIZE_16,
  },
  sectionContainer: {
    paddingHorizontal: WINDOW_GUTTER,
    marginTop: SIZE_48,
  },
  subSectionsContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionBlock: {
    borderRadius: 8,
    width: scale(168),
    height: scale(80),
    marginBottom: SIZE_8,
    paddingHorizontal: SIZE_8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.gray2,
  },
  singleSectionBlock: {
    width: '100%',
    marginBottom: 0,
  },
  modalImage: {
    marginBottom: SIZE_24,
    alignSelf: 'center',
  },
});

export default HomeMainScreen;
