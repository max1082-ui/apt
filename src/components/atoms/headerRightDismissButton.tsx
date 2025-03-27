import React, {FC} from 'react';
import {PressableProps} from 'react-native';

import Icon from './icon';
import AppText from './appText';
import PressableOpacity from './pressableOpacity';

interface HeaderRightDismissButtonProps
  extends Pick<PressableProps, 'onPress'> {
  actionType: 'dismiss' | 'skip';
}

const HeaderRightDismissButton: FC<HeaderRightDismissButtonProps> = ({
  onPress,
  actionType = 'skip',
}) => (
  <PressableOpacity onPress={onPress}>
    {actionType === 'dismiss' ? (
      <Icon name="close-line" size={24} />
    ) : (
      <AppText>{'Пропустить'}</AppText>
    )}
  </PressableOpacity>
);

export default HeaderRightDismissButton;
