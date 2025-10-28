import { VirtualizedMatchList } from './VirtualizedMatchList';
import {
  ScrollProgressProvider,
  ScrollProgress,
  ScrollProgressContainer,
} from '../ui/ScrollProgress';
import { MatchesSectionProps } from '@/types/match.types';

export const MatchesSection = ({
  matches,
  newMatches,
  removedMatches,
}: MatchesSectionProps) => {
  return (
    <ScrollProgressProvider>
      <ScrollProgress mode='width' className='local-scroll-progress h-1' />
      <ScrollProgressContainer className='relative'>
        <VirtualizedMatchList
          matches={matches}
          newMatches={newMatches}
          removedMatches={removedMatches}
          height={700}
        />
      </ScrollProgressContainer>
    </ScrollProgressProvider>
  );
};
