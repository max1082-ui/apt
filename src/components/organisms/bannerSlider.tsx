import React, {FC} from 'react';
import {FlatList, Pressable, StyleSheet, View} from 'react-native';

import {ProgressiveImage} from '@components/atoms';

import {scale} from '@styles/mixins';
import {SIZE_16} from '@styles/sizes';
import {SIZE_8, WINDOW_WIDTH} from '@styles/sizes';

import type {Banner} from '@types';

interface BannerSliderProps {
  dataSource: Banner[];
  onPress: (item: Banner) => void;
}

const CARD_WIDTH = WINDOW_WIDTH - 2 * SIZE_16;
const CARD_HEIGHT = scale(248);
const SNAP_INTERVAL = CARD_WIDTH + SIZE_8;

const BannerSlider: FC<BannerSliderProps> = ({dataSource, onPress}) => (
  <View>
    <FlatList
      data={dataSource}
      renderItem={({item}) => (
        <Pressable
          disabled //TODO banner detail
          onPress={() => onPress(item)}
          style={styles.slideWrapper}>
          <ProgressiveImage
            source={{uri: item.image}}
            style={styles.sliderItem}
            resizeMode="cover"
          />
        </Pressable>
      )}
      keyExtractor={(_, index) => index.toString()}
      horizontal
      contentContainerStyle={styles.carousel}
      showsHorizontalScrollIndicator={false}
      snapToInterval={SNAP_INTERVAL}
      decelerationRate="fast"
      getItemLayout={(_, index) => ({
        length: CARD_WIDTH + SIZE_16,
        offset: index * SNAP_INTERVAL,
        index,
      })}
    />
  </View>
);

const styles = StyleSheet.create({
  carousel: {
    paddingTop: SIZE_16,
    paddingHorizontal: scale(12),
  },
  slideWrapper: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginHorizontal: scale(4),
    borderRadius: 16,
    overflow: 'hidden',
  },
  sliderItem: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
});

export default BannerSlider;
