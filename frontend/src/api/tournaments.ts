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

export async function createTournament(
  tournament: TournamentItemResponse
): Promise<TournamentItemResponse> {
  return (await axiosClient.post<TournamentItemResponse>('/tournaments', tournament)).data;
}

export async function updateTournament(
  id: string,
  tournament: TournamentItemResponse
): Promise<TournamentItemResponse> {
  return (await axiosClient.put<TournamentItemResponse>(`/tournaments/${id}`, tournament)).data;
}

export async function deleteTournament(id: string): Promise<void> {
  await axiosClient.delete(`/tournaments/${id}`);
}

// Locations
export async function getLocations(): Promise<TournamentLocation[]> {
  const response = await axiosClient.get<TournamentLocation[]>('/locations');
  return response.data;
}

export async function getLocationByID(id: string): Promise<TournamentLocation> {
  const response = await axiosClient.get<TournamentLocation>(`/locations/${id}`);
  return response.data;
}

export async function createLocation(location: TournamentLocation): Promise<TournamentLocation> {
  const response = await axiosClient.post<TournamentLocation>('/locations', location);
  return response.data;
}

export async function updateLocation(
  id: string,
  location: TournamentLocation
): Promise<TournamentLocation> {
  const response = await axiosClient.put<TournamentLocation>(`/locations/${id}`, location);
  return response.data;
}

export async function deleteLocation(id: string): Promise<void> {
  await axiosClient.delete(`/locations/${id}`);
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

export async function createParticipant(
  participant: TournamentParticipant
): Promise<TournamentParticipant> {
  const response = await axiosClient.post<TournamentParticipant>('/participants', participant);
  return response.data;
}

export async function updateParticipant(
  id: string,
  participant: TournamentParticipant
): Promise<TournamentParticipant> {
  const response = await axiosClient.put<TournamentParticipant>(`/participants/${id}`, participant);
  return response.data;
}

export async function deleteParticipant(id: string): Promise<void> {
  await axiosClient.delete(`/participants/${id}`);
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

export async function createPlayfield(
  playfield: TournamentPlayfield
): Promise<TournamentPlayfield> {
  const response = await axiosClient.post<TournamentPlayfield>('/playfields', playfield);
  return response.data; // 201 Created
}

export async function updatePlayfield(
  id: string,
  playfield: TournamentPlayfield
): Promise<TournamentPlayfield> {
  const response = await axiosClient.put<TournamentPlayfield>(`/playfields/${id}`, playfield);
  return response.data;
}

export async function deletePlayfield(id: string): Promise<void> {
  await axiosClient.delete(`/playfields/${id}`); // 204 No Content
}

// Search
export async function searchParticipants(query: string): Promise<TournamentParticipant[]> {
  const response = await axiosClient.get<TournamentParticipant[]>('/participants/search', {
    params: { query },
  });
  return response.data;
}

export async function searchLocations(query: string): Promise<TournamentLocation[]> {
  const response = await axiosClient.get<TournamentLocation[]>('/locations/search', {
    params: { query },
  });
  return response.data;
}

export async function searchPlayfields(query: string): Promise<TournamentPlayfield[]> {
  const response = await axiosClient.get<TournamentPlayfield[]>('/playfields/search', {
    params: { query },
  });
  return response.data;
}
