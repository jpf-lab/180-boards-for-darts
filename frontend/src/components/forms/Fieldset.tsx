import type { ComponentPropsWithoutRef } from 'react';

type FieldsetProps = ComponentPropsWithoutRef<'fieldset'> & {
  legend?: string;
};

export default function Fieldset(props: FieldsetProps) {
  return (
    <fieldset
      className={`border border-gray-300 rounded-lg px-4 pt-3 pb-4 flex flex-col gap-4 ${props.className ?? ''}`}
    >
      {props.legend && <legend className={`font-semibold text-sm px-2`}>{props.legend}</legend>}
      {props.children}
    </fieldset>
  );
}
