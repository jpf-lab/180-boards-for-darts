import { type ComponentProps, type SubmitEvent, useRef, useState } from 'react';
import Fieldset from './Fieldset.tsx';
import FormField from './FormField.tsx';
import CustomButton from '../CustomButton.tsx';
import LoadingText from '../LoadingText.tsx';
import Alert from '../Alert.tsx';

export type FormFieldConfig<T> = Omit<ComponentProps<typeof FormField>, 'value' | 'onChange'> & {
  field: keyof T & string;
};

type FormTemplateProps<T extends Record<string, string | undefined>> = {
  legend: string;
  fields: FormFieldConfig<T>[];
  initialValues: T;
  onSubmit: (values: T) => Promise<void> | void;
  /** Number of columns, default 1 */
  columns?: number;
  /** Message shown after a successful submit */
  successMessage?: string;
  /** Reset the fields after a successful submit, default true */
  resetOnSuccess?: boolean;
};

export default function FormTemplate<T extends Record<string, string | undefined>>(
  props: Readonly<FormTemplateProps<T>>
) {
  const { legend, fields, initialValues, onSubmit } = props;

  const [values, setValues] = useState<T>(initialValues);
  const [resetCounter, setResetCounter] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const busyRef = useRef(false);

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
    if (busyRef.current) return;
    resetForm();
    setError(null);
    setSuccess(null);
  }

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (busyRef.current) return; // Mehrfachabsendung verhindern

    busyRef.current = true;
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await onSubmit(values);
      if (props.resetOnSuccess ?? true) resetForm();
      setSuccess(props.successMessage ?? 'Saved successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      busyRef.current = false;
      setLoading(false);
    }
  }

  function updateField(field: keyof T & string, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <>
      {loading && <LoadingText />}
      {error && (
        <Alert variant={'error'} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant={'success'} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
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
