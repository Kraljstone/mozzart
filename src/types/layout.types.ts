import { BaseComponentProps } from './base.types';

export interface HeaderProps extends BaseComponentProps {
  isConnected: boolean;
  lastUpdated?: number;
  onRefresh: () => void;
  onLogout: () => void;
}
