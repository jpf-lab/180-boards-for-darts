import { type ReactNode, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { SquaresPlusIcon } from '@heroicons/react/24/solid';
import Headline from '../Headline.tsx';
import Alert from '../Alert.tsx';
import LoadingText from '../LoadingText.tsx';
import CustomButton from '../CustomButton.tsx';
import TableOverview, {
  generateNewTableOverview,
  getButtonsDefault,
  getTableOverviewDefault,
  type TableOverviewProps,
} from '../tables/TableOverview.tsx';

type EntityOverviewProps<T extends { id?: string }> = {
  title: string;
  entityName: string;
  /** z. B. '/locations' */
  basePath: string;
  columnTitles: string[];
  toRow: (item: T) => ReactNode[];
  getLabel: (item: T) => string;
  loadAll: () => Promise<T[] | undefined>;
  onDelete: (id?: string) => Promise<void>;
};

export default function EntityOverview<T extends { id?: string }>(
  props: Readonly<EntityOverviewProps<T>>
) {
  const { title, entityName, basePath, columnTitles, toRow, getLabel, loadAll, onDelete } = props;

  const [tableOverview, setTableOverview] = useState<TableOverviewProps>(() =>
    getTableOverviewDefault(columnTitles)
  );
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const navigate = useNavigate();

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await loadAll();

    if (!result) {
      setError(`Failed to load ${title.toLowerCase()}.`);
      setLoading(false);
      return;
    }

    setItems(result);
    setTableOverview((prev) => generateNewTableOverview(prev, result.map(toRow)));
    setLoading(false);
  }, [loadAll, title, toRow]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleDelete(rowIndex: number) {
    const item = items[rowIndex];
    if (!item) return;

    const label = getLabel(item);
    if (!window.confirm(`Delete ${entityName.toLowerCase()} "${label}"?`)) return;

    setSuccess(null);
    try {
      await onDelete(item.id);
      await load();
      setSuccess(`${entityName} "${label}" deleted.`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : `Failed to delete ${entityName.toLowerCase()}.`
      );
    }
  }

  function handleEdit(rowIndex: number) {
    const id = items[rowIndex]?.id;
    if (id) navigate(`${basePath}/${id}/edit`);
  }

  return (
    <>
      <Headline variant={'h1'}>{title}</Headline>
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
      {loading && <LoadingText />}
      {!error && !loading && (
        <>
          <CustomButton
            variant={'link'}
            to={`${basePath}/new`}
            buttonstyle={'green'}
            className={'mb-4'}
          >
            <SquaresPlusIcon className={'size-6 inline-block mr-2'} />
            <span>Create New {entityName}</span>
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
