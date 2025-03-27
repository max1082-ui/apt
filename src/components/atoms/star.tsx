import React, {FC} from 'react';
import {StyleSheet} from 'react-native';

import Icon from './icon';
import PressableOpacity from './pressableOpacity';

import {scale} from '@styles/mixins';
import {Colors} from '@styles/colors';

interface StarProps {
  starNumber: number;
  rating: number;
  onStarPress: () => void;
}

const Star: FC<StarProps> = ({rating, starNumber, onStarPress}) => {
  return (
    <PressableOpacity hitSlop={4} style={styles.star} onPress={onStarPress}>
      <Icon
        name={'star-fill'}
        size={scale(25)}
        color={rating >= starNumber ? Colors.warning.pressed : Colors.gray4}
      />
    </PressableOpacity>
  );
};

const styles = StyleSheet.create({
  star: {
    marginLeft: scale(6),
  },
});

export default Star;
