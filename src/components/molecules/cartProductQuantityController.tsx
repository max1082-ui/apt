import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';

import {AppText, PressableOpacity, Icon} from '@components/atoms';

import {scale} from '@styles/mixins';
import {Colors} from '@styles/colors';
import {SIZE_16, SIZE_8} from '@styles/sizes';

type QuantityControllerProps = {
  value: number;

  addEnabled?: boolean;
  substractEnabled?: boolean;

  onAddPress: () => void;
  onSubstractPress: () => void;
};

const BUTTON_SIZE = scale(36);

const CartProductQuantityController: FC<QuantityControllerProps> = ({
  value,
  addEnabled,
  substractEnabled,
  onAddPress,
  onSubstractPress,
}) => {
  return (
    <View style={styles.wrapper}>
      <AppText type="h3">{'Изменить\nколичество'}</AppText>
      <View style={styles.container}>
        <PressableOpacity
          disabled={!substractEnabled}
          onPress={onSubstractPress}
          style={styles.button}>
          <Icon
            name="subtract-line"
            color={Colors.white}
            size={21}
            style={styles.buttonIcon}
          />
        </PressableOpacity>
        <View style={styles.valueContainer}>
          <AppText type="control" color={Colors.gray7}>
            {value}
          </AppText>
        </View>
        <PressableOpacity
          disabled={!addEnabled}
          onPress={onAddPress}
          style={styles.button}>
          <Icon
            name="add-line"
            color={Colors.white}
            size={21}
            style={styles.buttonIcon}
          />
        </PressableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    marginBottom: SIZE_16,
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  button: {
    aspectRatio: 1,
    width: BUTTON_SIZE,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: Colors.gray5,

    borderRadius: 4,
  },
  buttonIcon: {
    marginTop: 1,
    marginLeft: 1,
  },
  valueContainer: {
    width: scale(60),
    height: BUTTON_SIZE,

    marginHorizontal: SIZE_8 / 2,

    justifyContent: 'center',
    alignItems: 'center',

    borderWidth: 1,
    borderRadius: 4,
    borderColor: Colors.gray3,
  },
});

export default CartProductQuantityController;
