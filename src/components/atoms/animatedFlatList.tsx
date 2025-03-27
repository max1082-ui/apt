import Animated from 'react-native-reanimated';
import {FlatList, FlatListProps} from 'react-native';
import {ProductPreview} from '@types';

const AnimatedFlatList =
  Animated.createAnimatedComponent<FlatListProps<ProductPreview>>(FlatList);

export default AnimatedFlatList;
