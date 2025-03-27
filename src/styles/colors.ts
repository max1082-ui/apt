import type {ColorTheme as RNFlashMessageColorTheme} from 'react-native-flash-message';

import type {ButtonType} from '@components/atoms/types';

import type {OrderStatusCode} from '@types';

export const Colors = {
  //#region BASE
  primary: {
    default: '#7C94AA',
    pressed: '#89A4BD',
  },
  secondary: {
    default: '#272D37',
    pressed: '#414A59',
  },
  accent: {
    default: '#48BC3E',
    pressed: '#46AF3D',
  },
  //#endregion

  //#region SYSTEM
  success: {
    default: '#38C976',
    pressed: '#5ED892',
  },
  warning: {
    default: '#FFAD52',
    pressed: '#F8AE5B',
  },
  error: {
    default: '#FE5050',
    pressed: '#FF7777',
  },
  link: {
    default: '#3EAEFF',
    pressed: '#71C3FF',
  },
  //#endregion

  //#region GRAYSCALE
  white: '#FFFFFF',
  gray1: '#F7FAFC',
  gray2: '#EDF2F7',
  gray3: '#E2E8F0',
  gray4: '#CBD5E0',
  gray5: '#A0AEC0',
  gray6: '#718096',
  gray7: '#4A5568',
  gray8: '#2D3748',
  gray9: '#1A202C',
  black: '#000000',
  //#endregion

  //#region BASIC
  basic1: '#91D78B',
  //#endregion

  //#region TRANSPARENT
  transparent: 'rgba(0,0,0,0)',
  //#endregion

  //#region BACKDROP
  backdropDark: 'rgba(0,0,0,.5)',
  backdropLight: 'rgba(255,255,255,.5)',
  //#endregion
};

//#region BUTTONS
export type ButtonColorConfigBase = {
  default: string;
  pressed: string;
  disabled: string;
};

export type ButtonColorConfigStyleProp =
  | 'color'
  | 'backgroundColor'
  | 'borderColor';

export type ButtonStateColors = {[K in ButtonColorConfigStyleProp]: string};

export type ButtonColorConfig = {
  [K in ButtonColorConfigStyleProp]: ButtonColorConfigBase;
};

export const PRIMARY_BUTTON_COLOR_CONFIG: ButtonColorConfig = {
  color: {
    default: Colors.white,
    pressed: Colors.white,
    disabled: Colors.gray7,
  },
  backgroundColor: {
    default: Colors.accent.default,
    pressed: Colors.accent.pressed,
    disabled: Colors.gray2,
  },
  borderColor: {
    default: Colors.accent.default,
    pressed: Colors.accent.pressed,
    disabled: Colors.gray2,
  },
};

export const SECONDARY_BUTTON_COLOR_CONFIG: ButtonColorConfig = {
  color: {
    default: Colors.gray5,
    pressed: Colors.gray4,
    disabled: Colors.gray5,
  },
  backgroundColor: {
    default: Colors.white,
    pressed: Colors.white,
    disabled: Colors.gray2,
  },
  borderColor: {
    default: Colors.gray5,
    pressed: Colors.gray4,
    disabled: Colors.gray5,
  },
};

export const TRETIARY_BUTTON_COLOR_CONFIG: ButtonColorConfig = {
  color: {
    default: Colors.black,
    pressed: Colors.gray7,
    disabled: Colors.gray6,
  },
  backgroundColor: {
    default: Colors.gray2,
    pressed: Colors.gray1,
    disabled: Colors.gray1,
  },
  borderColor: {
    default: Colors.gray2,
    pressed: Colors.gray1,
    disabled: Colors.gray1,
  },
};

export const DISCARD_BUTTON_COLOR_CONFIG: ButtonColorConfig = {
  color: {
    default: Colors.white,
    pressed: Colors.white,
    disabled: Colors.gray7,
  },
  backgroundColor: {
    default: Colors.error.default,
    pressed: Colors.error.pressed,
    disabled: Colors.gray2,
  },
  borderColor: {
    default: Colors.error.default,
    pressed: Colors.error.pressed,
    disabled: Colors.gray2,
  },
};

export const BUTTON_COLOR_CONFIG: {[K in ButtonType]: ButtonColorConfig} = {
  primary: PRIMARY_BUTTON_COLOR_CONFIG,
  secondary: SECONDARY_BUTTON_COLOR_CONFIG,
  tretiary: TRETIARY_BUTTON_COLOR_CONFIG,
  discard: DISCARD_BUTTON_COLOR_CONFIG,
};
//#endregion

//#region SNACK
export const APP_SNACK_COLOR_THEME: RNFlashMessageColorTheme = {
  info: Colors.basic1,
  success: Colors.success.default,
  warning: Colors.warning.default,
  danger: Colors.error.default,
};
//#endregion

//#region ORDER
export const STATUS_CODE_COLORS: {[K in OrderStatusCode]: {color: string}} = {
  A: {
    color: Colors.accent.default,
  },
  P: {
    color: Colors.warning.default,
  },
  D: {
    color: Colors.error.default,
  },
};
//#endregion

export type ColorType = keyof typeof Colors;
