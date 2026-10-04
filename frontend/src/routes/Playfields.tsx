import { PencilIcon } from '@heroicons/react/24/solid';
import CustomButton from '../components/CustomButton.tsx';
import { type ReactNode, useEffect, useState } from 'react';
import type { TournamentOverviewItem } from '../types/Tournament.ts';
import { TrashIcon } from '@heroicons/react/20/solid';
import Headline from '../components/Headline.tsx';
import Alert from '../components/Alert.tsx';
import LoadingText from '../components/LoadingText.tsx';
import TableOverview, {
  generateNewTableOverview,
  type TableOverviewProps,
} from '../components/tables/TableOverview.tsx';
import { getPlayfieldOverview } from '../utils/playfieldHelper.ts';

function toRows(items?: TournamentOverviewItem[]): ReactNode[][] | [] {
  return items ? items.map((item) => [item.name || 'Not found']) : [];
}

export default function Playfields() {
  const [tableOverview, setTableOverview] = useState<TableOverviewProps>({
    table: {
      header: {
        titles: ['Name'],
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

  async function loadPlayfields() {
    setLoading(true);
    setError(null);

    const tournaments = await getPlayfieldOverview();

    if (!tournaments) {
      setError('Failed to load tournaments.');
      setLoading(false);
      return;
    }

    setTableOverview(generateNewTableOverview(tableOverview, toRows(tournaments)));

    setLoading(false);
  }

  useEffect(() => {
    void loadPlayfields();
  }, []);

  return (
    <>
      <Headline variant={'h1'}>Playfields</Headline>
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
