import React, {FC, useCallback, useEffect} from 'react';
import {FlatList, StyleSheet} from 'react-native';

import type {ProfileOrderListScreenProps} from '@navigation/types';

import {RequestUpdateIndicator, SeparatorLine} from '@components/atoms';
import {OrderPreviewItem} from '@components/molecules';
import {DynamicListEmptyComponent} from '@components/organisms';
import {DynamicListSkeleton} from '@components/templates';

import {useApiCall} from '@hooks';

import {scale} from '@styles/mixins';
import {CommonStyles} from '@styles/common';
import {STATUS_CODE_COLORS} from '@styles/colors';
import {SIZE_16, WINDOW_GUTTER} from '@styles/sizes';

import {Images} from '@assets';

import type {GetOrderListResponse, GetOrderListRequestParams} from '@types';

//TODO not implemented yet on backend
const ITEMS_PER_PAGE = 20;
//-----------------------------------
const INITIAL_NUM_TO_RENDER = ITEMS_PER_PAGE / 2;

const ProfileOrderListScreen: FC<ProfileOrderListScreenProps> = ({
  navigation,
}) => {
  //#region DATA
  const {
    initialized,
    data: dataSource,
    loadingState,
    callTrigger,
  } = useApiCall<GetOrderListRequestParams, GetOrderListResponse>({
    method: 'GET',
    endpoint: 'user/order/list',
  });

  useEffect(() => {
    let cleanup;
    if (initialized) {
      cleanup = navigation.addListener('focus', callTrigger);
    }
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized]);

  //#endregion

  //#region BINDING
  const onOrderItemPress = (orderId: number): void => {
    navigation.push('ProfileOrderDetail', {orderId});
  };

  const onEmptyListButtonPress = useCallback(() => {
    navigation.jumpTo('HomeStack', {screen: 'HomeMain', initial: true});
  }, [navigation]);
  //#endregion

  if (loadingState === 'loading') {
    return <DynamicListSkeleton />;
  }

  return (
    <>
      <FlatList
        data={dataSource}
        initialNumToRender={INITIAL_NUM_TO_RENDER}
        renderItem={({item}) => (
          <OrderPreviewItem
            dataSource={item}
            codeColor={STATUS_CODE_COLORS[item.code].color}
            onPress={() => onOrderItemPress(item.id)}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <DynamicListEmptyComponent
            title="У вас пока нет покупок"
            imageSource={Images.emptyOrderList}
            description="У вас пока нет покупок"
            buttonLabel="Совершить покупки"
            onButtonPress={onEmptyListButtonPress}
          />
        }
        ItemSeparatorComponent={() => <SeparatorLine />}
        style={CommonStyles.fill}
        contentContainerStyle={styles.contentContainer}
      />
      {loadingState === 'updating' && <RequestUpdateIndicator />}
    </>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: SIZE_16,
    paddingHorizontal: WINDOW_GUTTER,
  },
  loader: {
    height: scale(80),
  },
});

export default ProfileOrderListScreen;
