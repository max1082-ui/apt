import {StyleSheet, Platform} from 'react-native';

import {Colors} from '@styles/colors';

import {DEFAULT_BUTTON_BORDER_RADIUS, SIZE_16, WINDOW_GUTTER} from './sizes';

export const DEFAULT_DISABLED_OPACITY = 0.5;
export const DEFAULT_PRESSED_OPACITY = 0.8;
export const DEFAULT_ACTIVE_OPACITY = 1;
export const DEFAULT_PRODUCT_IMAGE_BORDER_RADIUS = DEFAULT_BUTTON_BORDER_RADIUS;

export const CommonStyles = StyleSheet.create({
  defaultScreenCard: {
    backgroundColor: Colors.white,
  },
  defaultHeader: {
    borderBottomWidth: 0,
    borderBottomColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  defaultHeaderLeftContainer: {
    paddingLeft: Platform.select({ios: SIZE_16, android: SIZE_16}),
  },
  defaultHeaderRightContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SIZE_16,
  },
  positionAbsolute: {
    position: 'absolute',
  },
  fill: {
    flex: 1,
  },
  flexCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centrizedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gutter: {
    paddingHorizontal: WINDOW_GUTTER,
  },
  /**@deprecated use fill*/
  screenWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: WINDOW_GUTTER,
  },
  /**@deprecated */
  bottom15: {
    marginBottom: 15,
  },
  /**@deprecated */
  filter: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});
