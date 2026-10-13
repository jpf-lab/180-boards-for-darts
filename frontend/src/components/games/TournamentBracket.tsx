import type { TournamentGame } from '../../types/Tournament.ts';
import { BRACKET, layoutBracket } from '../../utils/bracketLayout.ts';
import {
  DEFAULT_BEST_OF,
  formatScore,
  getGameWinner,
  getGroupLabel,
  getPlayerName,
  type Side,
} from '../../utils/gameScore.ts';

type TournamentBracketProps = {
  games: TournamentGame[];
  participantName: (id: string) => string;
  bestOf?: number;
};

const SIDES: Side[] = [1, 2];

// Center of row 1 or 2 within a game box (1px border, two rows of 27px each)
const rowCenter = (y: number, row: Side) => y + 14.5 + 27 * (row - 1);

export default function TournamentBracket(props: Readonly<TournamentBracketProps>) {
  const { games, participantName, bestOf = DEFAULT_BEST_OF } = props;

  if (games.length === 0) {
    return <p className={'text-sm'}>No games found</p>;
  }

  const layout = layoutBracket(games, bestOf);
  const byKey = new Map(layout.nodes.map((node) => [node.key, node]));

  return (
    <div className={'overflow-x-auto border-2 border-sky-800 bg-gray-950 rounded-2xl p-3'}>
      <div className={'relative'} style={{ width: layout.width, height: layout.height }}>
        <svg
          className={'absolute inset-0 pointer-events-none'}
          width={layout.width}
          height={layout.height}
        >
          {layout.links.map((link) => {
            const from = byKey.get(link.fromKey);
            const to = byKey.get(link.toKey);
            if (!from || !to) return null;

            const x1 = from.x + BRACKET.width;
            const y1 = rowCenter(from.y, link.fromRow);
            const x2 = to.x;
            const y2 = rowCenter(to.y, link.toRow);
            const bend = BRACKET.gapX / 2;

            return (
              <path
                key={`${link.fromKey}-${link.toKey}`}
                d={`M${x1} ${y1} C${x1 + bend} ${y1}, ${x2 - bend} ${y2}, ${x2} ${y2}`}
                className={'stroke-green-500 fill-none'}
                strokeWidth={2}
              />
            );
          })}
        </svg>

        {layout.lanes.map((lane) => (
          <p
            key={`lane-${lane.group}`}
            className={'absolute text-xs font-bold'}
            style={{ left: 0, top: lane.y }}
          >
            {getGroupLabel(lane.group)}
          </p>
        ))}
        {layout.finalLabel && (
          <p
            className={'absolute text-xs font-bold'}
            style={{ left: layout.finalLabel.x, top: layout.finalLabel.y }}
          >
            Final
          </p>
        )}

        {layout.nodes.map((node) => {
          const scores = formatScore(node.game);
          const winner = getGameWinner(node.game, bestOf);
          return (
            <div
              key={node.key}
              className={
                'absolute flex flex-col border border-sky-800 rounded-xl text-sm overflow-hidden bg-gray-950'
              }
              style={{ left: node.x, top: node.y, width: BRACKET.width, height: BRACKET.height }}
            >
              {SIDES.map((side) => (
                <div
                  key={side}
                  className={`flex-1 flex items-center justify-between gap-2 px-2 border-b border-sky-800 last:border-b-0 ${winner === side ? 'bg-green-700 font-bold' : ''}`}
                >
                  <span className={'truncate'}>
                    {getPlayerName(node.game, side, participantName)}
                  </span>
                  <span>{scores[side - 1]}</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
