import axiosClient from './axiosClient';
import type {
  TournamentLocation,
  TournamentItemResponse,
  TournamentParticipant,
  TournamentPlayfield,
} from '../types/Tournament';

// Tournaments
export async function getTournaments(): Promise<TournamentItemResponse[]> {
  const response = await axiosClient.get<TournamentItemResponse[]>('/tournaments');
  return response.data;
}

export async function getTournamentById(id: string): Promise<TournamentItemResponse> {
  const response = await axiosClient.get<TournamentItemResponse>(`/tournaments/${id}`);
  return response.data;
}

// Locations
export async function getLocations(): Promise<TournamentLocation[]> {
  const response = await axiosClient.get<TournamentItemResponse[]>('/locations');
  return response.data;
}

export async function getLocationByID(id: string): Promise<TournamentLocation> {
  const response = await axiosClient.get<TournamentLocation>(`/locations/${id}`);
  return response.data;
}

// Participants
export async function getParticipants(): Promise<TournamentParticipant[]> {
  const response = await axiosClient.get<TournamentParticipant[]>('/participants');
  return response.data;
}

export async function getParticipantById(id: string): Promise<TournamentParticipant> {
  const response = await axiosClient.get<TournamentParticipant>(`/participants/${id}`);
  return response.data;
}

// Playfields
export async function getPlayfields(): Promise<TournamentPlayfield[]> {
  const response = await axiosClient.get<TournamentPlayfield[]>('/playfields');
  return response.data;
}

export async function getPlayfieldById(id: string): Promise<TournamentPlayfield> {
  const response = await axiosClient.get<TournamentPlayfield>(`/playfields/${id}`);
  return response.data;
}
