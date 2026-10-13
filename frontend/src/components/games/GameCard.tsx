import type { TournamentGame } from '../../types/Tournament.ts';
import {
  DEFAULT_BEST_OF,
  formatScore,
  getGameStatus,
  getGameWinner,
  getPlayerId,
  getPlayerName,
  getRoundSlots,
  getRunningScores,
  type Side,
} from '../../utils/gameScore.ts';
import { STARTER_CLASS, statusConfig, WINNER_CLASS, type GameViewProps } from './gameStatus.ts';

type GameCardProps = GameViewProps & { game: TournamentGame };

const SIDES: Side[] = [1, 2];

type PlayerProps = {
  id?: string;
  starterId?: string;
  nameOf: (id: string) => string;
};

function Player(props: Readonly<PlayerProps>) {
  const { id, starterId, nameOf } = props;
  if (!id) return <>-</>;
  return <span className={id === starterId ? STARTER_CLASS : ''}>{nameOf(id)}</span>;
}

export default function GameCard(props: Readonly<GameCardProps>) {
  const { game, participantName, playfieldName, bestOf = DEFAULT_BEST_OF } = props;
  const shortName = props.participantShortName ?? participantName;

  const status = getGameStatus(game, bestOf);
  const winner = getGameWinner(game, bestOf);
  const scores = formatScore(game);
  const running = getRunningScores(game);
  const slots = getRoundSlots(game, bestOf);
  const { label, badge } = statusConfig[status];

  return (
    <div className={'grow basis-64 border-2 border-sky-800 bg-gray-950 rounded-2xl p-3'}>
      <div className={'flex items-center justify-between text-xs'}>
        <span>
          Round {game.round} · {playfieldName(game.playfieldId)}
        </span>
        <span className={`rounded-lg px-2 py-1 ${badge}`}>{label}</span>
      </div>

      <div className={'mt-2 flex flex-col gap-1'}>
        {SIDES.map((side) => (
          <div key={side} className={'flex items-center justify-between gap-2 text-sm'}>
            <span className={winner === side ? WINNER_CLASS : ''}>
              {getPlayerName(game, side, participantName)}
            </span>
            <span className={`font-bold rounded-lg px-2 py-1 min-w-8 text-center ${badge}`}>
              {scores[side - 1]}
            </span>
          </div>
        ))}
      </div>

      <div className={'mt-3 pt-2 border-t border-sky-800 flex flex-col gap-1 text-sm'}>
        {slots.map((round, index) => (
          <p key={`${game.id}-round-${index + 1}`}>
            R{index + 1}{' '}
            {round ? (
              <>
                <Player
                  id={getPlayerId(game, 1)}
                  starterId={round.startingPlayer}
                  nameOf={shortName}
                />{' '}
                <span className={round.winner ? WINNER_CLASS : ''}>
                  {running[index].side1}:{running[index].side2}
                </span>{' '}
                <Player
                  id={getPlayerId(game, 2)}
                  starterId={round.startingPlayer}
                  nameOf={shortName}
                />
              </>
            ) : (
              '-'
            )}
          </p>
        ))}
      </div>
    </div>
  );
}
