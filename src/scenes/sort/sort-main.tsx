import React, {FC, Fragment, useState} from 'react';
import {StyleSheet, View} from 'react-native';

import {CommonActions} from '@react-navigation/native';
import type {SortMainScreenProps} from '@navigation/types';

import {AppButton, SelectableOption, SeparatorLine} from '@components/atoms';

import {CommonStyles} from '@styles/common';
import {SIZE_16, SIZE_40, WINDOW_GUTTER} from '@styles/sizes';

const SortMainScreen: FC<SortMainScreenProps> = ({
  navigation,
  route: {
    params: {setParamsKey, sortData, activeSortId},
  },
}) => {
  //#region ACTIVE SORT
  const [activeSortIdInternal, setActiveSortIdInternal] = useState<
    string | undefined
  >(activeSortId);
  //#endregion

  //#region BINDING
  const onProceedButtonPress = () => {
    navigation.dispatch({
      ...CommonActions.setParams({sortId: activeSortIdInternal}),
      source: setParamsKey,
    });
    navigation.goBack();
  };
  //#endregion
  return (
    <View style={[CommonStyles.fill, styles.container]}>
      <View>
        {sortData.map((option, index) => (
          <Fragment key={option.id}>
            <SelectableOption
              item={option}
              isActive={activeSortIdInternal === option.id}
              onPress={() => setActiveSortIdInternal(option.id)}
            />
            {index !== sortData.length - 1 && <SeparatorLine />}
          </Fragment>
        ))}
      </View>
      <AppButton label="Применить" onPress={onProceedButtonPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: WINDOW_GUTTER,
    justifyContent: 'space-between',
    paddingTop: SIZE_16,
    paddingBottom: SIZE_40,
  },
});

export default SortMainScreen;
