import React, {FC} from 'react';
import {StyleSheet} from 'react-native';

import Icon from './icon';
import AppText from './appText';
import AppButton from './appButton';
import PressableOpacity from './pressableOpacity';
import RequestUpdateIndicator from './requestUpdateIndicator';

import {useProductCartState} from '@state/hooks';

import type {UseProductCartStateArg} from '@state/types';

import {scale} from '@styles/mixins';
import {Colors} from '@styles/colors';
import {Literals} from '@styles/typography';

interface AddToCartButtonDetailProps {
  productData: UseProductCartStateArg;
  onNavigateToCartButtonPress: () => void;
}

const AddToCartButtonDetail: FC<AddToCartButtonDetailProps> = ({
  productData,
  onNavigateToCartButtonPress,
}) => {
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

  //TODO implement internal inCart for smooth transitions

  return inCart ? (
    <>
      <PressableOpacity
        disabled={processing || !substractEnabled}
        onPress={substractCartQuantity}
        style={styles.countActionButton}>
        <Icon name="subtract-line" color={Colors.white} size={20} />
      </PressableOpacity>
      <PressableOpacity
        onPress={onNavigateToCartButtonPress}
        style={styles.quantityContainer}>
        <AppText type="h2" color={Colors.white}>
          {`В корзине: ${selectedQuantity} ${Literals.measure}`}
        </AppText>
        {processing && (
          <RequestUpdateIndicator size="small" color={Colors.white} />
        )}
      </PressableOpacity>
      <PressableOpacity
        disabled={processing || !addEnabled}
        onPress={addCartQuantity}
        style={styles.countActionButton}>
        <Icon name="add-line" color={Colors.white} size={20} />
      </PressableOpacity>
    </>
  ) : (
    <AppButton
      disabled={processing || !addEnabled}
      onPress={addToCart}
      label={'Добавить в корзину'}
    />
  );
};

const styles = StyleSheet.create({
  countActionButton: {
    backgroundColor: Colors.accent.default,
    width: scale(44),
    aspectRatio: 1 / 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  quantityContainer: {
    backgroundColor: Colors.accent.default,
    height: scale(44),
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: scale(240),
  },
});

export default AddToCartButtonDetail;
