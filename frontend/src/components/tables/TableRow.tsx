import { type ComponentPropsWithoutRef } from 'react';

type TableRowProps = ComponentPropsWithoutRef<'tr'> & {
  variant?: "body" | "head";
};

export default function TableRow(props: TableRowProps) {
  const variant = props.variant ?? 'body';
  return (
    <tr
      {...props}
      className={
        variant === 'body'
          ? `even:bg-gray-800 odd:bg-gray-700 border-t-2 border-sky-800 ${props.className}`
          : undefined
      }
    ></tr>
  );
}
