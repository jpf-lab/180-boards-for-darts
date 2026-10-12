import EntityOverview from '../components/entity/EntityOverview.tsx';
import { deleteLocationById, getLocationOverview } from '../utils/locationHelper.ts';
import type { TournamentLocation } from '../types/Tournament.ts';

const NOT_FOUND = 'Not found';

const toRow = (item: TournamentLocation) => [
  item.name || NOT_FOUND,
  item.street || NOT_FOUND,
  item.number || NOT_FOUND,
  item.postalcode || NOT_FOUND,
  item.city || NOT_FOUND,
  item.owner || NOT_FOUND,
  item.contactPhone || NOT_FOUND,
  item.contactMail || NOT_FOUND,
];

const getLabel = (item: TournamentLocation) => item.name ?? '';

export default function LocationOverview() {
  return (
    <EntityOverview<TournamentLocation>
      title={'Locations'}
      entityName={'Location'}
      basePath={'/locations'}
      columnTitles={['Name', 'Street', 'Number', 'Postalcode', 'City', 'Owner', 'Phone', 'E-Mail']}
      toRow={toRow}
      getLabel={getLabel}
      loadAll={getLocationOverview}
      onDelete={deleteLocationById}
    />
  );
}
