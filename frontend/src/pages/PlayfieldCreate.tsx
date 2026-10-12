import EntityCreate from '../components/entity/EntityCreate.tsx';
import { createPlayfieldFromForm } from '../utils/playfieldHelper.ts';
import { playfieldFields, playfieldInitialValues } from '../config/playfieldFormConfig.ts';
import type { TournamentPlayfield } from '../types/Tournament.ts';

export default function PlayfieldCreate(props: Readonly<{ columns?: number }>) {
  return (
    <EntityCreate<TournamentPlayfield>
      entityName={'Playfield'}
      fields={playfieldFields}
      initialValues={playfieldInitialValues}
      onCreate={createPlayfieldFromForm}
      columns={props.columns}
    />
  );
}
