import type {
  TournamentItemResponse,
  TournamentLocation,
  TournamentOverview,
  TournamentOverviewItem,
  TournamentParticipant,
  TournamentPlayfield,
} from '../types/Tournament.ts';
import {
  getLocationByID,
  getParticipantById,
  getPlayfieldById,
  getTournamentById,
  getTournaments,
} from '../api/tournaments.ts';
import type { TournamentFormValues } from '../components/forms/TournamentForm.tsx';

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

export async function getTournamentDetails(id: string): Promise<TournamentFormValues | null> {
  const tournament = await getTournamentById(id);
  console.log('Tournament Details:', tournament);
  if (tournament) {
    let location: TournamentLocation | undefined;
    if (tournament.locationId) {
      location = await getLocationByID(tournament.locationId);
    }
    let participants: TournamentParticipant[] = [];
    if (tournament.participantIds && tournament.participantIds?.length > 0) {
      tournament.participantIds.map(async (participantId) => {
        const participant = await getParticipantById(participantId);
        participant && participants.push(participant);
      });
    }
    let playfields: TournamentPlayfield[] = [];
    if (tournament.playfieldIds && tournament.playfieldIds.length > 0) {
      tournament.playfieldIds.map(async (playfieldId) => {
        const playfield = await getPlayfieldById(playfieldId);
        playfield && playfields.push(playfield);
      });
    }

    return {
      name: tournament.name || '',
      datetime: tournament.datetime || '',
      location: location
        ? location
        : {
            id: tournament.locationId,
            street: '',
            number: '',
            postalcode: '',
            city: '',
            owner: '',
            contactMail: '',
            contactPhone: '',
          },
      participants: participants,
      playfields: playfields,
    };
  }
  return null;
}
