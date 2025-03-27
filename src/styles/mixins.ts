import {PixelRatio, Platform, Dimensions} from 'react-native';
import {getDeviceType} from 'react-native-device-info';
import {Node} from 'react-native-reanimated';

const {width: WINDOW_WIDTH, height: WINDOW_HEIGHT} = Dimensions.get('window');

//#region INTERFACE
interface ISpacingDimensions {
  [key: string]: number;
}

interface IOffset {
  width: number;
  height: number;
}
//#endregion

//#region HELPERS
const baseWidth = 376;
const baseHeight = 667;

const isTablet = getDeviceType() !== 'Handset';
//#endregion

//#region SCALING
export function scale(size: number): number {
  return isTablet
    ? size
    : PixelRatio.roundToNearestPixel((WINDOW_WIDTH / baseWidth) * size);
}
export function scaleVertical(size: number): number {
  return isTablet
    ? size
    : PixelRatio.roundToNearestPixel((WINDOW_HEIGHT / baseHeight) * size);
}
export function moderateScale(size: number, factor = 0.5): number {
  return size + (scale(size) - size) * factor;
}

export function moderateScaleVertical(size: number, factor = 0.5): number {
  return size + (scaleVertical(size) - size) * factor;
}

export function scaleFont(size: number) {
  return size * PixelRatio.getFontScale();
}
//#endregion

//#region SPACING
function dimensions(
  top: number,
  right: number = top,
  bottom: number = top,
  left: number = right,
  property: 'margin' | 'padding',
): ISpacingDimensions {
  let styles: ISpacingDimensions = {};

  styles[`${property}Top`] = top;
  styles[`${property}Right`] = right;
  styles[`${property}Bottom`] = bottom;
  styles[`${property}Left`] = left;

  return styles;
}

export function margin(
  top: number,
  right = top,
  bottom = top,
  left = right,
): ISpacingDimensions {
  return dimensions(top, right, bottom, left, 'margin');
}

export function padding(
  top: number,
  right = top,
  bottom = top,
  left = right,
): ISpacingDimensions {
  return dimensions(top, right, bottom, left, 'padding');
}
//#endregion

//#region STYLING
export function boxShadow(
  color: string,
  offset: IOffset = {height: 2, width: 2},
  radius: Node<number> | number = 8,
  opacity: number = 0.2,
) {
  return {
    ...Platform.select({
      ios: {
        shadowColor: color,
        shadowOffset: offset,
        shadowOpacity: opacity,
        shadowRadius: radius,
      },
      android: {
        elevation: radius,
      },
    }),
  };
}
//#endregion
