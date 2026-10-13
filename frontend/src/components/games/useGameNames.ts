import type { TournamentParticipant, TournamentPlayfield } from '../../types/Tournament.ts';

export function createNameResolvers(
  participants: TournamentParticipant[],
  playfields: TournamentPlayfield[]
) {
  const find = (id: string) => participants.find((entry) => entry.id === id);

  const participantName = (id: string) => {
    const p = find(id);
    return p ? `${p.firstname ?? ''} ${p.lastname ?? ''}`.trim() : 'Unbekannt';
  };
  const participantShortName = (id: string) => find(id)?.firstname ?? 'Unbekannt';
  const playfieldName = (id: string) => playfields.find((p) => p.id === id)?.name ?? 'Unbekannt';

  return { participantName, participantShortName, playfieldName };
}
