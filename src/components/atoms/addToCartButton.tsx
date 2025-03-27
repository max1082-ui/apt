import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';

import Icon from './icon';
import Loader from './loader';
import AppText from './appText';
import PressableOpacity from './pressableOpacity';
import RequestUpdateIndicator from './requestUpdateIndicator';

import {useProductCartState} from '@state/hooks';

import type {UseProductCartStateArg} from '@state/types';

import {SIZE_8} from '@styles/sizes';
import {scale} from '@styles/mixins';
import {Colors} from '@styles/colors';
import {DEFAULT_DISABLED_OPACITY} from '@styles/common';

const BUTTON_SIZE = scale(36);

interface AddToCartButtonProps {
  productData: UseProductCartStateArg;
}

const AddToCartButton: FC<AddToCartButtonProps> = ({productData}) => {
  //#region CART
  const {
    inCart,
    selectedQuantity,

    addEnabled,
    substractEnabled,

    processing,

    addToCart,
    addCartQuantity,
    substractCartQuantity,
  } = useProductCartState(productData);
  //#endregion

  return inCart ? (
    <View style={styles.container}>
      <PressableOpacity
        hitSlop={20}
        disabled={processing || !substractEnabled}
        onPress={substractCartQuantity}
        style={styles.button}>
        <Icon
          name="subtract-line"
          color={Colors.white}
          size={21}
          style={styles.buttonIcon}
        />
      </PressableOpacity>
      <View style={styles.valueContainer}>
        <AppText
          type="control"
          color={Colors.gray7}
          wrapperStyle={[processing && {opacity: DEFAULT_DISABLED_OPACITY}]}>
          {selectedQuantity}
        </AppText>
        {processing && (
          <RequestUpdateIndicator size="small" color={Colors.gray5} />
        )}
      </View>
      <PressableOpacity
        hitSlop={20}
        disabled={processing || !addEnabled}
        onPress={addCartQuantity}
        style={styles.button}>
        <Icon
          name="add-line"
          color={Colors.white}
          size={21}
          style={styles.buttonIcon}
        />
      </PressableOpacity>
    </View>
  ) : (
    <PressableOpacity
      hitSlop={20}
      style={styles.button}
      disabled={processing || !addEnabled}
      onPress={addToCart}>
      {processing ? (
        <Loader color={Colors.white} />
      ) : (
        <Icon name="shopping-basket-2-line" size={20} color={Colors.white} />
      )}
    </PressableOpacity>
  );
};

const styles = StyleSheet.create({
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

export default AddToCartButton;
