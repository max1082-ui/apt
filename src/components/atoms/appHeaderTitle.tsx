import React, {FC} from 'react';
import {StyleSheet} from 'react-native';

import AppText from './appText';

import {SIZE_32} from '@styles/sizes';
import {Colors} from '@styles/colors';

interface AppHeaderTitleProps {
  title?: string;
  fullWidth?: boolean;
}

const AppHeaderTitle: FC<AppHeaderTitleProps> = ({title, fullWidth}) =>
  title ? (
    <AppText
      type="h2"
      numberOfLines={1}
      color={Colors.accent.default}
      wrapperStyle={[styles.wrapper, fullWidth && styles.fullWidth]}>
      {title}
    </AppText>
  ) : null;

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'center',
    marginHorizontal: SIZE_32,
  },
  fullWidth: {
    width: '100%',
  },
});

export default AppHeaderTitle;
