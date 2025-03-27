import React, {FC} from 'react';

import Icon from './icon';

import {DEFAULT_TABBAR_ICON_SIZE} from '@styles/sizes';

interface TabBarIconProps {
  name: string;
  iconSize?: number;
  color?: string;
}

const TabBarIcon: FC<TabBarIconProps> = ({name, iconSize, color}) => (
  <Icon name={name} size={iconSize || DEFAULT_TABBAR_ICON_SIZE} color={color} />
);

export default TabBarIcon;
