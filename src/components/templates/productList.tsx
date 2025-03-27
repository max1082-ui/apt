import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  ForwardRefRenderFunction,
  useState,
  useCallback,
} from 'react';

import {StyleSheet, FlatList, StyleProp, ViewStyle} from 'react-native';

import type {FlatListProps} from 'react-native';

import {AnimatedFlatList, SeparatorLine} from '@components/atoms';
import {ProductListItem} from '@components/molecules';

import {
  SIZE_24,
  WINDOW_GUTTER,
  PRODUCT_LIST_SEPARATOR_HEIGHT,
} from '@styles/sizes';
import {Colors} from '@styles/colors';

import type {ProductPreview, ProdudctListRefObject} from '@types';

interface ProductListProps
  extends Omit<
    FlatListProps<ProductPreview>,
    'renderItem' | 'data' | 'onEndReached'
  > {
  dataSource: ProductPreview[];
  onProductItemPress: (item: ProductPreview) => void;
  contentContainerStyle?: StyleProp<ViewStyle>;
  onListEndReached?: () => void;
}

const ProductList: ForwardRefRenderFunction<
  ProdudctListRefObject,
  ProductListProps
> = (
  {
    dataSource,
    contentContainerStyle,
    onProductItemPress,
    onListEndReached,
    ...passThroughProps
  },
  ref,
) => {
  //#region WEIRD BUG FIX (calls onEndReached multiple times)
  //TODO maybe limit the number of setState's
  const [callOnEndReached, setCallOnEndReached] = useState<boolean>(false);
  const onEndReached = useCallback(() => {
    setCallOnEndReached(true);
  }, []);
  const onMomentumScrollEnd = useCallback(() => {
    if (callOnEndReached) {
      onListEndReached?.();
      setCallOnEndReached(false);
    }
  }, [callOnEndReached, onListEndReached]);
  // //#endregion

  //#region REF
  const scrollRef = useRef<FlatList<ProductPreview>>(null);

  useImperativeHandle(ref, () => ({
    scrollToTop: () =>
      scrollRef.current &&
      dataSource.length > 0 &&
      scrollRef.current.scrollToOffset({
        animated: false,
        offset: 0,
      }),
  }));
  //#endregion
  return (
    <>
      <AnimatedFlatList
        ref={scrollRef}
        data={dataSource}
        renderItem={({item}) => (
          <ProductListItem
            dataSource={item}
            onPress={() => onProductItemPress(item)}
          />
        )}
        // из-за контента пришлось отказаться но пока оставим это тут
        // getItemLayout={(_, index) => ({
        //   length: PRODUCT_LIST_ITEM_HEIGHT + PRODUCT_LIST_SEPARATOR_HEIGHT,
        //   offset:
        //     PRODUCT_LIST_ITEM_HEIGHT * index + PRODUCT_LIST_SEPARATOR_HEIGHT,
        //   index,
        // })}
        ItemSeparatorComponent={() => (
          <SeparatorLine height={PRODUCT_LIST_SEPARATOR_HEIGHT} />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={[
          styles.listContentContainer,
          contentContainerStyle,
        ]}
        //----BUG FIX---
        onEndReached={onEndReached}
        onMomentumScrollEnd={onMomentumScrollEnd}
        //----BUG FIX---
        style={styles.list}
        {...passThroughProps}
      />
    </>
  );
};

const styles = StyleSheet.create({
  list: {
    backgroundColor: Colors.white,
  },
  listContentContainer: {
    paddingBottom: SIZE_24,
    paddingHorizontal: WINDOW_GUTTER,
  },
});

export default forwardRef(ProductList);
