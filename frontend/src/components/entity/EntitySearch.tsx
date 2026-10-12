import { type ReactNode, useRef, useState } from 'react';
import Headline from '../Headline.tsx';
import Alert from '../Alert.tsx';
import LoadingText from '../LoadingText.tsx';
import SearchForm, { type SearchFormConfig } from '../forms/SearchForm.tsx';
import TableOverview, {
  generateNewTableOverview,
  getTableOverviewDefault,
} from '../tables/TableOverview.tsx';

type EntitySearchProps<T> = {
  /** Headline (h3), only shown when provided */
  title?: string;
  form: SearchFormConfig;
  columnTitles: string[];
  toRow: (item: T) => ReactNode[];
  search: (query: string) => Promise<T[]>;
};

export default function EntitySearch<T>(props: Readonly<EntitySearchProps<T>>) {
  const { title, form, columnTitles, toRow, search } = props;

  const [results, setResults] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestRef = useRef(0);

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
      {!loading && results && (
        <TableOverview
          {...generateNewTableOverview(getTableOverviewDefault(columnTitles), results.map(toRow))}
        />
      )}
    </>
  );
}
