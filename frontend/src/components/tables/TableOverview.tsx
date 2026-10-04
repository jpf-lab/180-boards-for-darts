import TableRow from './TableRow.tsx';
import TableColumn from './TableColumn.tsx';
import type { ReactNode } from 'react';

export type TableOverviewProps = {
  table: {
    header: {
      titles: string[];
    };
    body: {
      data?: (ReactNode | undefined)[];
      buttons?: ReactNode[];
    };
  };
};

export default function TableOverview(props: TableOverviewProps) {
  return (
    <div className={'border-2 border-sky-800 bg-gray-950 text-left rounded-t-2xl overflow-x-auto'}>
      <table className={'table-auto w-full'}>
        <thead>
          <TableRow>
            {props.table.header.titles.map((title, index) => (
              <TableColumn as={'th'} key={'title' + index}>
                {title}
              </TableColumn>
            ))}
            {props.table.body.buttons?.length && (
              <TableColumn colSpan={props.table.body.buttons?.length} />
            )}
          </TableRow>
        </thead>
        <tbody>
          {props.table.body.data?.length ? (
            <>
              {props.table.body.data.map((item, index) => (
                <TableRow key={'tableRow' + index}>
                  <TableColumn>{item ?? '-'}</TableColumn>
                </TableRow>
              ))}
              {props.table.body.buttons?.map((item, index) => (
                <TableRow key={'tableRowButtons' + index}>
                  <TableColumn>{item ?? '-'}</TableColumn>
                </TableRow>
              ))}
            </>
          ) : (
            <TableRow>
              <TableColumn className={'text-center'} colSpan={3}>
                No results
              </TableColumn>
            </TableRow>
          )}
        </tbody>
      </table>
    </div>
  );
}
