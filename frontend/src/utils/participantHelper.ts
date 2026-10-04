import type { TournamentParticipant, TournamentParticipantOverview } from '../types/Tournament.ts';
import { getParticipants } from '../api/tournaments.ts';

export async function getParticipantOverview(): Promise<TournamentParticipantOverview | undefined> {
  try {
    const participantsResponse: TournamentParticipant[] = await getParticipants();

    return await Promise.all(participantsResponse);
  } catch (err) {
    console.error(err);
    return undefined;
  }
}
