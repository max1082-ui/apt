import type {PressableProps} from 'react-native';

export type PressableDisaledProp = PressableProps['disabled'];

//#region BUTTONS
export type AppButtonWidth = 'wide' | 'narrow';

export type ButtonType = 'primary' | 'secondary' | 'tretiary' | 'discard';

export interface ButtonBaseProps extends Pick<PressableProps, 'disabled'> {
  label: string;
  additionalText?: string;

  iconName?: string;
  type?: ButtonType;
}
//#endregion

//#region OPTIONS
export type SelectableOptionType = 'checkbox' | 'radio';
export type BaseOptionItem = {
  id: number | string;
  name: string;
};
//#endregion
