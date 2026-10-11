import EntityEdit from '../components/entity/EntityEdit.tsx';
import { getPlayfieldById, updatePlayfieldById } from '../utils/playfieldHelper.ts';
import { playfieldFields, playfieldInitialValues } from '../config/playfieldFormConfig.ts';
import type { TournamentPlayfield } from '../types/Tournament.ts';

export default function PlayfieldEdit(props: Readonly<{ columns?: number }>) {
  return (
    <EntityEdit<TournamentPlayfield>
      entityName={'Playfield'}
      fields={playfieldFields}
      initialValues={playfieldInitialValues}
      loadById={getPlayfieldById}
      onUpdate={updatePlayfieldById}
      columns={props.columns}
    />
  );
}
