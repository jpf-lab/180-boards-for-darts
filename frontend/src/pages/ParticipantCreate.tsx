import FormTemplate from '../components/forms/FormTemplate.tsx';
import Headline from '../components/Headline.tsx';
import { createParticipantFromForm } from '../utils/participantHelper.ts';
import { participantFields, participantInitialValues } from '../config/participantFormConfig.ts';
import type { TournamentParticipant } from '../types/Tournament.ts';

type ParticipantCreateProps = {
  columns?: number;
};

export default function ParticipantCreate(props: Readonly<ParticipantCreateProps>) {
  async function handleSubmit(values: TournamentParticipant) {
    await createParticipantFromForm(values);
  }

  return (
    <>
      <Headline variant={'h1'}>Create Participant</Headline>
      <FormTemplate<TournamentParticipant>
        legend={'Participant'}
        fields={participantFields}
        initialValues={participantInitialValues}
        onSubmit={handleSubmit}
        columns={props.columns}
        successMessage={'Participant created.'}
      />
    </>
  );
}
