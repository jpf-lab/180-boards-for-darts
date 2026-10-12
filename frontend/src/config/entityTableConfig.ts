import type {
  TournamentLocation,
  TournamentParticipant,
  TournamentPlayfield,
} from '../types/Tournament.ts';

const NOT_FOUND = 'Not found';

export const locationColumnTitles = [
  'Name',
  'Street',
  'Number',
  'Postalcode',
  'City',
  'Owner',
  'Phone',
  'E-Mail',
];
export const locationToRow = (item: TournamentLocation) => [
  item.name || NOT_FOUND,
  item.street || NOT_FOUND,
  item.number || NOT_FOUND,
  item.postalcode || NOT_FOUND,
  item.city || NOT_FOUND,
  item.owner || NOT_FOUND,
  item.contactPhone || NOT_FOUND,
  item.contactMail || NOT_FOUND,
];

export const participantColumnTitles = ['Lastname', 'Firstname'];
export const participantToRow = (item: TournamentParticipant) => [
  item.lastname || NOT_FOUND,
  item.firstname || NOT_FOUND,
];

export const playfieldColumnTitles = ['Name'];
export const playfieldToRow = (item: TournamentPlayfield) => [item.name || NOT_FOUND];
