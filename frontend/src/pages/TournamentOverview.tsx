import { TrophyIcon } from '@heroicons/react/24/solid';
import EntityOverview from '../components/entity/EntityOverview.tsx';
import LocationLink from '../components/LocationLink.tsx';
import { deleteTournamentById, getTournamentOverview } from '../utils/tournamentHelper.ts';
import type { TournamentOverviewItem } from '../types/Tournament.ts';

const toRow = (tournament: TournamentOverviewItem) => [
  tournament.name || 'Not found',
  tournament.datetime ? new Date(tournament.datetime).toLocaleString() : 'Not found',
  <LocationLink variant={'name'} {...tournament.location} />,
  tournament.participantIds?.length || 'Not found',
  tournament.playfieldIds?.length || 'Not found',
];

const getLabel = (tournament: TournamentOverviewItem) => tournament.name ?? '';

const rowLinks = [
  {
    title: 'Games',
    icon: <TrophyIcon className={'size-3'} />,
    to: (tournament: TournamentOverviewItem) => `/tournaments/${tournament.id}/games`,
  },
];

export default function TournamentOverview() {
  return (
    <EntityOverview<TournamentOverviewItem>
      title={'Tournaments'}
      entityName={'Tournament'}
      basePath={'/tournaments'}
      columnTitles={['Name', 'Date', 'Location', 'Participants', 'Playfields']}
      toRow={toRow}
      getLabel={getLabel}
      loadAll={getTournamentOverview}
      onDelete={deleteTournamentById}
      rowLinks={rowLinks}
    />
  );
}
