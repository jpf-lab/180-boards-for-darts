import axios from 'axios';
import type { TournamentLocation, TournamentLocationOverview } from '../types/Tournament.ts';
import { createLocation, deleteLocation, getLocations } from '../api/tournaments.ts';

export function generateGoogleMapsLink(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export async function getLocationOverview(): Promise<TournamentLocationOverview | undefined> {
  try {
    return await getLocations();
  } catch (err) {
    console.error(err);
    return undefined;
  }
}

export async function createLocationFromForm(
  values: TournamentLocation
): Promise<TournamentLocation> {
  return createLocation(values);
}

export async function deleteLocationById(id?: string): Promise<void> {
  if (!id) {
    throw new Error('No location id provided.');
  }

  try {
    await deleteLocation(id);
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 409) {
      throw new Error('Location is still used by a tournament.');
    }
    throw err;
  }
}
