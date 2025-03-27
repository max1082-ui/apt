import {StyleSheet} from 'react-native';

import {scaleFont} from './mixins';

export const fontFamilyLight = 'Inter-Light';
export const fontFamilyRegular = 'Inter-Regular';
export const fontFamilyMedium = 'Inter-Medium';
export const fontFamilySemiBold = 'Inter-SemiBold';
export const fontFamilyBold = 'Inter-Bold';
export const fontFamilyExtraBold = 'Inter-ExtraBold';

export const Fonts = {
  light: {fontFamily: fontFamilyLight},
  regular: {fontFamily: fontFamilyRegular},
  medium: {fontFamily: fontFamilyMedium},
  semiBold: {fontFamily: fontFamilySemiBold},
  bold: {fontFamily: fontFamilyBold},
  extraBold: {fontFamily: fontFamilyExtraBold},
};
export type FontType = keyof typeof Fonts;

export const Literals = {
  currency: '₽',
  measure: 'шт',
  distance: 'км',
};

export const AppTextStyles = StyleSheet.create({
  //#region TITLE
  h1: {
    ...Fonts.extraBold,

    fontSize: scaleFont(24),
    lineHeight: scaleFont(34),
  },
  h2: {
    ...Fonts.semiBold,

    fontSize: scaleFont(16),
    lineHeight: scaleFont(24),
  },
  h3: {
    ...Fonts.bold,

    fontSize: scaleFont(17),
    lineHeight: scaleFont(20),
  },
  modalTitle: {
    ...Fonts.bold,

    fontSize: scaleFont(24),
    lineHeight: scaleFont(34),
  },
  //#endregion

  //#region BODY
  bodyRegular: {
    ...Fonts.regular,

    fontSize: scaleFont(15),
    lineHeight: scaleFont(22),
  },
  bodyLight: {
    ...Fonts.light,

    fontSize: scaleFont(15),
    lineHeight: scaleFont(22),
  },
  bodyBold: {
    ...Fonts.medium,

    fontSize: scaleFont(15),
    lineHeight: scaleFont(22),
  },
  bodyHighlighted: {
    ...Fonts.medium,

    fontSize: scaleFont(15),
    lineHeight: scaleFont(22),

    textDecorationLine: 'underline',
  },
  //#endregion

  //#region SYSTEM
  control: {
    ...Fonts.medium,

    fontSize: scaleFont(15),
    lineHeight: scaleFont(22),
  },
  controlLabel: {
    ...Fonts.regular,

    fontSize: scaleFont(13),
    lineHeight: scaleFont(22),
  },
  number: {
    ...Fonts.regular,

    fontSize: scaleFont(17),
    lineHeight: scaleFont(22),
  },
  cell: {
    ...Fonts.medium,

    fontSize: scaleFont(18),
    lineHeight: scaleFont(22),
  },
  tabBarLabel: {
    ...Fonts.medium,

    fontSize: scaleFont(10),
    // lineHeight: scaleFont(17),
  },
  small: {
    ...Fonts.medium,
    fontSize: scaleFont(13),
    lineHeight: scaleFont(16),
  },
  error: {
    ...Fonts.regular,

    fontSize: scaleFont(13),
    lineHeight: scaleFont(16),
  },
  link: {
    ...Fonts.medium,

    fontSize: scaleFont(13),
    lineHeight: scaleFont(16),

    textDecorationLine: 'underline',
  },
  //#endregion

  //#region PRODUCT
  productNameDetail: {
    ...Fonts.semiBold,

    fontSize: scaleFont(16),
    lineHeight: scaleFont(19),
  },
  productNameList: {
    ...Fonts.medium,

    fontSize: scaleFont(15),
    lineHeight: scaleFont(18),
  },
  productName: {
    ...Fonts.regular,

    fontSize: scaleFont(13),
    lineHeight: scaleFont(16),
  },
  productPrice: {
    ...Fonts.semiBold,

    fontSize: scaleFont(16),
    lineHeight: scaleFont(17),
  },
  productPriceFull: {
    ...Fonts.semiBold,

    fontSize: scaleFont(22),
    lineHeight: scaleFont(32),
  },
  productPriceDiscount: {
    ...Fonts.regular,

    fontSize: scaleFont(13),
    lineHeight: scaleFont(16),

    textDecorationLine: 'line-through',
  },
  //#endregion
});

export type AppTextStyleType = keyof typeof AppTextStyles;
