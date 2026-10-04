import { PencilIcon } from '@heroicons/react/24/solid';
import CustomButton from '../components/CustomButton.tsx';
import { type ReactNode, useEffect, useState } from 'react';
import type { TournamentParticipant } from '../types/Tournament.ts';
import { TrashIcon } from '@heroicons/react/20/solid';
import Headline from '../components/Headline.tsx';
import Alert from '../components/Alert.tsx';
import LoadingText from '../components/LoadingText.tsx';
import TableOverview, {
  generateNewTableOverview,
  type TableOverviewProps,
} from '../components/tables/TableOverview.tsx';
import { getParticipantOverview } from '../utils/participantHelper.ts';

function toRows(items?: TournamentParticipant[]): ReactNode[][] | [] {
  return items
    ? items.map((item) => [item.lastname || 'Not found', item.firstname || 'Not found'])
    : [];
}

export default function Participants() {
  const [tableOverview, setTableOverview] = useState<TableOverviewProps>({
    table: {
      header: {
        titles: ['Lastname', 'Firstname'],
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

  async function loadParticipants() {
    setLoading(true);
    setError(null);

    const participants = await getParticipantOverview();

    if (!participants) {
      setError('Failed to load participants.');
      setLoading(false);
      return;
    }

    setTableOverview(generateNewTableOverview(tableOverview, toRows(participants)));

    setLoading(false);
  }

  useEffect(() => {
    void loadParticipants();
  }, []);

  return (
    <>
      <Headline variant={'h1'}>Participants</Headline>
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
