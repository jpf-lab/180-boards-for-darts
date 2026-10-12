import type { TournamentOverviewItem } from '../types/Tournament.ts';
import { deleteTournament, getLocationByID, getTournaments } from '../api/tournaments.ts';

export async function getTournamentOverview(): Promise<TournamentOverviewItem[] | undefined> {
  try {
    const items = await getTournaments();
    return await Promise.all(
      items.map(async (tournament): Promise<TournamentOverviewItem> => {
        if (!tournament.locationId) return { ...tournament };
        return { ...tournament, location: await getLocationByID(tournament.locationId) };
      })
    );
  } catch (err) {
    console.error(err);
    return undefined;
  }
}

export async function deleteTournamentById(id?: string): Promise<void> {
  if (!id) throw new Error('No tournament id provided.');
  await deleteTournament(id);
}
