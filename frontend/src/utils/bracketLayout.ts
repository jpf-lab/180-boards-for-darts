import type { TournamentGame } from '../types/Tournament.ts';
import {
  DEFAULT_BEST_OF,
  FINAL_GROUP,
  getGameWinner,
  getPlayerId,
  sideOf,
  type Side,
} from './gameScore.ts';

export const BRACKET = {
  width: 220,
  height: 56,
  gapX: 48,
  gapY: 16,
  laneGap: 28,
  labelHeight: 22,
} as const;

export type BracketNode = { key: string; game: TournamentGame; x: number; y: number };
export type BracketLink = { fromKey: string; toKey: string; fromRow: Side; toRow: Side };
export type BracketLane = { group: string; y: number };

export type BracketLayout = {
  nodes: BracketNode[];
  links: BracketLink[];
  lanes: BracketLane[];
  finalLabel?: { x: number; y: number };
  width: number;
  height: number;
};

export function gameKey(game: TournamentGame): string {
  return game.id ?? `${game.group}-${game.round}-${game.position}`;
}

const average = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length;

/** Winner of a finished game -> next game of the same group or the final */
function computeLinks(games: TournamentGame[], bestOf: number): BracketLink[] {
  const links: BracketLink[] = [];

  for (const source of games) {
    const winnerSide = getGameWinner(source, bestOf);
    if (!winnerSide) continue;

    const winnerId = getPlayerId(source, winnerSide);
    if (!winnerId) continue;

    const target = games
      .filter(
        (candidate) =>
          candidate.round > source.round &&
          (candidate.group === source.group || candidate.group === FINAL_GROUP) &&
          sideOf(candidate, winnerId) !== undefined
      )
      .sort((a, b) => a.round - b.round)[0];
    if (!target) continue;

    const targetSide = sideOf(target, winnerId);
    if (!targetSide) continue;

    links.push({
      fromKey: gameKey(source),
      toKey: gameKey(target),
      fromRow: winnerSide,
      toRow: targetSide,
    });
  }
  return links;
}

export function layoutBracket(games: TournamentGame[], bestOf = DEFAULT_BEST_OF): BracketLayout {
  const { width, height, gapX, gapY, laneGap, labelHeight } = BRACKET;
  const links = computeLinks(games, bestOf);
  const positions = new Map<string, { x: number; y: number }>();

  const laneGames = games.filter((game) => game.group !== FINAL_GROUP);
  const finalGames = games
    .filter((game) => game.group === FINAL_GROUP)
    .sort((a, b) => a.position - b.position);
  const groups = [...new Set(laneGames.map((game) => game.group))].sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true })
  );

  const minRound = laneGames.length ? Math.min(...laneGames.map((game) => game.round)) : 1;
  const maxRound = laneGames.length ? Math.max(...laneGames.map((game) => game.round)) : 0;
  const finalColumn = laneGames.length ? maxRound - minRound + 1 : 0;

  const yOfFeeders = (key: string): number | undefined => {
    const feeders = links
      .filter((link) => link.toKey === key)
      .map((link) => positions.get(link.fromKey))
      .filter((position): position is { x: number; y: number } => position !== undefined);
    return feeders.length ? average(feeders.map((position) => position.y)) : undefined;
  };

  const lanes: BracketLane[] = [];
  let laneTop = 0;

  for (const group of groups) {
    lanes.push({ group, y: laneTop });
    let laneBottom = laneTop + labelHeight;
    const inGroup = laneGames.filter((game) => game.group === group);
    const rounds = [...new Set(inGroup.map((game) => game.round))].sort((a, b) => a - b);

    for (const round of rounds) {
      inGroup
        .filter((game) => game.round === round)
        .sort((a, b) => a.position - b.position)
        .forEach((game, index) => {
          const key = gameKey(game);
          const y = yOfFeeders(key) ?? laneTop + labelHeight + index * (height + gapY);
          positions.set(key, { x: (round - minRound) * (width + gapX), y });
          laneBottom = Math.max(laneBottom, y + height);
        });
    }
    laneTop = laneBottom + laneGap;
  }

  const contentHeight = Math.max(laneTop - laneGap, height);
  finalGames.forEach((game, index) => {
    const key = gameKey(game);
    const y = yOfFeeders(key) ?? (contentHeight - height) / 2 + index * (height + gapY);
    positions.set(key, { x: finalColumn * (width + gapX), y });
  });

  const nodes = games.map((game) => {
    const key = gameKey(game);
    const position = positions.get(key) ?? { x: 0, y: 0 };
    return { key, game, ...position };
  });

  const finalTop = finalGames.length
    ? Math.min(...finalGames.map((game) => positions.get(gameKey(game))?.y ?? 0))
    : undefined;

  const columns = finalGames.length ? finalColumn + 1 : Math.max(maxRound - minRound + 1, 1);

  return {
    nodes,
    links,
    lanes,
    finalLabel:
      finalTop === undefined
        ? undefined
        : { x: finalColumn * (width + gapX), y: Math.max(finalTop - labelHeight, 0) },
    width: columns * (width + gapX) - gapX,
    height: Math.max(...nodes.map((node) => node.y + height), height) + 8,
  };
}
