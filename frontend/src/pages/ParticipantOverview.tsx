import { type ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { UserPlusIcon } from '@heroicons/react/24/solid';
import type { TournamentParticipant } from '../types/Tournament.ts';
import Headline from '../components/Headline.tsx';
import Alert from '../components/Alert.tsx';
import LoadingText from '../components/LoadingText.tsx';
import CustomButton from '../components/CustomButton.tsx';
import TableOverview, {
  generateNewTableOverview,
  getButtonsDefault,
  getTableOverviewDefault,
  type TableOverviewProps,
} from '../components/tables/TableOverview.tsx';
import { deleteParticipantById, getParticipantOverview } from '../utils/participantHelper.ts';

function toRows(items?: TournamentParticipant[]): ReactNode[][] {
  return items
    ? items.map((item) => [item.lastname || 'Not found', item.firstname || 'Not found'])
    : [];
}

export default function ParticipantOverview() {
  const [tableOverview, setTableOverview] = useState<TableOverviewProps>(
    getTableOverviewDefault(['Lastname', 'Firstname'])
  );
  const [participants, setParticipants] = useState<TournamentParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const navigate = useNavigate();

  async function loadParticipants() {
    setLoading(true);
    setError(null);

    const result = await getParticipantOverview();

    if (!result) {
      setError('Failed to load participants.');
      setLoading(false);
      return;
    }

    setParticipants(result);
    setTableOverview((prev) => generateNewTableOverview(prev, toRows(result)));
    setLoading(false);
  }

  async function handleDelete(rowIndex: number) {
    const participant = participants[rowIndex];
    if (!participant) return;

    const name = `${participant.firstname ?? ''} ${participant.lastname ?? ''}`.trim();
    if (!window.confirm(`Delete participant "${name}"?`)) return;

    setSuccess(null);
    try {
      await deleteParticipantById(participant.id);
      await loadParticipants();
      setSuccess(`Participant "${name}" deleted.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete participant.');
    }
  }

  function handleEdit(rowIndex: number) {
    const participant = participants[rowIndex];
    if (participant?.id) navigate(`/participants/${participant.id}/edit`);
  }

  useEffect(() => {
    void loadParticipants();
  }, []);

  return (
    <>
      <Headline variant={'h1'}>Participants</Headline>
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
            to={'/participants/new'}
            buttonstyle={'green'}
            className={'mb-4'}
          >
            <UserPlusIcon className={'size-6 inline-block mr-2'} />
            <span>Create New Participant</span>
          </CustomButton>
          <TableOverview
            table={{
              ...tableOverview.table,
              body: {
                ...tableOverview.table.body,
                buttons: getButtonsDefault({ edit: handleEdit, delete: handleDelete }),
              },
            }}
          />
        </>
      )}
    </>
  );
}
