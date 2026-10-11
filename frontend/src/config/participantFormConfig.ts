import type { FormFieldConfig } from '../components/forms/FormTemplate.tsx';
import type { TournamentParticipant } from '../types/Tournament.ts';

export const participantInitialValues: TournamentParticipant = {
  lastname: '',
  firstname: '',
};

export const participantFields: FormFieldConfig<TournamentParticipant>[] = [
  {
    field: 'firstname',
    id: 'participant-firstname',
    label: 'Firstname',
    type: 'text',
    placeholder: 'e.g. Max',
    required: true,
    minLength: 2,
    maxLength: 100,
    errormessage: 'Firstname must be between 2 and 100 characters.',
  },
  {
    field: 'lastname',
    id: 'participant-lastname',
    label: 'Lastname',
    type: 'text',
    placeholder: 'e.g. Mustermann',
    required: true,
    minLength: 2,
    maxLength: 100,
    errormessage: 'Lastname must be between 2 and 100 characters.',
  },
];
