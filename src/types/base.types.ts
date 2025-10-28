
export interface Option {
  value: string;
  label: string;
}
export interface BaseComponentProps {
  className?: string;
}

export interface BaseInteractiveProps {
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type NonEmptyArray<T> = [T, ...T[]];

export type MatchStatus = 'upcoming' | 'live' | 'finished';
export type SortOrder = 'asc' | 'desc';
export type SortBy = 'time' | 'league' | 'alphabetical' | 'result';

export type FilterKey =
  | 'league'
  | 'competition'
  | 'venue'
  | 'status'
  | 'sortBy'
  | 'sortOrder'
  | 'favoritesOnly'
  | 'search';

export type ChangeHandler<T = string> = (value: T) => void;

export type FilterChangeHandler<T extends Record<string, unknown>> = (
  key: keyof T,
  value: T[keyof T]
) => void;

export interface BaseApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface LoadingState {
  loading: boolean;
  error: string | null;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
}

export interface Timestamped {
  lastUpdated: string;
}
