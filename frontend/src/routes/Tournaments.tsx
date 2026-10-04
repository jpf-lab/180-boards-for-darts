import { PencilIcon } from '@heroicons/react/24/solid';
import CustomButton from '../components/CustomButton.tsx';
import { type ReactNode, useEffect, useState } from 'react';
import type { TournamentOverviewItem } from '../types/Tournament.ts';
import { TrashIcon } from '@heroicons/react/20/solid';
import Headline from '../components/Headline.tsx';
import Alert from '../components/Alert.tsx';
import LoadingText from '../components/LoadingText.tsx';
import { getTournamentOverview } from '../utils/tournamentHelper.ts';
import LocationLink from '../components/LocationLink.tsx';
import TableOverview, {
  generateNewTableOverview,
  type TableOverviewProps,
} from '../components/tables/TableOverview.tsx';

function toRows(items?: TournamentOverviewItem[]): ReactNode[][] | [] {
  return items
    ? items.map((tournament) => [
        tournament.name,
        tournament.datetime ? new Date(tournament.datetime).toLocaleString() : 'Not found',
        <LocationLink variant={'name'} {...tournament.location} />,
        tournament.participantIds?.length || 'Not found',
        tournament.playfieldIds?.length || 'Not found',
      ])
    : [];
}

export default function Tournaments() {
  const [tableOverview, setTableOverview] = useState<TableOverviewProps>({
    table: {
      header: {
        titles: ['Name', 'Date', 'Location', 'Participants', 'Playfields'],
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

  async function loadTournaments() {
    setLoading(true);
    setError(null);

    const tournaments = await getTournamentOverview();

    if (!tournaments) {
      setError('Failed to load tournaments.');
      setLoading(false);
      return;
    }

    setTableOverview(generateNewTableOverview(tableOverview, toRows(tournaments)));

    setLoading(false);
  }

  useEffect(() => {
    void loadTournaments();
  }, []);

  return (
    <>
      <Headline variant={'h1'}>Tournaments</Headline>
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
