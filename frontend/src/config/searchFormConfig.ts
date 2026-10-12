import type { SearchFormConfig } from '../components/forms/SearchForm.tsx';

export const locationSearchForm: SearchFormConfig = {
  legend: 'Search Location',
  id: 'location-search',
  label: 'Search term',
  placeholder: 'e.g. Berlin, 10115 or Dart Club',
  minLength: 2,
  errormessage: 'Please enter at least 2 characters.',
};

export const participantSearchForm: SearchFormConfig = {
  legend: 'Search Participant',
  id: 'participant-search',
  label: 'Search term',
  placeholder: 'e.g. Max Mustermann',
  minLength: 2,
  errormessage: 'Please enter at least 2 characters.',
};

export const playfieldSearchForm: SearchFormConfig = {
  legend: 'Search Playfield',
  id: 'playfield-search',
  label: 'Search term',
  placeholder: 'e.g. Board 1',
  minLength: 1,
  errormessage: 'Please enter a search term.',
};
