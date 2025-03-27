import React, {FC} from 'react';
import {Image, StyleSheet} from 'react-native';
import type {ImageSourcePropType, ViewStyle, StyleProp} from 'react-native';

import {AppText, FadeInView, PressableOpacity} from '@components/atoms';

import {scale} from '@styles/mixins';
import {SIZE_32} from '@styles/sizes';
import {Colors} from '@styles/colors';

interface DynamicListEmptyComponentProps {
  title: string;
  imageSource: ImageSourcePropType;
  description: string;
  buttonLabel: string;
  onButtonPress: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

const DynamicListEmptyComponent: FC<DynamicListEmptyComponentProps> = ({
  title,
  imageSource,
  description,
  buttonLabel,
  onButtonPress,
  containerStyle,
}) => (
  <FadeInView style={[styles.emptyContainer, containerStyle]}>
    <AppText type="h1" color={Colors.gray9}>
      {title}
    </AppText>
    <Image source={imageSource} style={styles.emptyCartImage} />
    <AppText type="bodyBold" color={Colors.gray7}>
      {description}
    </AppText>
    <PressableOpacity onPress={onButtonPress} style={{marginTop: scale(16)}}>
      <AppText type="link" color={Colors.gray6}>
        {buttonLabel}
      </AppText>
    </PressableOpacity>
  </FadeInView>
);

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCartImage: {
    marginVertical: SIZE_32,
    width: scale(248),
    height: scale(152),
    resizeMode: 'contain',
  },
});

export default DynamicListEmptyComponent;
