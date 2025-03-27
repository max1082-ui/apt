import {useSelector} from 'react-redux';

import {CombinedState} from '@state/types';

const CartStackBadgeQuantity = (): number | undefined => {
  const cartQuantity = useSelector<CombinedState, number>(
    ({cart: {data}}) => Object.keys(data).length,
  );
  return cartQuantity > 0 ? cartQuantity : undefined;
};

export default CartStackBadgeQuantity;
