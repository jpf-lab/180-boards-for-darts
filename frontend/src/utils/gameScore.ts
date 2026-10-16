import type { TournamentGame, TournamentGameRound } from '../types/Tournament.ts';

export const DEFAULT_BEST_OF = 3;
/** Games in this group form the final, where the groups meet */
export const FINAL_GROUP = 'F';

export type Side = 1 | 2;
export type GameScore = { side1: number; side2: number };
export type GameStatus = 'pending' | 'running' | 'finished';

/** Side 1 = first, side 2 = second entry in pairing */
export function getPlayerId(game: TournamentGame, side: Side): string | undefined {
  return game.pairing[side - 1]?.participantId;
}

export function sideOf(game: TournamentGame, participantId?: string): Side | undefined {
  const index = game.pairing.findIndex((p) => p.participantId === participantId);
  if (index === 0) return 1;
  if (index === 1) return 2;
  return undefined;
}

export function getPlayerName(
  game: TournamentGame,
  side: Side,
  nameOf: (participantId: string) => string
): string {
  const id = getPlayerId(game, side);
  return id ? nameOf(id) : '-';
}

/** Running score after each entered round */
export function getRunningScores(game: TournamentGame): GameScore[] {
  let side1 = 0;
  let side2 = 0;
  return game.game_round.map((round) => {
    const side = sideOf(game, round.winner);
    if (side === 1) side1++;
    else if (side === 2) side2++;
    return { side1, side2 };
  });
}

/** Total score, undefined as long as no round has been entered */
export function getGameScore(game: TournamentGame): GameScore | undefined {
  return getRunningScores(game).at(-1);
}

/** Display values, "-" as long as nothing has been entered */
export function formatScore(game: TournamentGame): [string, string] {
  const score = getGameScore(game);
  return score ? [String(score.side1), String(score.side2)] : ['-', '-'];
}

/** Side of the winner for a finished game, otherwise undefined */
export function getGameWinner(game: TournamentGame, bestOf = DEFAULT_BEST_OF): Side | undefined {
  const score = getGameScore(game);
  if (!score) return undefined;
  const needed = Math.ceil(bestOf / 2);
  if (score.side1 >= needed) return 1;
  if (score.side2 >= needed) return 2;
  return undefined;
}

export function getGameStatus(game: TournamentGame, bestOf = DEFAULT_BEST_OF): GameStatus {
  if (game.game_round.length === 0) return 'pending';
  return getGameWinner(game, bestOf) ? 'finished' : 'running';
}

/** Always bestOf slots, rounds not yet entered are undefined */
export function getRoundSlots(
  game: TournamentGame,
  bestOf = DEFAULT_BEST_OF
): (TournamentGameRound | undefined)[] {
  return Array.from({ length: bestOf }, (_, index) => game.game_round[index]);
}

/** Groups alphabetically, the final last; games by round and position */
export function groupGames(games: TournamentGame[]): [string, TournamentGame[]][] {
  const map = new Map<string, TournamentGame[]>();
  for (const game of games) {
    map.set(game.group, [...(map.get(game.group) ?? []), game]);
  }
  const rank = (group: string) => (group === FINAL_GROUP ? 1 : 0);
  return [...map.entries()]
    .sort(([a], [b]) => rank(a) - rank(b) || a.localeCompare(b))
    .map(([group, list]) => [
      group,
      [...list].sort((a, b) => a.round - b.round || a.position - b.position),
    ]);
}

export function getGroupLabel(group: string): string {
  return group === FINAL_GROUP ? 'Final' : `Group ${group}`;
}
