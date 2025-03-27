import {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {useSelector} from 'react-redux';

import useThunkDispatch from './useThunkDispatch';

import {addToCartThunk, removeFromCartThunk} from '@state/cart';

import type {
  CombinedState,
  UseProductCartStateArg,
  SelectedProductCartState,
  UseProductCartStateReturns,
} from '@state/types';

//TODO remove comments below

const useProductCartState = ({
  id,
  name,
  inStock,
  amount = 0,
  sourceQuantity,
}: UseProductCartStateArg) => {
  //#region STORE
  const dispatch = useThunkDispatch();

  const {cartQuantity} = useSelector<CombinedState, SelectedProductCartState>(
    ({cart: cartState}) => ({
      cartQuantity: cartState.data[id] || 0,
    }),
    (prev, next) => prev.cartQuantity === next.cartQuantity,
  );

  const inCart = useMemo(
    () => (cartQuantity > 0 ? true : false),
    [cartQuantity],
  );
  //#endregion

  //#region BACKEND QUANTITY //TODO TEST
  useEffect(() => {
    if (sourceQuantity && sourceQuantity !== cartQuantity) {
      dispatch(
        addToCartThunk({
          id,
          quantity: sourceQuantity,
          quantityAction: 'set',
          snack: false,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceQuantity]);
  //#endregion

  //#region QUANTITY CONTROL
  const [selectedQuantity, setSelectedQuantity] =
    useState<number>(cartQuantity);

  useEffect(() => {
    setSelectedQuantity(cartQuantity);
  }, [cartQuantity]);

  const addEnabled = useMemo<boolean>(
    () => (inStock && !!amount && selectedQuantity < amount ? true : false),
    [amount, inStock, selectedQuantity],
  );
  const addCartQuantity = useCallback(
    () => setSelectedQuantity((current) => current + 1),
    [],
  );
  const substractEnabled = useMemo<boolean>(
    () => (inStock && selectedQuantity > 1 ? true : false),
    [inStock, selectedQuantity],
  );
  const substractCartQuantity = useCallback(
    () => setSelectedQuantity((current) => current - 1),
    [],
  );

  // const [processing, setProcessing] = useState<boolean>(false);
  const [processing] = useState<boolean>(false);

  const timerRef = useRef<any>();
  const killTimer = () => timerRef.current && clearTimeout(timerRef.current);

  useEffect(() => {
    killTimer();
    if (selectedQuantity !== cartQuantity) {
      timerRef.current = setTimeout(async () => {
        // setProcessing(true);
        // await stall(1500);
        await dispatch(
          addToCartThunk({
            id,
            name,
            quantity: selectedQuantity,
            quantityAction: 'set',
            snack: false,
          }),
        );
        // setProcessing(false);
      }, 250);
    }
    return killTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedQuantity]);
  //#endregion

  //#region CART
  const addToCart = useCallback(async () => {
    // setProcessing(true);
    // await stall(1500);
    await dispatch(
      addToCartThunk({
        id,
        name,
        quantity: 1,
        // snack: false,
      }),
    );
    // setProcessing(false);
  }, [dispatch, id, name]);

  const removeFromCart = useCallback(async () => {
    await dispatch(removeFromCartThunk({id, name}));
  }, [dispatch, id, name]);
  //#endregion

  return useMemo<UseProductCartStateReturns>(
    () => ({
      inCart,
      selectedQuantity,

      addEnabled,
      substractEnabled,

      processing,

      addToCart,
      addCartQuantity,
      substractCartQuantity,
      removeFromCart,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [addEnabled, inCart, selectedQuantity, substractEnabled, processing],
  );
};

export default useProductCartState;
