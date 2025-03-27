import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';

import Icon from './icon';
import AppText from './appText';
import SeparatorLine from './separatorLine';
import PressableOpacity from './pressableOpacity';

import {scale} from '@styles/mixins';
import {Colors} from '@styles/colors';
import {CommonStyles} from '@styles/common';
import {SIZE_32, SIZE_8} from '@styles/sizes';

interface FilterSectionButtonProps {
  label: string;
  showSeparator?: boolean;
  onPress?: (props: any) => void;
  activeCaption?: string;
}

const FilterSectionButton: FC<FilterSectionButtonProps> = ({
  label,
  showSeparator = true,
  onPress,
  activeCaption = '',
}) => (
  <>
    <PressableOpacity onPress={onPress} style={styles.wrapper}>
      <AppText wrapperStyle={CommonStyles.fill}>{label}</AppText>
      <View style={styles.buttonRestRowContainer}>
        <AppText type="controlLabel" color={Colors.gray7} numberOfLines={1}>
          {activeCaption}
        </AppText>
        <Icon
          name="arrow-right-s-line"
          color={Colors.accent.default}
          size={24}
        />
      </View>
    </PressableOpacity>
    {showSeparator && <SeparatorLine />}
  </>
);

const styles = StyleSheet.create({
  wrapper: {
    height: scale(56),
    paddingRight: SIZE_8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonRestRowContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  activeOptionsCaption: {
    flex: 1,
    textAlign: 'right',
    paddingLeft: SIZE_32,
    color: Colors.accent,
  },
});

export default FilterSectionButton;
