// State-related component types
import { BaseComponentProps } from './base.types';

export interface ErrorStateProps extends BaseComponentProps {
  error: string;
  onRetry: () => void;
}

export interface LoadingStateProps extends BaseComponentProps {
  message?: string;
  isUpdating?: boolean;
}

export interface NoMatchesProps extends BaseComponentProps {
  hasError?: boolean;
}
