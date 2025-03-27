import React, {FC, Fragment, useState, useEffect, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';

import {CommonActions, useFocusEffect} from '@react-navigation/native';

import type {FilterMainScreenProps} from '@navigation/types';

import {
  AppText,
  AppButton,
  SeparatorLine,
  PressableOpacity,
  FilterRangeSlider,
  FilterSectionButton,
} from '@components/atoms';

import {deepEqual} from '@utils';

import {Colors} from '@styles/colors';
import {CommonStyles} from '@styles/common';
import {SIZE_40, WINDOW_GUTTER} from '@styles/sizes';

import type {
  Filter,
  FilterOption,
  FilterResult,
  FilterActiveOptions,
} from '@types';

const getActiveCaption = (
  filterValues: FilterOption[],
  activeOptions: FilterActiveOptions = [],
): string =>
  activeOptions instanceof Array && activeOptions.length > 0
    ? activeOptions.length > 1
      ? activeOptions.length.toString()
      : filterValues.filter((v) => v.id === activeOptions[0])[0].name
    : '';

const FilterMainScreen: FC<FilterMainScreenProps> = ({
  navigation,
  route: {
    params: {filterResult, setParamsKey, filterData: filterDataSource},
  },
}) => {
  //#region FILTER DATA
  const [filterData, setFilterData] = useState<Filter[]>(filterDataSource);

  useEffect(() => {
    setFilterData(filterDataSource);
  }, [filterDataSource]);
  //#endregion

  //#region FILTER_RESULT
  const [filterResultInternal, setFilterResultInternal] = useState<
    FilterResult | undefined
  >(filterResult);

  useEffect(() => {
    if (
      (!filterResult && filterResultInternal) ||
      (!filterResultInternal && filterResult) ||
      (filterResult &&
        filterResultInternal &&
        !deepEqual(filterResult, filterResultInternal))
    ) {
      setFilterResultInternal(filterResult);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterResult]);
  //#endregion

  //#region RESET_HANDLING
  const onResetButtonPress = useCallback(() => {
    //TODO test it - удаление только тех свойств которые доступны для редактирования в filterData
    setFilterResultInternal((current) => {
      if (current) {
        const internalFilterIDs = filterData.map((filter) => filter.id);
        const nextFilterData = Object.entries(current).reduce(
          (r, [frKey, frValue]) =>
            internalFilterIDs.indexOf(frKey) > -1
              ? r
              : {...r, [frKey]: frValue},
          {},
        );
        return nextFilterData;
      } else {
        return undefined;
      }
    });
  }, [filterData]);

  useFocusEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <PressableOpacity
          disabled={
            !filterResultInternal ||
            Object.keys(filterResultInternal).length === 0
          }
          onPress={onResetButtonPress}
          style={CommonStyles.defaultHeaderRightContainer}>
          <AppText type="small" color={Colors.gray4}>
            {'Очистить все'}
          </AppText>
        </PressableOpacity>
      ),
    });
  });
  //#endregion

  //#region RANGE_FILTER_HANDLING
  const onValuesChangeFinish = (
    [min, max]: number[],
    filterId: string,
  ): void => {
    setFilterResultInternal((current) =>
      Object.assign({}, current && {...current}, {
        [filterId]: {min, max},
      }),
    );
  };
  //#endregion

  //#region BINDINGS
  const onProceedButtonPress = useCallback(() => {
    navigation.dispatch({
      ...CommonActions.setParams({filter: filterResultInternal}),
      source: setParamsKey,
    });
    navigation.pop();
  }, [filterResultInternal, navigation, setParamsKey]);

  const onFilterSectionPress = useCallback<(dataSource: Filter) => void>(
    (dataSource) => {
      navigation.push('FilterOptions', {
        dataSource,
        setParamsKey,
        filterResult: filterResultInternal,
      });
    },
    [filterResultInternal, navigation, setParamsKey],
  );
  //#endregion

  return (
    <View style={[CommonStyles.fill, styles.container]}>
      <>
        <View>
          {filterData.map((filter) => {
            if (filter.values instanceof Array) {
              return filter.name ? (
                <FilterSectionButton
                  key={filter.id.toString()}
                  label={filter.name}
                  activeCaption={
                    filterResultInternal
                      ? getActiveCaption(
                          filter.values as FilterOption[],
                          filterResultInternal[
                            filter.id
                          ] as FilterActiveOptions,
                        )
                      : ''
                  }
                  onPress={() => onFilterSectionPress(filter)}
                />
              ) : null;
            } else {
              return !!filter.values?.max &&
                !!filter.values?.min &&
                filter.values.min !== filter.values.max ? (
                <Fragment key={filter.id.toString()}>
                  <FilterRangeSlider
                    label={filter.name}
                    onValuesChangeFinish={(e) =>
                      onValuesChangeFinish(e, filter.id)
                    }
                    snapped
                    values={
                      filterResultInternal && filterResultInternal[filter.id]
                        ? [
                            //@ts-ignore
                            filterResultInternal[filter.id].min,
                            //@ts-ignore
                            filterResultInternal[filter.id].max,
                          ]
                        : [filter.values.min, filter.values.max]
                    }
                    max={filter.values.max}
                    min={filter.values.min}
                  />
                  <SeparatorLine />
                </Fragment>
              ) : null;
            }
          })}
        </View>
      </>
      <AppButton label={'Применить'} onPress={onProceedButtonPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    paddingHorizontal: WINDOW_GUTTER,
    paddingBottom: SIZE_40,
  },
});

export default FilterMainScreen;
