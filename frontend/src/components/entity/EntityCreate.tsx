import FormTemplate, { type FormFieldConfig } from '../forms/FormTemplate.tsx';
import Headline from '../Headline.tsx';

type EntityCreateProps<T extends Record<string, string | undefined>> = {
  entityName: string;
  fields: FormFieldConfig<T>[];
  initialValues: T;
  onCreate: (values: T) => Promise<unknown>;
  columns?: number;
};

export default function EntityCreate<T extends Record<string, string | undefined>>(
  props: Readonly<EntityCreateProps<T>>
) {
  const { entityName, fields, initialValues, onCreate, columns } = props;

  return (
    <>
      <Headline variant={'h1'}>Create {entityName}</Headline>
      <FormTemplate<T>
        legend={entityName}
        fields={fields}
        initialValues={initialValues}
        onSubmit={async (values) => {
          await onCreate(values);
        }}
        columns={columns}
        successMessage={`${entityName} created.`}
      />
    </>
  );
}
