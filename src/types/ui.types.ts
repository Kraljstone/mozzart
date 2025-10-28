// UI component types
import { Option, ChangeHandler, BaseComponentProps } from './base.types';

export interface CustomDropdownProps extends BaseComponentProps {
  options: Option[];
  value: string;
  onChange: ChangeHandler;
  placeholder?: string;
}

export type DropdownOption = Option;
