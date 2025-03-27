import React, {FC} from 'react';
import {View, Pressable, StyleSheet} from 'react-native';

import AppText from './appText';

import {
  SIZE_8,
  SIZE_16,
  SIZE_48,
  WINDOW_WIDTH,
  WINDOW_GUTTER,
} from '@styles/sizes';
import {Colors} from '@styles/colors';

import type {PickPointSectionListDate} from '@types';

interface PickPointListDateFilterProps {
  activeFilter: PickPointSectionListDate;
  onFilterItemPress: (d: PickPointSectionListDate) => void;
}

const PickPointListDateFilter: FC<PickPointListDateFilterProps> = ({
  activeFilter,
  onFilterItemPress,
}) => {
  return (
    <View style={styles.dateFilterWrapper}>
      <View style={styles.dateFilterContainer}>
        <Pressable
          disabled={activeFilter === 'today'}
          onPress={() => onFilterItemPress('today')}
          style={[
            styles.dateFilterButtonBase,
            styles.dateFilterButtonLeft,
            {
              backgroundColor:
                activeFilter === 'today'
                  ? Colors.accent.default
                  : Colors.basic1,
            },
          ]}>
          <AppText type="control" color={Colors.white}>
            {'Забрать сегодня'}
          </AppText>
        </Pressable>
        <Pressable
          disabled={activeFilter === 'tomorrow'}
          onPress={() => onFilterItemPress('tomorrow')}
          style={[
            styles.dateFilterButtonBase,
            styles.dateFilterButtonRight,
            {
              backgroundColor:
                activeFilter === 'tomorrow'
                  ? Colors.accent.default
                  : Colors.basic1,
            },
          ]}>
          <AppText type="control" color={Colors.white}>
            {'Забрать завтра'}
          </AppText>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dateFilterWrapper: {
    paddingTop: SIZE_16,
  },
  dateFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateFilterButtonBase: {
    height: SIZE_48,
    width: (WINDOW_WIDTH - 2 * WINDOW_GUTTER) / 2,
    paddingHorizontal: SIZE_8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateFilterButtonLeft: {
    borderBottomLeftRadius: SIZE_16,
    borderTopLeftRadius: SIZE_16,
  },
  dateFilterButtonRight: {
    borderBottomRightRadius: SIZE_16,
    borderTopRightRadius: SIZE_16,
  },
});

export default PickPointListDateFilter;
