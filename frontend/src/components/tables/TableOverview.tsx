import TableRow from './TableRow.tsx';
import TableColumn from './TableColumn.tsx';
import type { ReactNode } from 'react';

export type TableOverviewBodyData = (ReactNode | undefined)[][];

export type TableOverviewProps = {
  table: {
    header: {
      titles: string[];
    };
    body: {
      data?: TableOverviewBodyData;
      buttons?: ReactNode[];
    };
  };
};

export function generateNewTableOverview(
  prevData: TableOverviewProps,
  newData: TableOverviewBodyData
): TableOverviewProps {
  return {
    ...prevData,
    table: {
      ...prevData.table,
      body: {
        ...prevData.table.body,
        data: newData,
      },
    },
  };
}

export default function TableOverview(props: TableOverviewProps) {
  return (
    <div className={'border-2 border-sky-800 bg-gray-950 text-left rounded-t-2xl overflow-x-auto'}>
      <table className={'table-auto w-full'}>
        <thead>
          <TableRow variant={'head'}>
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
              {props.table.body.data.map((item, rowIndex) => (
                <TableRow key={'tableRow' + rowIndex}>
                  {item.map((cell, cellIndex) => (
                    <TableColumn key={'dataCell-' + rowIndex + '-' + cellIndex}>
                      {cell ?? '-'}
                    </TableColumn>
                  ))}
                  {props.table.body.buttons?.map((item, buttonIndex) => (
                    <TableColumn key={'button-' + rowIndex + '-' + buttonIndex}>
                      {item ?? '-'}
                    </TableColumn>
                  ))}
                </TableRow>
              ))}
            </>
          ) : (
            <TableRow>
              <TableColumn
                className={'text-center'}
                colSpan={props.table.header.titles.length + (props.table.body.buttons?.length ?? 0)}
              >
                No results
              </TableColumn>
            </TableRow>
          )}
        </tbody>
      </table>
    </div>
  );
}
