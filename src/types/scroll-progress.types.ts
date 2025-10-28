import { ReactNode } from 'react';
import { BaseComponentProps } from './base.types';

export interface ScrollProgressProviderProps {
  children: ReactNode;
  global?: boolean;
  direction?: 'horizontal' | 'vertical';
}

export interface ScrollProgressProps extends BaseComponentProps {
  asChild?: boolean;
  mode?: 'width' | 'height' | 'scaleY' | 'scaleX';
}

export interface ScrollProgressContainerProps extends BaseComponentProps {
  children: ReactNode;
  asChild?: boolean;
}

export interface ScrollProgressContextType {
  containerRef: React.RefObject<HTMLElement | null>;
}
