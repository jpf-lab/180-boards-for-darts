import axios from 'axios';
import type { TournamentParticipant } from '../types/Tournament.ts';
import {
  createParticipant,
  deleteParticipant,
  getParticipantById as fetchParticipantById,
  getParticipants,
  updateParticipant,
} from '../api/tournaments.ts';

export async function getParticipantOverview(): Promise<TournamentParticipant[] | undefined> {
  try {
    return await getParticipants();
  } catch (err) {
    console.error(err);
    return undefined;
  }
}

export async function getParticipantById(id: string): Promise<TournamentParticipant | undefined> {
  try {
    return await fetchParticipantById(id);
  } catch (err) {
    console.error(err);
    return undefined;
  }
}

export async function createParticipantFromForm(
  values: TournamentParticipant
): Promise<TournamentParticipant> {
  return createParticipant(values);
}

export async function updateParticipantById(
  id: string,
  values: TournamentParticipant
): Promise<TournamentParticipant> {
  return updateParticipant(id, values);
}

export async function deleteParticipantById(id?: string): Promise<void> {
  if (!id) {
    throw new Error('No participant id provided.');
  }

  try {
    await deleteParticipant(id);
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 409) {
      throw new Error('Participant is still used by a tournament.');
    }
    throw err;
  }
}
