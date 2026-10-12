import type { FormFieldConfig } from '../components/forms/FormTemplate.tsx';
import type { TournamentPlayfield } from '../types/Tournament.ts';
import type { SearchFormConfig } from '../components/forms/SearchForm.tsx';

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

export const playfieldSearchForm: SearchFormConfig = {
  legend: 'Search Playfield',
  id: 'playfield-search',
  label: 'Search term',
  placeholder: 'e.g. Board 1',
  minLength: 1,
  errormessage: 'Please enter a search term.',
};
