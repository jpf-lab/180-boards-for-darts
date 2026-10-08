import { type ReactNode, useEffect, useState } from 'react';
import type { TournamentLocation } from '../types/Tournament.ts';
import Headline from '../components/Headline.tsx';
import Alert from '../components/Alert.tsx';
import LoadingText from '../components/LoadingText.tsx';
import TableOverview, {
  generateNewTableOverview,
  getButtonsDefault,
  getTableOverviewDefault,
  type TableOverviewProps,
} from '../components/tables/TableOverview.tsx';
import { deleteLocationById, getLocationOverview } from '../utils/locationHelper.ts';
import { SquaresPlusIcon } from '@heroicons/react/24/solid';
import CustomButton from '../components/CustomButton.tsx';

function toRows(items?: TournamentLocation[]): ReactNode[][] {
  return items
    ? items.map((item) => [
        item.name || 'Not found',
        item.street || 'Not found',
        item.number || 'Not found',
        item.postalcode || 'Not found',
        item.city || 'Not found',
        item.owner || 'Not found',
        item.contactPhone || 'Not found',
        item.contactMail || 'Not found',
      ])
    : [];
}

export default function LocationOverview() {
  const [tableOverview, setTableOverview] = useState<TableOverviewProps>(
    getTableOverviewDefault([
      'Name',
      'Street',
      'Number',
      'Postalcode',
      'City',
      'Owner',
      'Phone',
      'E-Mail',
    ])
  );
  const [locations, setLocations] = useState<TournamentLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function loadLocations() {
    setLoading(true);
    setError(null);

    const result = await getLocationOverview();

    if (!result) {
      setError('Failed to load locations.');
      setLoading(false);
      return;
    }

    setLocations(result);
    setTableOverview((prev) => generateNewTableOverview(prev, toRows(result)));
    setLoading(false);
  }

  async function handleDelete(rowIndex: number) {
    const location = locations[rowIndex];
    if (!location) return;
    if (!window.confirm(`Delete location "${location.name ?? ''}"?`)) return;

    try {
      await deleteLocationById(location.id);
      await loadLocations();
      setSuccess(`Location "${location.name ?? ''}" deleted.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete location.');
    }
  }

  useEffect(() => {
    void loadLocations();
  }, []);

  return (
    <>
      <Headline variant={'h1'}>Locations</Headline>
      {error && (
        <Alert variant={'error'} onClose={() => setError(null)}>
          <span>{error}</span>
        </Alert>
      )}
      {success && (
        <Alert variant={'success'} onClose={() => setSuccess(null)}>
          <span>{success}</span>
        </Alert>
      )}
      {loading && (
        <div>
          <LoadingText />
        </div>
      )}
      {!error && !loading && (
        <>
          <CustomButton
            variant={'link'}
            to={'/locations/new'}
            buttonstyle={'green'}
            className={'mb-4'}
          >
            <SquaresPlusIcon className={'size-6 inline-block mr-2'} />
            <span>Create New Location</span>
          </CustomButton>
          <TableOverview
            table={{
              ...tableOverview.table,
              body: {
                ...tableOverview.table.body,
                buttons: getButtonsDefault({ delete: handleDelete }),
              },
            }}
          />
        </>
      )}
    </>
  );
}
