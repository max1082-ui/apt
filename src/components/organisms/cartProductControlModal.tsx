// import React, {
//   useCallback,
//   useImperativeHandle,
//   forwardRef,
//   useRef,
//   useState,
//   useEffect,
// } from 'react';
// import {StyleSheet, View} from 'react-native';

// import Modal from 'react-native-modal';

// import type {ModalProps} from 'react-native-modal';

// import {
//   Icon,
//   SeparatorLine,
//   DragIndicator,
//   AccessoryButton,
// } from '@components/atoms';
// import {Colors} from '@styles/colors';

// import type {CartProduct} from '@types';
// import {CartProductQuantityController} from '@components/molecules';
// import {padding} from '@styles/mixins';
// import {SIZE_32, WINDOW_WIDTH, SIZE_16, SIZE_8} from '@styles/sizes';
// import {addToCartThunk, removeFromCartThunk} from '@state/cart';
// import {useFavoriteState, useThunkDispatch} from '@state/hooks';
// import {ForwardRefRenderFunction} from 'react';

// interface CartProductControlModalProps extends ModalProps {}

// interface CartProductControlModalHandle {
//   open: (productData: ControlModalProductData, initialQuantity: number) => void;
//   close: () => void;
// }

// // swipeDirection={['down']}
// //         useNativeDriverForBackdrop
// //         isVisible={controlsModalVisible}
// //         backdropColor={Colors.backdropDark}
// //         onSwipeComplete={dismissModal}
// //         onBackdropPress={dismissModal}
// //         onBackButtonPress={dismissModal}
// //         style={styles.modalBackdrop}>
// type ControlModalProductData = {id: number; name: string; quantity: number};

// const CartProductControlModal: ForwardRefRenderFunction<
//   CartProductControlModalHandle,
//   CartProductControlModalProps
// > = (_, ref) => {
//   const dispatch = useThunkDispatch();

//   const [modalVisible, setModalVisible] = useState<boolean>(false);

//   const [product, setProduct] = useState<ControlModalProductData | null>(null);
//   const [selectedQuantity, setSelectedQuantity] = useState<number>(0);

//   const showModal = useCallback(() => setModalVisible(true), []);
//   const dismissModal = useCallback(() => setModalVisible(false), []);

//   useImperativeHandle(ref, () => ({
//     open: (productData) => {
//       setProduct(productData);
//       setSelectedQuantity(productData.quantity);
//       showModal();
//     },
//     close: () => {
//       dismissModal();
//     },
//   }));

//   const onModalHide = useCallback(() => {
//     setProduct(null);
//     setSelectedQuantity(0);
//   }, []);

//   //#region CART
//   const timerRef = useRef<any>();
//   const killTimer = () => timerRef.current && clearTimeout(timerRef.current);

//   useEffect(() => {
//     killTimer();
//     if (product && selectedQuantity !== product.quantity) {
//       timerRef.current = setTimeout(async () => {
//         await dispatch(
//           addToCartThunk({
//             id: product.id,
//             name: product.name,
//             quantity: selectedQuantity,
//             quantityAction: 'set',
//             showSnack: false,
//           }),
//         );
//       }, 250);
//     }
//     return killTimer;
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [selectedQuantity]);

//   const onRemoveFromCartButtonPress = async () => {
//     if (product !== null) {
//       await dispatch(removeFromCartThunk({id: product.id, name: product.name}));
//     }
//   };
//   const onModalControlsRemoveFromCartButtonPress = () => {
//     setModalVisible(false);
//     setTimeout(() => {
//       onRemoveFromCartButtonPress();
//     }, 150);
//   };
//   //#endregion

//   //#region FAVORITE
//   const {isFavorite, favoriteProcessing, toggleFavoriteThunk} =
//     useFavoriteState(product?.id, product?.name);

//   const onFavoriteButtonPress = useCallback(() => {
//     if (!favoriteProcessing) {
//       dispatch(toggleFavoriteThunk);
//     }
//   }, [dispatch, favoriteProcessing, toggleFavoriteThunk]);
//   //#endregion
//   return (
//     <Modal
//       isVisible={modalVisible}
//       useNativeDriverForBackdrop
//       swipeDirection={['down']}
//       onModalHide={onModalHide}
//       backdropColor={Colors.backdropDark}
//       style={styles.modalBackdrop}>
//       <View style={styles.modalControlsContainer}>
//         <DragIndicator wrapperStyle={styles.dragIndicatorWrapper} />
//         <View style={styles.modalQuantityControllerContainer}>
//           <CartProductQuantityController
//             value={selectedQuantity}
//             addEnabled={addEnabled}
//             substractEnabled={substractEnabled}
//             onAddPress={onAddPress}
//             onSubstractPress={onSubstractPress}
//           />
//           <SeparatorLine color={Colors.gray4} />
//         </View>
//         <View style={styles.modalControlsButtonsRow}>
//           <AccessoryButton
//             onPress={onFavoriteButtonPress}
//             label={isFavorite ? 'В избранном' : 'В избранное'}
//             containerStyle={styles.moldalControlsButton}
//             AccessoryComponent={
//               <Icon
//                 size={22}
//                 name={isFavorite ? 'heart-3-fill' : 'heart-3-line'}
//                 color={Colors.black}
//                 style={styles.modalControlButtonIcon}
//               />
//             }
//           />
//           <AccessoryButton
//             onPress={onModalControlsRemoveFromCartButtonPress}
//             label={'Удалить'}
//             containerStyle={styles.moldalControlsButton}
//             AccessoryComponent={
//               <Icon size={24} name={'close-line'} color={Colors.black} />
//             }
//           />
//         </View>
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   //#region MODAL
//   modalBackdrop: {
//     justifyContent: 'flex-end',
//     margin: 0,
//   },
//   dragIndicatorWrapper: {
//     alignSelf: 'center',
//     marginBottom: SIZE_32,
//   },
//   modalControlsContainer: {
//     width: WINDOW_WIDTH,
//     ...padding(SIZE_16, SIZE_16, SIZE_32),
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     backgroundColor: Colors.white,
//   },
//   modalControlsButtonsRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   moldalControlsButton: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalControlButtonIcon: {
//     marginRight: SIZE_8,
//   },
//   //#endregion
// });

// export default forwardRef(CartProductControlModal);
