import type { TournamentPlayfield, TournamentPlayfieldOverview } from '../types/Tournament.ts';
import { getPlayfields } from '../api/tournaments.ts';

export async function getPlayfieldOverview(): Promise<TournamentPlayfieldOverview | undefined> {
  try {
    const playfieldsResponse: TournamentPlayfield[] = await getPlayfields();

    return await Promise.all(playfieldsResponse);
  } catch (err) {
    console.error(err);
    return undefined;
  }
}
