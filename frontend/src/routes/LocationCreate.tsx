import FormCreate, { type FormFieldConfig } from '../components/forms/FormCreate.tsx';
import type { TournamentLocation } from '../types/Tournament.ts';
import Headline from '../components/Headline.tsx';

const initialValues: TournamentLocation = {
  name: '',
  street: '',
  number: '',
  city: '',
  postalcode: '',
  owner: '',
  contactPhone: '',
  contactMail: '',
};

const locationFields: FormFieldConfig<TournamentLocation>[] = [
  {
    field: 'name',
    id: 'location-name',
    label: 'Location Name',
    type: 'text',
    placeholder: 'e.g. Dart Club Berlin',
    required: true,
    minLength: 2,
    maxLength: 100,
    errorMessage: 'Location name must be between 2 and 100 characters.',
  },
  {
    field: 'owner',
    id: 'owner',
    label: 'Owner',
    type: 'text',
    placeholder: 'e.g. Max Mustermann',
    maxLength: 100,
    errorMessage: 'Owner must be at most 100 characters.',
  },
  {
    field: 'contactPhone',
    id: 'contactPhone',
    label: 'Contact Phone',
    type: 'tel',
    placeholder: 'e.g. +49 30 123456',
    pattern: '[0-9+\\(\\)\\/\\s\\-]{5,}',
    title: 'Digits, spaces and + ( ) / - allowed',
    errorMessage: 'Please enter a valid phone number.',
  },
  {
    field: 'contactMail',
    id: 'contactMail',
    label: 'Contact Mail',
    type: 'email',
    placeholder: 'e.g. info@example.com',
    errorMessage: 'Please enter a valid email address.',
  },
  {
    field: 'street',
    id: 'street',
    label: 'Street',
    type: 'text',
    placeholder: 'e.g. Main Street',
    required: true,
    minLength: 2,
    pattern: '^(?!\\d+$).+',
    errorMessage: 'Street must be at least 2 characters and not only numbers.',
  },
  {
    field: 'number',
    id: 'number',
    label: 'House Number',
    type: 'text',
    placeholder: 'e.g. 12a',
    required: true,
    pattern: '^[0-9]+[a-zA-Z]?$',
    title: 'Digits, optionally followed by one letter',
    errorMessage: 'Use digits, optionally followed by one letter (e.g. 12 or 12a).',
  },
  {
    field: 'city',
    id: 'city',
    label: 'City',
    type: 'text',
    placeholder: 'e.g. Berlin',
    required: true,
    minLength: 2,
    pattern: '^(?!\\d+$).+',
    errorMessage: 'City must be at least 2 characters and not only numbers.',
  },
  {
    field: 'postalcode',
    id: 'postalcode',
    label: 'Postal Code',
    type: 'text',
    placeholder: 'e.g. 10115',
    required: true,
    pattern: '[0-9]{5}',
    maxLength: 5,
    inputMode: 'numeric',
    title: 'German postal code: exactly 5 digits',
    errorMessage: 'Must be exactly 5 digits.',
  },
];

export default function LocationCreate() {
  function onSubmit() {
    console.log('onSubmit');
  }

  return (
    <>
      <Headline variant={'h2'}>Create Location</Headline>
      <FormCreate<TournamentLocation>
        legend={'Location'}
        fields={locationFields}
        initialValues={initialValues}
        onSubmit={onSubmit}
        columns={2}
      />
    </>
  );
}
