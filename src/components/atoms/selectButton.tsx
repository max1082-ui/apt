import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';

import Icon from './icon';
import Loader from './loader';
import AppText from './appText';
import PressableOpacity from './pressableOpacity';

import {Colors} from '@styles/colors';
import {SIZE_24, SIZE_32} from '@styles/sizes';

interface SelectButtonProps {
  label: string;
  onPress: () => void;
  showLoadingIndicator?: boolean;
}

const SelectButton: FC<SelectButtonProps> = ({
  label,
  onPress,
  showLoadingIndicator = false,
}) => {
  return (
    <PressableOpacity style={styles.container} onPress={onPress}>
      <AppText type="productPrice">{label}</AppText>
      <View>
        {showLoadingIndicator ? (
          <Loader />
        ) : (
          <Icon
            name={'arrow-right-s-line'}
            color={Colors.accent.default}
            size={24}
          />
        )}
      </View>
    </PressableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: SIZE_24 + SIZE_32, //design height of text + paddings
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default SelectButton;
