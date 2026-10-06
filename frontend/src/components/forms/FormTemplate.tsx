import { type ComponentProps, type SubmitEvent, useState } from 'react';
import Fieldset from './Fieldset.tsx';
import FormField from './FormField.tsx';
import CustomButton from '../CustomButton.tsx';

export type FormFieldConfig<T> = Omit<ComponentProps<typeof FormField>, 'value' | 'onChange'> & {
  field: keyof T & string;
};

type FormCreateProps<T extends Record<string, string | undefined>> = {
  legend: string;
  fields: FormFieldConfig<T>[];
  initialValues: T;
  onSubmit: (values: T) => Promise<void> | void;
  /** Number of columns, default 1 */
  columns?: number;
};

export default function FormTemplate<T extends Record<string, string | undefined>>(
  props: Readonly<FormCreateProps<T>>
) {
  const { legend, fields, initialValues, onSubmit } = props;

  const [values, setValues] = useState<T>(initialValues);
  const [resetCounter, setResetCounter] = useState(0);

  const columnCount = Math.max(1, props.columns ?? 1);
  const perColumn = Math.ceil(fields.length / columnCount);
  const columns = Array.from({ length: columnCount }, (_, i) =>
    fields.slice(i * perColumn, (i + 1) * perColumn)
  ).filter((column) => column.length > 0);

  function handleReset() {
    setValues(initialValues);
    setResetCounter((count) => count + 1);
  }

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    await onSubmit(values);
  }

  function updateField(field: keyof T & string, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <form onSubmit={handleSubmit} onReset={handleReset}>
      <Fieldset legend={legend}>
        <div className={'flex flex-wrap gap-4'}>
          {columns.map((column, columnIndex) => (
            <div
              key={`column-${columnIndex}`}
              className={'flex flex-col gap-4 grow basis-56 min-w-0'}
            >
              {column.map(({ field, ...fieldProps }) => (
                <FormField
                  key={`${fieldProps.id}-${resetCounter}`}
                  {...fieldProps}
                  value={values[field] ?? ''}
                  onChange={(v) => updateField(field, v)}
                />
              ))}
            </div>
          ))}
        </div>
      </Fieldset>

      <p className={'text-sm mb-6'}>
        <span>*</span> required
      </p>

      <div className={'flex gap-3 mt-2'}>
        <CustomButton type={'submit'}>Save</CustomButton>
        <CustomButton type={'reset'} buttonstyle={'secondary'}>
          Reset
        </CustomButton>
      </div>
    </form>
  );
}
