import EntityCreate from '../components/entity/EntityCreate.tsx';
import { createParticipantFromForm } from '../utils/participantHelper.ts';
import { participantFields, participantInitialValues } from '../config/participantFormConfig.ts';
import type { TournamentParticipant } from '../types/Tournament.ts';

export default function ParticipantCreate(props: Readonly<{ columns?: number }>) {
  return (
    <EntityCreate<TournamentParticipant>
      entityName={'Participant'}
      fields={participantFields}
      initialValues={participantInitialValues}
      onCreate={createParticipantFromForm}
      columns={props.columns}
    />
  );
}
