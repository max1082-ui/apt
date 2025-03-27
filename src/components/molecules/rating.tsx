import React, {FC} from 'react';
import {View, StyleSheet} from 'react-native';

import {Star} from '@components/atoms';

interface RatingProps {
  value: number;
  onRatingValueChange: (value: number) => void;
}

const stars = [1, 2, 3, 4, 5];

const Rating: FC<RatingProps> = ({value, onRatingValueChange}) => {
  return (
    <View style={style.container}>
      {stars.map((item, i) => (
        <Star
          key={i}
          starNumber={item}
          rating={value}
          onStarPress={() => onRatingValueChange(item)}
        />
      ))}
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});

export default Rating;
