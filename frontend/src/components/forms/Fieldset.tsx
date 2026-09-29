import type { PropsWithChildren } from 'react';

type FieldsetProps = PropsWithChildren & {
  legend?: string;
};

export default function Fieldset(props: FieldsetProps) {
  return (
    <fieldset className={`border border-gray-300 rounded-lg px-4 pt-3 pb-4 flex flex-col gap-4`}>
      {props.legend && <legend className={`font-semibold text-sm px-2`}>{props.legend}</legend>}
      {props.children}
    </fieldset>
  );
}
