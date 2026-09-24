import axiosClient from './axiosClient';
import type { TournamentOverview, TournamentOverviewItem } from '../types/Tournament';

export async function getTournamentOverview(): Promise<TournamentOverview> {
  const response = await axiosClient.get<TournamentOverviewItem[]>('/tournaments');
  return { tournaments: response.data };
}
