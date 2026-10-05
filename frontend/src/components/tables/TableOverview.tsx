import TableRow from './TableRow.tsx';
import TableCell from './TableCell.tsx';
import type { ReactNode } from 'react';
import CustomButton, { type CustomButtonProps } from '../CustomButton.tsx';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';

export type TableOverviewBodyData = (ReactNode | undefined)[][];

export type TableOverviewTitles = string[];

export type TableOverviewProps = {
  table: {
    header: {
      titles: TableOverviewTitles;
    };
    body: {
      data?: TableOverviewBodyData;
      buttons?: ReactNode[];
    };
  };
};

type OmittedCustomButtonProps = Omit<CustomButtonProps, 'buttonstyle' | 'title'>;

type OverviewButtonProps = {
  edit?: OmittedCustomButtonProps;
  delete?: OmittedCustomButtonProps;
};

export function getButtonsDefault(props: OverviewButtonProps) {
  return [
    <div key={'overview-edit'} className={'flex items-center justify-center'}>
      <CustomButton {...(props.edit as CustomButtonProps)}>
        <PencilIcon className={'size-3'} title={'Edit'} />
      </CustomButton>
    </div>,
    <div key={'overview-delete'} className={'flex items-center justify-center'}>
      <CustomButton {...(props.delete as CustomButtonProps)} buttonstyle={'red'} title={'Delete'}>
        <TrashIcon className={'size-3'} />
      </CustomButton>
    </div>,
  ];
}

export function getTableOverviewDefault(props: TableOverviewTitles) {
  return {
    table: {
      header: {
        titles: props.map((title) => title),
      },
      body: {
        data: [],
        buttons: getButtonsDefault({}),
      },
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
      body: {
        ...prevData.table.body,
        data: newData,
      },
    },
  };
}

export default function TableOverview(props: Readonly<TableOverviewProps>) {
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
            {props.table.body.buttons?.length && (
              <TableCell colSpan={props.table.body.buttons?.length} />
            )}
          </TableRow>
        </thead>
        <tbody>
          {props.table.body.data?.length ? (
            <>
              {props.table.body.data.map((item, rowIndex) => (
                <TableRow key={'tableRow' + rowIndex}>
                  {item.map((cell, cellIndex) => (
                    <TableCell key={'dataCell-' + rowIndex + '-' + cellIndex}>
                      {cell ?? '-'}
                    </TableCell>
                  ))}
                  {props.table.body.buttons?.map((item, buttonIndex) => (
                    <TableCell key={'button-' + rowIndex + '-' + buttonIndex}>
                      {item ?? '-'}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </>
          ) : (
            <TableRow>
              <TableCell
                className={'text-center'}
                colSpan={props.table.header.titles.length + (props.table.body.buttons?.length ?? 0)}
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
