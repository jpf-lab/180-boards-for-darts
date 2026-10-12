import type { FormFieldConfig } from '../components/forms/FormTemplate.tsx';
import type { TournamentParticipant } from '../types/Tournament.ts';
import type { SearchFormConfig } from '../components/forms/SearchForm.tsx';

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

export const participantSearchForm: SearchFormConfig = {
  legend: 'Search Participant',
  id: 'participant-search',
  label: 'Search term',
  placeholder: 'e.g. Max Mustermann',
  minLength: 2,
  errormessage: 'Please enter at least 2 characters.',
};
