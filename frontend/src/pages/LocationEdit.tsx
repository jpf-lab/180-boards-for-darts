import EntityEdit from '../components/entity/EntityEdit.tsx';
import { getLocationById, updateLocationById } from '../utils/locationHelper.ts';
import { locationFields, locationInitialValues } from '../config/locationFormConfig.ts';
import type { TournamentLocation } from '../types/Tournament.ts';

export default function LocationEdit(props: Readonly<{ columns?: number }>) {
  return (
    <EntityEdit<TournamentLocation>
      entityName={'Location'}
      fields={locationFields}
      initialValues={locationInitialValues}
      loadById={getLocationById}
      onUpdate={updateLocationById}
      columns={props.columns}
    />
  );
}
