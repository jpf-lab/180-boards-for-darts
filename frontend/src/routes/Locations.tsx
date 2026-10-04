import { PencilIcon } from '@heroicons/react/24/solid';
import CustomButton from '../components/CustomButton.tsx';
import { type ReactNode, useEffect, useState } from 'react';
import type { TournamentLocation } from '../types/Tournament.ts';
import { TrashIcon } from '@heroicons/react/20/solid';
import Headline from '../components/Headline.tsx';
import Alert from '../components/Alert.tsx';
import LoadingText from '../components/LoadingText.tsx';
import TableOverview, {
  generateNewTableOverview,
  type TableOverviewProps,
} from '../components/tables/TableOverview.tsx';
import { getLocationOverview } from '../utils/locationHelper.ts';

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

export default function Locations() {
  const [tableOverview, setTableOverview] = useState<TableOverviewProps>({
    table: {
      header: {
        titles: ['Name', 'Street', 'Number', 'City', 'Postalcode', 'Owner', 'Phone', 'E-Mail'],
      },
      body: {
        data: [],
        buttons: [
          <div className={'flex items-center justify-center'}>
            <CustomButton>
              <PencilIcon className={'size-3'} title={'Edit'} />
            </CustomButton>
          </div>,
          <div className={'flex items-center justify-center'}>
            <CustomButton buttonstyle={'red'} title={'Delete'}>
              <TrashIcon className={'size-3'} />
            </CustomButton>
          </div>,
        ],
      },
    },
  });
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
      {!error && !loading && <TableOverview {...tableOverview} />}
    </>
  );
}
