import {
  Option,
  ChangeHandler,
  FilterChangeHandler,
  BaseComponentProps,
} from './base.types';

export interface SearchBarProps extends BaseComponentProps {
  value: string;
  onChange: ChangeHandler;
  placeholder?: string;
}

export interface FilterDropdownProps extends BaseComponentProps {
  label: string;
  icon: string;
  options: Option[];
  value: string;
  onChange: ChangeHandler;
  placeholder: string;
}

export interface SortControlsProps {
  sortBy: string;
  sortOrder: string;
  onSortByChange: ChangeHandler;
  onSortOrderChange: ChangeHandler;
  sortByOptions: Option[];
}

export interface FilterValues extends Record<string, unknown> {
  league?: string;
  competition?: string;
  venue?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: string;
  favoritesOnly?: boolean;
}

export interface FiltersGridProps {
  filters: FilterValues;
  onFilterChange: FilterChangeHandler<FilterValues>;
  leagueOptions: Option[];
  competitionOptions: Option[];
  venueOptions: Option[];
  statusOptions: Option[];
  sortByOptions: Option[];
}
