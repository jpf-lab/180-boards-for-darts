import axios from 'axios';
import type { TournamentPlayfield } from '../types/Tournament.ts';
import {
  createPlayfield,
  deletePlayfield,
  getPlayfieldById as fetchPlayfieldById,
  getPlayfields,
  updatePlayfield,
} from '../api/tournaments.ts';

export async function getPlayfieldOverview(): Promise<TournamentPlayfield[] | undefined> {
  try {
    return await getPlayfields();
  } catch (err) {
    console.error(err);
    return undefined;
  }
}

export async function getPlayfieldById(id: string): Promise<TournamentPlayfield | undefined> {
  try {
    return await fetchPlayfieldById(id);
  } catch (err) {
    console.error(err);
    return undefined;
  }
}

export async function createPlayfieldFromForm(
  values: TournamentPlayfield
): Promise<TournamentPlayfield> {
  return createPlayfield(values);
}

export async function updatePlayfieldById(
  id: string,
  values: TournamentPlayfield
): Promise<TournamentPlayfield> {
  return updatePlayfield(id, values);
}

export async function deletePlayfieldById(id?: string): Promise<void> {
  if (!id) {
    throw new Error('No playfield id provided.');
  }

  try {
    await deletePlayfield(id);
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 409) {
      throw new Error('Playfield is still used by a tournament.');
    }
    throw err;
  }
}
