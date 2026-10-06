import { type ComponentProps, type SubmitEvent, useState } from 'react';
import Fieldset from './Fieldset.tsx';
import FormField from './FormField.tsx';
import CustomButton from '../CustomButton.tsx';
import LoadingText from '../LoadingText.tsx';
import Alert from '../Alert.tsx';

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
  /** Message shown after a successful submit */
  successMessage?: string;
};

export default function FormTemplate<T extends Record<string, string | undefined>>(
  props: Readonly<FormCreateProps<T>>
) {
  const { legend, fields, initialValues, onSubmit } = props;

  const [values, setValues] = useState<T>(initialValues);
  const [resetCounter, setResetCounter] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const columnCount = Math.max(1, props.columns ?? 1);
  const perColumn = Math.ceil(fields.length / columnCount);
  const columns = Array.from({ length: columnCount }, (_, i) =>
    fields.slice(i * perColumn, (i + 1) * perColumn)
  ).filter((column) => column.length > 0);

  function resetForm() {
    setValues(initialValues);
    setResetCounter((count) => count + 1);
  }

  function handleReset() {
    if (loading) return;
    resetForm();
    setError(null);
    setSuccess(false);
  }

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await onSubmit(values);
      resetForm();
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  function updateField(field: keyof T & string, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <>
      {loading && <LoadingText />}
      {error && <Alert variant={'error'}>{error}</Alert>}
      {success && (
        <Alert variant={'success'}>{props.successMessage ?? 'Saved successfully.'}</Alert>
      )}

      <form onSubmit={handleSubmit} onReset={handleReset}>
        <Fieldset legend={legend}>
          <div className={'flex flex-wrap gap-4'}>
            {columns.map((column) => (
              <div
                key={`column-${column[0].id}`}
                className={'flex flex-col gap-4 grow basis-56 min-w-0'}
              >
                {column.map(({ field, ...fieldProps }) => (
                  <FormField
                    key={`${fieldProps.id}-${resetCounter}`}
                    {...fieldProps}
                    readOnly={loading || fieldProps.readOnly}
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
          <CustomButton type={'submit'} disabled={loading}>
            Save
          </CustomButton>
          <CustomButton type={'reset'} buttonstyle={'secondary'} disabled={loading}>
            Reset
          </CustomButton>
        </div>
      </form>
    </>
  );
}
