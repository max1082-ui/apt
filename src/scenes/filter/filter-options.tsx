import React, {
  FC,
  useRef,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {StyleSheet, View} from 'react-native';

import {
  StackActions,
  CommonActions,
  useNavigationState,
  useFocusEffect,
} from '@react-navigation/native';
import {HeaderBackButton} from '@react-navigation/stack';

import type {FilterOptionsScreenProps} from '@navigation/types';

import {AppText, AppButton, PressableOpacity} from '@components/atoms';
import {FilterOptionsList} from '@components/templates';

import {Colors} from '@styles/colors';
import {CommonStyles} from '@styles/common';
import {padding, scale} from '@styles/mixins';
import {SIZE_40, WINDOW_GUTTER} from '@styles/sizes';

import type {FilterOption, FilterMultipleActiveOptions} from '@types';

const FilterOptionsScreen: FC<FilterOptionsScreenProps> = ({
  navigation,
  route: {
    params: {dataSource, filterResult, setParamsKey},
  },
}) => {
  //#region NAVIGATION
  const {filterStackKey} = useNavigationState((state) => ({
    filterStackKey: state.key,
    filterMainKey: state.routes.filter((r) => r.name === 'FilterMain')[0].key,
  }));
  //#endregion

  //#region ACTIVE ITEMS
  const [activeItems, setActiveItems] = useState<FilterMultipleActiveOptions>(
    filterResult &&
      filterResult[dataSource.id] &&
      Object.values(filterResult[dataSource.id]).length > 0
      ? (filterResult[dataSource.id] as FilterMultipleActiveOptions)
      : [],
  );
  const onOptionItemPress = useCallback<(item: FilterOption) => void>(
    ({id}) => {
      setActiveItems((current) =>
        current?.includes(id)
          ? current.filter((k) => k !== id)
          : [...current, id],
      );
    },
    [],
  );
  //#endregion

  //#region INTERNAL FILTER RESULT
  const filterResultInternal = useMemo(
    () =>
      Object.assign(
        {},
        // если есть фильтр результ
        // вытаскиваем из него все свойства кроме того, опции которого мы тут выбираем
        // это чтобы если оно есть в фильтр результ и мы сбрасываем выбор
        // не добавлять его из того фильтр результ что в пропсах
        filterResult && {...(({[dataSource.id]: _, ...r}) => r)(filterResult)},
        // и добавляем активные опшнсы этого самого текущего свойства
        // в результирующий объект
        activeItems.length > 0 && {[dataSource.id]: activeItems},
      ),
    [activeItems, dataSource.id, filterResult],
  );
  //#endregion

  //#region RESET_HANDLING
  const onResetButtonPress = useCallback(() => {
    setActiveItems([]);
  }, []);
  //#endregion

  //#region BACK BUTTON HANDLING
  const onHeaderBackButtonPress = useCallback(() => {
    navigation.dispatch((state) => {
      const targetRoute = state.routes.filter(
        (r) => r.name === 'FilterMain',
      )[0];
      const nextParams = {
        ...targetRoute.params,
        filterResult: filterResultInternal,
      };
      return CommonActions.navigate({...targetRoute, params: nextParams});
    });
    // navigation.dispatch(CommonActions.goBack());
  }, [filterResultInternal, navigation]);
  //#endregion

  //#region NAV FOCUS EFFECT HEADER PARTS
  useFocusEffect(() => {
    navigation.setOptions({
      headerLeft: (props) => (
        <HeaderBackButton {...props} onPress={onHeaderBackButtonPress} />
      ),
      headerRight: () => (
        <PressableOpacity
          disabled={activeItems.length === 0}
          onPress={onResetButtonPress}
          style={CommonStyles.defaultHeaderRightContainer}>
          <AppText type="small" color={Colors.gray4}>
            {'Сбросить'}
          </AppText>
        </PressableOpacity>
      ),
    });
  });
  //#endregion

  //#region RESULTS_COUNT
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isDebouncing, setIsDebouncing] = useState<boolean>(false);

  const timerRef = useRef<any>();
  const killTimer = () => timerRef.current && clearTimeout(timerRef.current);

  useEffect(() => {
    killTimer();

    //handle only lists of options
    if (isMounted && activeItems instanceof Array && activeItems.length > 0) {
      setIsDebouncing(true);
      timerRef.current = setTimeout(() => {
        // getApiResultsCountAsync();
        setIsDebouncing(false);
      }, 1500);
    } else {
      setIsDebouncing(false);
    }

    !isMounted && setIsMounted(true);

    return killTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterResultInternal]);
  //#endregion

  //#region PROCEED
  const onProceedButtonPress = () => {
    const filter = filterResultInternal;
    navigation.dispatch({
      ...CommonActions.setParams({filter}),
      source: setParamsKey,
    });
    navigation.dispatch({
      ...StackActions.popToTop(),
      target: filterStackKey,
    });
    navigation.dispatch({
      ...CommonActions.goBack(),
    });
  };
  //#endregion

  //#region CLEANUP
  useEffect(() => {
    return () => {
      killTimer();
      // requestRef.current && requestRef.current.abort();
    };
  }, []);
  //#endregion

  return (
    <View style={[CommonStyles.fill, styles.container]}>
      <FilterOptionsList
        activeItems={activeItems}
        onItemPress={onOptionItemPress}
        dataSource={dataSource.values as FilterOption[]}
      />
      <View style={styles.proceedButtonContainer}>
        <AppButton
          disabled={isDebouncing}
          label={'Применить'}
          onPress={onProceedButtonPress}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: SIZE_40 + scale(57) / 2,
  },
  contentContainer: {
    paddingHorizontal: WINDOW_GUTTER,
  },
  proceedButtonContainer: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    ...padding(0, WINDOW_GUTTER, SIZE_40),
  },
});

export default FilterOptionsScreen;
