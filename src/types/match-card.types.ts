import { BaseInteractiveProps, MatchStatus } from './base.types';

export interface MatchCardHeaderProps extends BaseInteractiveProps {
  league: string;
  status: string;
  matchId: string;
  isNew: boolean;
  isRemoved: boolean;
}

export interface MatchCardTeamsProps extends BaseInteractiveProps {
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
}

export interface MatchCardDetailsProps extends BaseInteractiveProps {
  matchTime: string;
  venue?: string;
  referee?: string;
}

export interface MatchCardData {
  id: string;
  league: string;
  status: MatchStatus;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  matchTime: string;
  venue?: string;
  referee?: string;
}

export interface MatchCardFrontProps {
  match: MatchCardData;
  isNew: boolean;
  isRemoved: boolean;
  onHeaderMouseEnter: () => void;
  onHeaderMouseLeave: () => void;
  onTeamsMouseEnter: () => void;
  onDetailsMouseEnter: () => void;
}

export interface MatchCardBackProps {
  isNew: boolean;
  isRemoved: boolean;
}
