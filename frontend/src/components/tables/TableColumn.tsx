import { type ComponentPropsWithoutRef } from 'react';

export type TableColumnProps =
  | ({ as?: 'td' } & ComponentPropsWithoutRef<'td'>)
  | ({ as: 'th' } & ComponentPropsWithoutRef<'th'>);

export default function TableColumn(props: TableColumnProps) {
  const Tag = props.as === 'th' ? 'th' : 'td';

  return <Tag {...props} className={`p-2 ${props.className ?? ''}`}></Tag>;
}
