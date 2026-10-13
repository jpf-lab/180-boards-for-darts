import { type ReactNode, useRef, useState } from 'react';
import Headline from '../Headline.tsx';
import Alert from '../Alert.tsx';
import LoadingText from '../LoadingText.tsx';
import SearchForm, { type SearchFormConfig } from '../forms/SearchForm.tsx';
import TableOverview, {
  generateNewTableOverview,
  getButtonsDefault,
  getTableOverviewDefault,
} from '../tables/TableOverview.tsx';

type EntitySearchProps<T> = {
  /** Headline (h3), only shown when provided */
  title?: string;
  form: SearchFormConfig;
  columnTitles: string[];
  toRow: (item: T) => ReactNode[];
  search: (query: string) => Promise<T[]>;
  /** Shows an add button per result row when provided */
  onAdd?: (item: T) => void;
  /** Results for which this returns true are hidden (already added) */
  isAdded?: (item: T) => boolean;
};

export default function EntitySearch<T>(props: Readonly<EntitySearchProps<T>>) {
  const { title, form, columnTitles, toRow, search, onAdd, isAdded } = props;

  const [results, setResults] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestRef = useRef(0);

  const visible = results ? results.filter((item) => !isAdded?.(item)) : null;

  async function handleSearch(query: string) {
    const request = ++requestRef.current;
    setLoading(true);
    setError(null);

    try {
      const result = await search(query);
      if (request === requestRef.current) setResults(result);
    } catch (err) {
      console.error(err);
      if (request === requestRef.current) setError('Search failed.');
    } finally {
      if (request === requestRef.current) setLoading(false);
    }
  }

  function handleReset() {
    requestRef.current++;
    setResults(null);
    setError(null);
    setLoading(false);
  }

  const table = visible
    ? generateNewTableOverview(getTableOverviewDefault(columnTitles), visible.map(toRow))
    : null;

  return (
    <>
      {title && <Headline variant={'h3'}>{title}</Headline>}
      <SearchForm {...form} loading={loading} onSearch={handleSearch} onReset={handleReset} />
      {error && (
        <Alert variant={'error'} onClose={() => setError(null)}>
          <span>{error}</span>
        </Alert>
      )}
      {loading && <LoadingText />}
      {!loading && visible && table && (
        <TableOverview
          table={{
            ...table.table,
            body: {
              ...table.table.body,
              buttons: onAdd
                ? getButtonsDefault({
                    add: (rowIndex) => {
                      const item = visible[rowIndex];
                      if (item) onAdd(item);
                    },
                  })
                : undefined,
            },
          }}
        />
      )}
    </>
  );
}
