import EntityCreate from '../components/entity/EntityCreate.tsx';
import { createLocationFromForm } from '../utils/locationHelper.ts';
import { locationFields, locationInitialValues } from '../config/locationFormConfig.ts';
import type { TournamentLocation } from '../types/Tournament.ts';

export default function LocationCreate(props: Readonly<{ columns?: number }>) {
  return (
    <EntityCreate<TournamentLocation>
      entityName={'Location'}
      fields={locationFields}
      initialValues={locationInitialValues}
      onCreate={createLocationFromForm}
      columns={props.columns}
    />
  );
}
