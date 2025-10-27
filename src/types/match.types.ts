export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  status: 'upcoming' | 'live' | 'finished';
  matchTime: string;
  league: string;
  competition: string;
  venue?: string;
  referee?: string;
}

export interface MatchListResponse {
  matches: Match[];
  lastUpdated: string;
}

export interface MatchFilters {
  league?: string;
  competition?: string;
  venue?: string;
  search?: string;
  status?: string;
  sortBy?: 'time' | 'league' | 'alphabetical' | 'result';
  sortOrder?: 'asc' | 'desc';
  favoritesOnly?: boolean;
}

export interface FavoritesState {
  favoriteMatches: Set<string>;
  addFavorite: (matchId: string) => void;
  removeFavorite: (matchId: string) => void;
  isFavorite: (matchId: string) => boolean;
  toggleFavorite: (matchId: string) => void;
}

export interface MatchState {
  matches: Match[];
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
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

export interface DropdownOption {
  value: string;
  label: string;
}

export interface CustomDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}
