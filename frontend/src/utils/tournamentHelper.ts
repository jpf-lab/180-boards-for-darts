import type {
  TournamentItemResponse,
  TournamentLocation,
  TournamentOverview,
  TournamentOverviewItem,
} from '../types/Tournament.ts';
import { getLocationByID, getTournaments } from '../api/tournaments.ts';

export async function getTournamentOverview(): Promise<TournamentOverview | undefined> {
  try {
    const tournamentsItemResponse: TournamentItemResponse[] = await getTournaments();

    const tournamentsWithLocation: TournamentOverviewItem[] = await Promise.all(
      tournamentsItemResponse.map(
        async (tournament: TournamentItemResponse): Promise<TournamentOverviewItem> => {
          if (tournament.locationId) {
            const locationResponse: TournamentLocation = await getLocationByID(
              tournament.locationId
            );
            return { ...tournament, location: locationResponse };
          }
          return { ...tournament };
        }
      )
    );
    return { tournaments: tournamentsWithLocation };
  } catch (err) {
    console.error(err);
    return undefined;
  }
}
