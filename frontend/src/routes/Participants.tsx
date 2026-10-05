import { type ReactNode, useEffect, useState } from 'react';
import type { TournamentParticipant } from '../types/Tournament.ts';
import Headline from '../components/Headline.tsx';
import Alert from '../components/Alert.tsx';
import LoadingText from '../components/LoadingText.tsx';
import TableOverview, {
  generateNewTableOverview,
  getTableOverviewDefault,
  type TableOverviewProps,
} from '../components/tables/TableOverview.tsx';
import { getParticipantOverview } from '../utils/participantHelper.ts';

function toRows(items?: TournamentParticipant[]): ReactNode[][] | [] {
  return items
    ? items.map((item) => [item.lastname || 'Not found', item.firstname || 'Not found'])
    : [];
}

export default function Participants() {
  const [tableOverview, setTableOverview] = useState<TableOverviewProps>(
    getTableOverviewDefault(['Lastname', 'Firstname'])
  );
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
