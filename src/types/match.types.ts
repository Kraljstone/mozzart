import {
  MatchStatus,
  SortBy,
  SortOrder,
  Timestamped,
  ChangeHandler,
} from './base.types';

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  status: MatchStatus;
  matchTime: string;
  league: string;
  competition: string;
  venue?: string;
  referee?: string;
}

export interface MatchListResponse extends Timestamped {
  matches: Match[];
}

export interface MatchFilters {
  league?: string;
  competition?: string;
  venue?: string;
  search?: string;
  status?: string;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
  favoritesOnly?: boolean;
}

export interface FavoritesState {
  favoriteMatches: Set<string>;
  addFavorite: ChangeHandler;
  removeFavorite: ChangeHandler;
  isFavorite: (matchId: string) => boolean;
  toggleFavorite: ChangeHandler;
}

export interface MatchState extends Timestamped {
  matches: Match[];
  loading: boolean;
  error: string | null;
  newMatches: Set<string>;
  removedMatches: Set<string>;
  clearIndicatorsAt?: number;
  retryAt?: number;
  shouldRetry?: boolean;
}

export interface MatchCardProps {
  match: Match;
  isNew?: boolean;
  isRemoved?: boolean;
}

export interface MatchesSectionProps {
  matches: Match[];
  newMatches: Set<string>;
  removedMatches: Set<string>;
}

export interface MatchFiltersProps {
  filters: MatchFilters;
  onFiltersChange: (filters: Partial<MatchFilters>) => void;
  availableLeagues: string[];
  availableCompetitions: string[];
  availableVenues: string[];
  availableStatuses: string[];
}

export interface VirtualizedMatchListProps {
  matches: Match[];
  newMatches: Set<string>;
  removedMatches: Set<string>;
  height?: number;
}
