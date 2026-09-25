import axiosClient from './axiosClient';
import type { TournamentOverview, TournamentOverviewItemResponse } from '../types/Tournament';

export async function getTournamentOverview(): Promise<TournamentOverview> {
  const response = await axiosClient.get<TournamentOverviewItemResponse[]>('/tournaments');
  return { tournaments: response.data };
}

export async function getLocationByID(id: string): Promise<Location> {
  const response = await axiosClient.get<Location>('/locations/' + id);
  return response.data;
}
