import { type ReactNode, useEffect, useState } from 'react';
import type { TournamentLocation } from '../types/Tournament.ts';
import Headline from '../components/Headline.tsx';
import Alert from '../components/Alert.tsx';
import LoadingText from '../components/LoadingText.tsx';
import TableOverview, {
  generateNewTableOverview,
  getTableOverviewDefault,
  type TableOverviewProps,
} from '../components/tables/TableOverview.tsx';
import { getLocationOverview } from '../utils/locationHelper.ts';
import { SquaresPlusIcon } from '@heroicons/react/24/solid';
import CustomButton from '../components/CustomButton.tsx';

function toRows(items?: TournamentLocation[]): ReactNode[][] | [] {
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
      'City',
      'Postalcode',
      'Owner',
      'Phone',
      'E-Mail',
    ])
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadLocations() {
    setLoading(true);
    setError(null);

    const locations = await getLocationOverview();

    if (!locations) {
      setError('Failed to load locations.');
      setLoading(false);
      return;
    }

    setTableOverview(generateNewTableOverview(tableOverview, toRows(locations)));

    setLoading(false);
  }

  useEffect(() => {
    void loadLocations();
  }, []);

  return (
    <>
      <Headline variant={'h1'}>Locations</Headline>
      {error && (
        <Alert variant={'error'}>
          <span>{error}</span>
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
          <TableOverview {...tableOverview} />
        </>
      )}
    </>
  );
}
