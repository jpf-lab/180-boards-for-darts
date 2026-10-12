import EntityOverview from '../components/entity/EntityOverview.tsx';
import { deleteParticipantById, getParticipantOverview } from '../utils/participantHelper.ts';
import type { TournamentParticipant } from '../types/Tournament.ts';

const toRow = (item: TournamentParticipant) => [
  item.lastname || 'Not found',
  item.firstname || 'Not found',
];

const getLabel = (item: TournamentParticipant) =>
  `${item.firstname ?? ''} ${item.lastname ?? ''}`.trim();

export default function ParticipantsOverview() {
  return (
    <EntityOverview<TournamentParticipant>
      title={'Participants'}
      entityName={'Participant'}
      basePath={'/participants'}
      columnTitles={['Lastname', 'Firstname']}
      toRow={toRow}
      getLabel={getLabel}
      loadAll={getParticipantOverview}
      onDelete={deleteParticipantById}
    />
  );
}
