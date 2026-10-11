import { type ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import type { TournamentPlayfield } from '../types/Tournament.ts';
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
import { deletePlayfieldById, getPlayfieldOverview } from '../utils/playfieldHelper.ts';

function toRows(items?: TournamentPlayfield[]): ReactNode[][] {
  return items ? items.map((item) => [item.name || 'Not found']) : [];
}

export default function PlayfieldsOverview() {
  const [tableOverview, setTableOverview] = useState<TableOverviewProps>(
    getTableOverviewDefault(['Name'])
  );
  const [playfields, setPlayfields] = useState<TournamentPlayfield[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const navigate = useNavigate();

  async function loadPlayfields() {
    setLoading(true);
    setError(null);

    const result = await getPlayfieldOverview();

    if (!result) {
      setError('Failed to load playfields.');
      setLoading(false);
      return;
    }

    setPlayfields(result);
    setTableOverview((prev) => generateNewTableOverview(prev, toRows(result)));
    setLoading(false);
  }

  async function handleDelete(rowIndex: number) {
    const playfield = playfields[rowIndex];
    if (!playfield) return;

    const name = playfield.name ?? '';
    if (!window.confirm(`Delete playfield "${name}"?`)) return;

    setSuccess(null);
    try {
      await deletePlayfieldById(playfield.id);
      await loadPlayfields();
      setSuccess(`Playfield "${name}" deleted.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete playfield.');
    }
  }

  function handleEdit(rowIndex: number) {
    const playfield = playfields[rowIndex];
    if (playfield?.id) navigate(`/playfields/${playfield.id}/edit`);
  }

  useEffect(() => {
    void loadPlayfields();
  }, []);

  return (
    <>
      <Headline variant={'h1'}>Playfields</Headline>
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
            to={'/playfields/new'}
            buttonstyle={'green'}
            className={'mb-4'}
          >
            <PlusCircleIcon className={'size-6 inline-block mr-2'} />
            <span>Create New Playfield</span>
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
