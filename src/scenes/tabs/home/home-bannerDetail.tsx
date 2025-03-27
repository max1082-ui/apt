import React, {FC} from 'react';

import type {HomeBannerDetailScreenProps} from '@navigation/types';

import {ScenePlaceholder} from '@components/templates';

const HomeBannerDetailScreen: FC<HomeBannerDetailScreenProps> = ({
  route: {name},
}) => {
  return <ScenePlaceholder name={name} />;
};

export default HomeBannerDetailScreen;
