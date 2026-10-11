import EntityEdit from '../components/entity/EntityEdit.tsx';
import { getParticipantById, updateParticipantById } from '../utils/participantHelper.ts';
import { participantFields, participantInitialValues } from '../config/participantFormConfig.ts';
import type { TournamentParticipant } from '../types/Tournament.ts';

export default function ParticipantEdit(props: Readonly<{ columns?: number }>) {
  return (
    <EntityEdit<TournamentParticipant>
      entityName={'Participant'}
      fields={participantFields}
      initialValues={participantInitialValues}
      loadById={getParticipantById}
      onUpdate={updateParticipantById}
      columns={props.columns}
    />
  );
}
