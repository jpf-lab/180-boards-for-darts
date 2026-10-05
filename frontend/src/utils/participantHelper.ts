import type { TournamentParticipantOverview } from '../types/Tournament.ts';
import { getParticipants } from '../api/tournaments.ts';

export async function getParticipantOverview(): Promise<TournamentParticipantOverview | undefined> {
  try {
    return await getParticipants();
  } catch (err) {
    console.error(err);
    return undefined;
  }
}
