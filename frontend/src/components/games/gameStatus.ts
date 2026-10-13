import type { GameStatus } from '../../utils/gameScore.ts';

export const statusConfig: Record<GameStatus, { label: string; badge: string }> = {
  finished: { label: 'Beendet', badge: 'bg-green-700' },
  running: { label: 'Läuft', badge: 'bg-yellow-600' },
  pending: { label: 'Ausstehend', badge: 'bg-gray-600' },
};

export const WINNER_CLASS = 'text-green-400 font-bold';
export const STARTER_CLASS = 'text-sky-400 font-bold';

export type GameViewProps = {
  participantName: (id: string) => string;
  /** Short name (e.g. first name) for the round lines in variant B, default: participantName */
  participantShortName?: (id: string) => string;
  playfieldName: (id: string) => string;
  bestOf?: number;
};
