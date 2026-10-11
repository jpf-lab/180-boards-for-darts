import EntityOverview from '../components/entity/EntityOverview.tsx';
import { deletePlayfieldById, getPlayfieldOverview } from '../utils/playfieldHelper.ts';
import type { TournamentPlayfield } from '../types/Tournament.ts';

const toRow = (item: TournamentPlayfield) => [item.name || 'Not found'];
const getLabel = (item: TournamentPlayfield) => item.name ?? '';

export default function PlayfieldsOverview() {
  return (
    <EntityOverview<TournamentPlayfield>
      title={'Playfields'}
      entityName={'Playfield'}
      basePath={'/playfields'}
      columnTitles={['Name']}
      toRow={toRow}
      getLabel={getLabel}
      loadAll={getPlayfieldOverview}
      onDelete={deletePlayfieldById}
    />
  );
}
