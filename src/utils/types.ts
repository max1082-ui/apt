import type {MessageOptions as RNFlashMessageOptions} from 'react-native-flash-message';

//#region SNACK
export type AppSnackBarDuration = 'short' | 'long';
export type AppSnackBarDurationConfig = {[K in AppSnackBarDuration]: number};

export type AppSnackRNFlashMessageOptionNames =
  | 'type'
  | 'icon'
  | 'autoHide'
  | 'onHide'
  | 'onPress'
  | 'onLongPress'
  | 'message'
  | 'description';
export type AppSnackRNFlashMessageOptions = Pick<
  RNFlashMessageOptions,
  AppSnackRNFlashMessageOptionNames
>;

export type AppSnackOptions = {
  duration?: AppSnackBarDuration;
} & AppSnackRNFlashMessageOptions;

export type AppSnackShowFn = (options: AppSnackOptions) => void;
//#endregion
