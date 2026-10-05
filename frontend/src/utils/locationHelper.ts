import type { TournamentLocationOverview } from '../types/Tournament.ts';
import { getLocations } from '../api/tournaments.ts';

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
