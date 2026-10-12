import TableRow from './TableRow.tsx';
import TableCell from './TableCell.tsx';
import type { ReactNode } from 'react';
import CustomButton from '../CustomButton.tsx';
import { PencilIcon, PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/solid';

export type TableOverviewBodyData = (ReactNode | undefined)[][];

export type TableOverviewTitles = string[];

export type TableOverviewButton = (rowIndex: number) => ReactNode;

export type TableOverviewProps = {
  table: {
    header: {
      titles: TableOverviewTitles;
    };
    body: {
      data?: TableOverviewBodyData;
      buttons?: TableOverviewButton[];
    };
  };
};

type RowHandler = (rowIndex: number) => void | Promise<void>;

type OverviewButtonProps = {
  add?: RowHandler;
  edit?: RowHandler;
  delete?: RowHandler;
  remove?: RowHandler;
};

function rowButton(
  title: string,
  icon: ReactNode,
  handler: RowHandler,
  buttonstyle?: 'green' | 'red'
): TableOverviewButton {
  return (rowIndex) => (
    <div className={'flex items-center justify-center'}>
      <CustomButton
        type={'button'}
        title={title}
        buttonstyle={buttonstyle}
        onClick={() => void handler(rowIndex)}
      >
        {icon}
      </CustomButton>
    </div>
  );
}

export function getButtonsDefault(props: OverviewButtonProps): TableOverviewButton[] {
  const buttons: TableOverviewButton[] = [];

  if (props.add) {
    buttons.push(rowButton('Add', <PlusIcon className={'size-3'} />, props.add, 'green'));
  }
  if (props.edit) {
    buttons.push(rowButton('Edit', <PencilIcon className={'size-3'} />, props.edit));
  }
  if (props.delete) {
    buttons.push(rowButton('Delete', <TrashIcon className={'size-3'} />, props.delete, 'red'));
  }
  if (props.remove) {
    buttons.push(rowButton('Remove', <XMarkIcon className={'size-3'} />, props.remove, 'red'));
  }

  return buttons;
}

export function getTableOverviewDefault(titles: TableOverviewTitles): TableOverviewProps {
  return {
    table: {
      header: { titles: [...titles] },
      body: { data: [] },
    },
  };
}

export function generateNewTableOverview(
  prevData: TableOverviewProps,
  newData: TableOverviewBodyData
): TableOverviewProps {
  return {
    ...prevData,
    table: {
      ...prevData.table,
      body: { ...prevData.table.body, data: newData },
    },
  };
}

export default function TableOverview(props: Readonly<TableOverviewProps>) {
  const buttons = props.table.body.buttons ?? [];

  return (
    <div className={'border-2 border-sky-800 bg-gray-950 text-left rounded-t-2xl overflow-x-auto'}>
      <table className={'table-auto w-full'}>
        <thead>
          <TableRow variant={'head'}>
            {props.table.header.titles.map((title, index) => (
              <TableCell as={'th'} key={'title' + index}>
                {title}
              </TableCell>
            ))}
            {buttons.length > 0 && <TableCell colSpan={buttons.length} />}
          </TableRow>
        </thead>
        <tbody>
          {props.table.body.data?.length ? (
            props.table.body.data.map((row, rowIndex) => (
              <TableRow key={'tableRow' + rowIndex}>
                {row.map((cell, cellIndex) => (
                  <TableCell key={'dataCell-' + rowIndex + '-' + cellIndex}>
                    {cell ?? '-'}
                  </TableCell>
                ))}
                {buttons.map((button, buttonIndex) => (
                  <TableCell key={'button-' + rowIndex + '-' + buttonIndex}>
                    {button(rowIndex)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                className={'text-center'}
                colSpan={props.table.header.titles.length + buttons.length}
              >
                No results
              </TableCell>
            </TableRow>
          )}
        </tbody>
      </table>
    </div>
  );
}
