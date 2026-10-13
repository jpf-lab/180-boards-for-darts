import type {
  TournamentLocation,
  TournamentOverviewItem,
  TournamentParticipant,
  TournamentPlayfield,
} from '../types/Tournament.ts';
import {
  deleteTournament,
  getLocationByID,
  getParticipantById,
  getPlayfieldById,
  getTournamentById,
  getTournaments,
} from '../api/tournaments.ts';
import { instantToDatetimeLocal } from './dateTime.ts';
import type { TournamentFormValues } from '../config/tournamentFormConfig.ts';

export type TournamentEditData = {
  values: TournamentFormValues;
  location: TournamentLocation | null;
  participants: TournamentParticipant[];
  playfields: TournamentPlayfield[];
};

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

async function loadAll<T>(
  ids: string[] | undefined,
  load: (id: string) => Promise<T>
): Promise<T[]> {
  const items: T[] = [];
  for (const result of await Promise.allSettled((ids ?? []).map(load))) {
    if (result.status === 'fulfilled') items.push(result.value);
  }
  return items;
}

export async function getTournamentEditData(id: string): Promise<TournamentEditData | undefined> {
  try {
    const tournament = await getTournamentById(id);
    const [location, participants, playfields] = await Promise.all([
      tournament.locationId
        ? getLocationByID(tournament.locationId).catch(() => null)
        : Promise.resolve(null),
      loadAll(tournament.participantIds, getParticipantById),
      loadAll(tournament.playfieldIds, getPlayfieldById),
    ]);

    return {
      values: {
        name: tournament.name ?? '',
        datetime: instantToDatetimeLocal(tournament.datetime),
      },
      location,
      participants,
      playfields,
    };
  } catch (err) {
    console.error(err);
    return undefined;
  }
}
