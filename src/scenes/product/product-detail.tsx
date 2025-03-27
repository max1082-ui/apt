import React, {
  FC,
  Fragment,
  useRef,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {Platform, StyleSheet, View} from 'react-native';

import type {LayoutChangeEvent} from 'react-native';

import {useSafeAreaInsets} from 'react-native-safe-area-context';

import Animated, {
  and,
  neq,
  set,
  cond,
  block,
  event,
  lessThan,
  greaterThan,
  interpolateNode,
  Clock,
  useValue,
  EasingNode,
} from 'react-native-reanimated';

import {useHeaderHeight} from '@react-navigation/stack';

import type {ProductDetailScreenProps} from '@navigation/types';

import {
  Icon,
  Price,
  Loader,
  AppText,
  FadeInView,
  FavoriteButton,
  AppHeaderTitle,
  CollapsibleText,
  ProgressiveImage,
  AddToCartButtonDetail,
  PressableOpacity,
} from '@components/atoms';
import {HorizontalListProductItem} from '@components/molecules';
import {HorizontalList} from '@components/organisms';

import {useFavoriteState} from '@state/hooks';

import {useApiCall, useCollapsible} from '@hooks';

import {getNoun, runTiming} from '@utils';

import {CommonStyles} from '@styles/common';
import {
  SIZE_8,
  SIZE_16,
  SIZE_24,
  SIZE_40,
  WINDOW_WIDTH,
  WINDOW_GUTTER,
  HEADER_TITLE_WIDTH,
} from '@styles/sizes';
import {scale} from '@styles/mixins';
import {Colors} from '@styles/colors';
import {Literals} from '@styles/typography';

import type {
  ProductPreview,
  ProductDetailResponse,
  ProductDetailRequestParams,
} from '@types';

//#region MEASURE CONSTANTS
const IMAGE_CONTAINER_HEIGHT = scale(265);
const IMAGE_HEIGHT = scale(240);
const IMAGE_WIDTH = IMAGE_HEIGHT;

const CONTENT_CONTAINER_BOTTOM_PADDING = scale(16 + 24);

const SNAP_OFFSET = IMAGE_CONTAINER_HEIGHT;

const BOTTOM_BUTTON_INSET_BASE = scale(24 * 2 + 44 - 16);
//#endregion

const ProductDetailScreen: FC<ProductDetailScreenProps> = ({
  route: {
    params: {productId, productName},
  },
  navigation,
}) => {
  const {bottom: bottomInset} = useSafeAreaInsets();

  //#region DATA
  const {data: dataSource, loadingState} = useApiCall<
    ProductDetailRequestParams,
    ProductDetailResponse
  >({
    method: 'GET',
    endpoint: 'catalog/element',
    requestParams: {
      id: productId,
    },
  });
  //#endregion

  //#region ANIMATIONS
  const {onCollapsibleNodeLayout, onCollapsibleTriggerFire, animatedHeight} =
    useCollapsible({
      duration: 200,
      easing: EasingNode.ease,
    });

  //#region NAME NODE LAYOUT
  const headerHeight = useHeaderHeight();
  const nameNodeRef = useRef<View>(null);
  const nameYOffset = useValue<number>(0);
  const onNameNodeLayout = () =>
    nameNodeRef.current &&
    nameNodeRef.current.measure((_fx, _fy, _w, h, _px, py) => {
      nameYOffset.setValue(py + h - headerHeight);
    });
  //#endregion

  //#region HEADER COLLAPSIBLE TITLE ANIMATION
  const [headerNameLayoutHeight, setHeaderNameLayoutHeight] =
    useState<number>(0);

  const onHeaderNameCollapsibleLayout = useCallback(
    ({
      nativeEvent: {
        layout: {height},
      },
    }: LayoutChangeEvent) =>
      headerNameLayoutHeight === 0 && setHeaderNameLayoutHeight(height),
    [headerNameLayoutHeight],
  );

  const headerNameClock = useRef(new Clock()).current;
  const headerNameProgress = useValue<number>(0);
  const headerNameHeight = useValue<number>(0);
  const headerNameAnimatedHeight = useRef(
    runTiming({
      clock: headerNameClock,
      value: headerNameProgress,
      dest: headerNameHeight,
    }),
  ).current;
  //#endregion

  //#region HEADER TITLE INIT
  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Animated.View
          style={[
            styles.collapsibleHeaderName,
            {
              height: headerNameAnimatedHeight,
            },
          ]}>
          <View
            style={styles.collapsibleHeaderNameContent}
            onLayout={onHeaderNameCollapsibleLayout}>
            <AppHeaderTitle title={productName} />
          </View>
        </Animated.View>
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onHeaderNameCollapsibleLayout]);

  useEffect(() => {
    navigation.setOptions({
      headerTitleContainerStyle: {
        height: headerNameLayoutHeight,
        width: HEADER_TITLE_WIDTH,
        justifyContent: 'flex-end',
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerNameLayoutHeight]);
  //#endregion

  //#region ANIMATION
  const scrollY = useValue<number>(0);
  const [layoutHeight, setLayoutHeight] = useState<number>(0);

  const onScrollHandler = event(
    [
      {
        nativeEvent: {
          contentOffset: {
            y: (y: number) =>
              block([
                set(scrollY, y),
                cond(
                  and(
                    neq(headerNameHeight, headerNameLayoutHeight),
                    greaterThan(y, nameYOffset),
                  ),
                  set(headerNameHeight, headerNameLayoutHeight),
                ),
                cond(
                  and(neq(headerNameHeight, 0), lessThan(y, nameYOffset)),
                  set(headerNameHeight, 0),
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

  const interpolateImageScale = () =>
    interpolateNode(scrollY, {
      inputRange: [-SNAP_OFFSET, 0, 1],
      outputRange: [2, 1, 1],
    });
  const interpolateImageOffset = () =>
    interpolateNode(scrollY, {
      inputRange: [-SNAP_OFFSET, 0, SNAP_OFFSET],
      outputRange: [-Math.ceil(SNAP_OFFSET / 2), 0, Math.ceil(SNAP_OFFSET / 2)],
    });
  //#endregion
  //#endregion

  //#region FAVORITE
  const {isFavorite, favoriteProcessing, onFavoriteButtonPress} =
    useFavoriteState(productId, productName);
  //#endregion

  useEffect(
    () =>
      navigation.setOptions({
        headerRightContainerStyle: styles.headerFavoriteButton,
        headerRight: () => (
          <FavoriteButton
            isFavorite={isFavorite}
            disabled={favoriteProcessing}
            onPress={onFavoriteButtonPress}
          />
        ),
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isFavorite, favoriteProcessing],
  );

  //#region PARTS
  const manufacturerInfoText = useMemo(() => {
    let result = '';
    if (dataSource) {
      const {manufacturer, country} = dataSource.info;
      const haveBothParts = manufacturer && country ? true : false;

      result = `${manufacturer || ''} ${haveBothParts ? '|' : ''} ${
        country || ''
      }`;
    }
    return result;
  }, [dataSource]);
  //#endregion

  //#region BINDING
  const onProductItemPress = useCallback(
    ({id, name}: ProductPreview) =>
      navigation.push('ProductDetail', {productId: id, productName: name}),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const navigateCart = useCallback(
    () =>
      navigation.navigate('AppTabs', {
        screen: 'CartStack',
        params: {
          screen: 'CartMain',
          initial: false,
        },
      }),
    [navigation],
  );
  //#endregion

  if (loadingState === 'loading') {
    return <Loader size="large" />;
  }

  if (dataSource) {
    return (
      <>
        <FadeInView
          style={[
            CommonStyles.fill,
            {paddingBottom: BOTTOM_BUTTON_INSET_BASE + bottomInset},
          ]}
          onLayout={({
            nativeEvent: {
              layout: {height},
            },
          }) => setLayoutHeight(height)}>
          <Animated.ScrollView
            decelerationRate="fast"
            scrollEventThrottle={16}
            snapToEnd={false}
            snapToOffsets={[SNAP_OFFSET]}
            scrollIndicatorInsets={{bottom: SIZE_16}}
            onScroll={onScrollHandler}>
            <Animated.View
              style={[
                styles.imageContainer,
                {
                  transform: [
                    {
                      translateY: interpolateImageOffset(),
                    },
                  ],
                },
              ]}>
              <Animated.View
                style={[
                  Platform.select({
                    ios: {
                      transform: [
                        {
                          scale: interpolateImageScale(),
                        },
                      ],
                    },
                  }),
                ]}>
                <ProgressiveImage
                  source={{uri: dataSource.photo}}
                  style={styles.image}
                />
              </Animated.View>
            </Animated.View>
            <Animated.View
              style={[
                styles.detailContainer,
                {
                  minHeight:
                    layoutHeight - BOTTOM_BUTTON_INSET_BASE - bottomInset,
                },
              ]}>
              <View style={styles.detailWrapper}>
                {dataSource.prescription && (
                  <View style={styles.recipeBadge}>
                    <AppText type="small" color={Colors.white}>
                      {'Отпускается по рецепту'}
                    </AppText>
                  </View>
                )}
                <View
                  ref={nameNodeRef}
                  style={styles.nameWrapper}
                  onLayout={onNameNodeLayout}>
                  <AppText type="productNameDetail">{dataSource?.name}</AppText>
                </View>
                <AppText
                  type="productName"
                  color={Colors.gray4}
                  wrapperStyle={{marginBottom: SIZE_24}}>
                  {manufacturerInfoText}
                </AppText>
                <View style={styles.priceWrapper}>
                  {dataSource?.price && (
                    <Price
                      size="large"
                      actualPrice={dataSource.price.actual}
                      oldPrice={dataSource.price.old}
                      style={styles.price}
                    />
                  )}
                  <PressableOpacity onPress={onCollapsibleTriggerFire}>
                    <AppText type="link" color={Colors.accent.pressed}>
                      {`В наличии в ${dataSource.store.availability} ${getNoun(
                        dataSource.store.availability,
                        'аптеке',
                        'аптеках',
                        'аптеках',
                      )}`}
                    </AppText>
                  </PressableOpacity>
                </View>

                <Animated.View
                  style={[styles.collapsible, {height: animatedHeight}]}>
                  <Animated.View
                    onLayout={onCollapsibleNodeLayout}
                    style={[styles.collapsibleContentContainer]}>
                    <>
                      <AppText type="bodyBold" color={Colors.gray5}>
                        {'В наличии в аптеках:'}
                      </AppText>
                      {dataSource.store.storesList.map((store, index) => (
                        <View
                          key={index.toString()}
                          style={styles.availableStoreRow}>
                          <AppText
                            wrapperStyle={styles.availableStoreNameWrapper}
                            type="bodyRegular">
                            {store.address}
                          </AppText>
                          <View style={styles.availableStoreAmountWrap}>
                            <AppText type="bodyRegular">
                              {`${store.amount} ${Literals.measure}`}
                            </AppText>
                          </View>
                        </View>
                      ))}
                    </>
                  </Animated.View>
                </Animated.View>

                <View style={styles.descriptionWrapper}>
                  {!!dataSource.info.activeSubstance && (
                    <>
                      <View style={styles.detailTitleRow}>
                        <Icon
                          name="dossier-line"
                          size={16}
                          color={Colors.gray5}
                        />
                        <AppText
                          type="bodyBold"
                          color={Colors.gray5}
                          wrapperStyle={{
                            marginLeft: scale(6),
                          }}>
                          {'Действующее вещество:'}
                        </AppText>
                      </View>
                      <AppText
                        type="bodyRegular"
                        wrapperStyle={{
                          marginTop: SIZE_8,
                          marginBottom: scale(17),
                        }}>
                        {dataSource.info.activeSubstance}
                      </AppText>
                    </>
                  )}

                  {dataSource.info.props.map((prop, index) => (
                    <Fragment key={index.toString()}>
                      <CollapsibleText
                        expanded={prop.expanded}
                        caption={prop.title}
                        text={prop.text}
                        duration={150}
                      />
                    </Fragment>
                  ))}
                </View>
              </View>

              {dataSource?.analog && (
                <HorizontalList
                  title={'Аналоги'}
                  dataSource={dataSource.analog}
                  renderItem={({item}) => (
                    <HorizontalListProductItem
                      dataSource={item}
                      onPress={() => onProductItemPress(item)}
                    />
                  )}
                  keyExtractor={(item) => item.id.toString()}
                  style={styles.similarProductsWrapper}
                />
              )}
            </Animated.View>
          </Animated.ScrollView>
        </FadeInView>
        {dataSource.id && (
          <FadeInView
            style={[styles.buttonContainer, {paddingBottom: bottomInset}]}>
            <View style={styles.buttonWrapper}>
              <AddToCartButtonDetail
                onNavigateToCartButtonPress={navigateCart}
                productData={{
                  id: dataSource.id,
                  name: dataSource.name,
                  amount: dataSource.store.amount,
                  inStock: dataSource.store.availability > 0,
                }}
              />
            </View>
          </FadeInView>
        )}
      </>
    );
  } else {
    return null;
  }
};

const styles = StyleSheet.create({
  headerFavoriteButton: {
    paddingRight: scale(18),
  },
  collapsibleHeaderName: {
    width: '100%',
    overflow: 'hidden',
  },
  collapsibleHeaderNameContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  collapsible: {
    overflow: 'hidden',
  },
  collapsibleContentContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: scale(9),
  },
  imageContainer: {
    height: IMAGE_CONTAINER_HEIGHT,
    width: WINDOW_WIDTH,
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  image: {
    borderRadius: 20,
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  detailContainer: {
    paddingTop: SIZE_8,
    paddingBottom: CONTENT_CONTAINER_BOTTOM_PADDING,
    backgroundColor: Colors.white,
  },
  detailWrapper: {
    paddingHorizontal: WINDOW_GUTTER,
  },
  detailTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recipeBadge: {
    paddingHorizontal: SIZE_8,
    paddingVertical: scale(4),
    backgroundColor: Colors.error.default,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: SIZE_8,
  },
  nameWrapper: {
    marginBottom: SIZE_8,
  },
  priceWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    alignItems: 'center',
  },
  descriptionWrapper: {
    marginTop: SIZE_16,
  },
  similarProductsWrapper: {
    paddingTop: SIZE_40,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: Colors.gray1,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: 1,
    borderColor: Colors.gray3,
    overflow: 'hidden',
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SIZE_16,
    paddingVertical: SIZE_24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray3,
  },
  availableStoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: SIZE_8,
  },
  availableStoreNameWrapper: {
    flex: 1,
  },
  availableStoreAmountWrap: {
    width: scale(100),
    alignItems: 'center',
  },
});

export default ProductDetailScreen;
