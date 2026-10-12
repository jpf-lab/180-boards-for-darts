import type { ReactNode } from 'react';
import TableOverview, {
  generateNewTableOverview,
  getButtonsDefault,
  getTableOverviewDefault,
} from '../tables/TableOverview.tsx';

type SelectedItemsTableProps<T> = {
  columnTitles: string[];
  items: T[];
  toRow: (item: T) => ReactNode[];
  onRemove: (index: number) => void;
};

export default function SelectedItemsTable<T>(props: Readonly<SelectedItemsTableProps<T>>) {
  const { columnTitles, items, toRow, onRemove } = props;
  const table = generateNewTableOverview(getTableOverviewDefault(columnTitles), items.map(toRow));

  return (
    <TableOverview
      table={{
        ...table.table,
        body: { ...table.table.body, buttons: getButtonsDefault({ remove: onRemove }) },
      }}
    />
  );
}
