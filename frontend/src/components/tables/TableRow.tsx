import { type ComponentPropsWithoutRef } from 'react';

type TableRowProps = ComponentPropsWithoutRef<'tr'>;

export default function TableRow(props: TableRowProps) {
  return (
    <tr
      {...props}
      className={`even:bg-gray-800 odd:bg-gray-700 border-t-2 border-sky-800 ${props.className}`}
    ></tr>
  );
}
