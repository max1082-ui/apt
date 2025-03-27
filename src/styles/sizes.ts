import {Dimensions} from 'react-native';
import {scale, scaleFont} from './mixins';

//#region SPACING
export const SIZE_8 = scale(8);
export const SIZE_16 = scale(16);
export const SIZE_24 = scale(24);
export const SIZE_32 = scale(32);
export const SIZE_40 = scale(40);
export const SIZE_48 = scale(48);
//#endregion

//#region DIMENSIONS
const {width, height} = Dimensions.get('window');
//#endregion

//#region DEFAULTS
//#region DEFAULT SIZES
export const WINDOW_WIDTH = width;
export const WINDOW_HEIGHT = height;
export const WINDOW_GUTTER = SIZE_16;

export const HEADER_TITLE_WIDTH = WINDOW_WIDTH * 0.7;

export const DEFAULT_BORDER_RADIUS = 8;
//#endregion

//#region PRODUCT
export const PRODUCT_LIST_SEPARATOR_HEIGHT = 1;
export const PRODUCT_LIST_ITEM_MIN_HEIGHT = scale(187);
//#endregion

//#region TEXT
export const DEFAULT_TEXT_SIZE = scaleFont(14);
//#endregion

//#region INPUTS
export const DEFAULT_INPUT_HEIGHT = SIZE_48;
export const DEFAULT_CHECKBOX_SIZE = scale(20);
//#endregion

//#region BUTTONS
export const DEFAULT_BUTTON_BORDER_RADIUS = DEFAULT_BORDER_RADIUS;
//#endregion

//#region TABBAR
export const DEFAULT_TABBAR_ICON_SIZE = scaleFont(28);
//#endregion

//#region MAP
export const MAP_MARKER_SIZE = scale(35);
//#endregion
//#endregion
