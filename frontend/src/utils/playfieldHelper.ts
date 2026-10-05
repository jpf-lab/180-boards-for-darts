import type { TournamentPlayfieldOverview } from '../types/Tournament.ts';
import { getPlayfields } from '../api/tournaments.ts';

export async function getPlayfieldOverview(): Promise<TournamentPlayfieldOverview | undefined> {
  try {
    return await getPlayfields();
  } catch (err) {
    console.error(err);
    return undefined;
  }
}
