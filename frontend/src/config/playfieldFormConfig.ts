import type { FormFieldConfig } from '../components/forms/FormTemplate.tsx';
import type { TournamentPlayfield } from '../types/Tournament.ts';

export const playfieldInitialValues: TournamentPlayfield = {
  name: '',
};

export const playfieldFields: FormFieldConfig<TournamentPlayfield>[] = [
  {
    field: 'name',
    id: 'playfield-name',
    label: 'Playfield Name',
    type: 'text',
    placeholder: 'e.g. Board 1',
    required: true,
    minLength: 4,
    maxLength: 100,
    errormessage: 'Playfield name must be between 4 and 100 characters.',
  },
];
