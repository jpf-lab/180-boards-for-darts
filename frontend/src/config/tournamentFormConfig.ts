import type { FormFieldConfig } from '../components/forms/FormTemplate.tsx';
import { getMinDateTime } from '../utils/dateTime.ts';

export type TournamentFormValues = {
  name: string;
  datetime: string;
};

export const tournamentInitialValues: TournamentFormValues = {
  name: '',
  datetime: '',
};

export const tournamentFields: FormFieldConfig<TournamentFormValues>[] = [
  {
    field: 'name',
    id: 'tournament-name',
    label: 'Name',
    type: 'text',
    placeholder: 'e.g. Summer Dart Championship',
    required: true,
    minLength: 3,
    maxLength: 100,
    errormessage: 'Name must be between 3 and 100 characters.',
  },
  {
    field: 'datetime',
    id: 'tournament-datetime',
    label: 'Date & Time',
    type: 'datetime-local',
    required: true,
    min: getMinDateTime(),
    errormessage: 'Please select a date and time in the future.',
  },
];
