import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import FormTemplate, { type FormFieldConfig } from '../forms/FormTemplate.tsx';
import Headline from '../Headline.tsx';
import Alert from '../Alert.tsx';
import LoadingText from '../LoadingText.tsx';

type EntityEditProps<T extends Record<string, string | undefined>> = {
  entityName: string;
  fields: FormFieldConfig<T>[];
  initialValues: T;
  loadById: (id: string) => Promise<T | undefined>;
  onUpdate: (id: string, values: T) => Promise<unknown>;
  columns?: number;
};

function toFormValues<T extends Record<string, string | undefined>>(defaults: T, loaded: T): T {
  const cleaned = Object.fromEntries(
    Object.entries(loaded).map(([key, value]) => [key, value ?? ''])
  );
  return { ...defaults, ...cleaned };
}

export default function EntityEdit<T extends Record<string, string | undefined>>(
  props: Readonly<EntityEditProps<T>>
) {
  const { entityName, fields, initialValues, loadById, onUpdate, columns } = props;
  const { id } = useParams();
  const [entity, setEntity] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError(`No ${entityName.toLowerCase()} id provided.`);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load(entityId: string) {
      setLoading(true);
      setError(null);

      const result = await loadById(entityId);
      if (cancelled) return;

      if (result) {
        setEntity(toFormValues(initialValues, result));
      } else {
        setError(`Failed to load ${entityName.toLowerCase()}.`);
      }
      setLoading(false);
    }

    void load(id);

    return () => {
      cancelled = true;
    };
  }, [id, entityName, initialValues, loadById]);

  async function handleSubmit(values: T) {
    if (!id) throw new Error(`No ${entityName.toLowerCase()} id provided.`);
    await onUpdate(id, values);
  }

  return (
    <>
      <Headline variant={'h1'}>Edit {entityName}</Headline>
      {loading && <LoadingText />}
      {error && <Alert variant={'error'}>{error}</Alert>}
      {!loading && !error && entity && (
        <FormTemplate<T>
          key={id}
          legend={entityName}
          fields={fields}
          initialValues={entity}
          onSubmit={handleSubmit}
          columns={columns}
          successMessage={`${entityName} updated.`}
          resetOnSuccess={false}
        />
      )}
    </>
  );
}
