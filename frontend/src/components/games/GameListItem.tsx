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
  sideOf,
  type Side,
} from '../../utils/gameScore.ts';
import { STARTER_CLASS, statusConfig, WINNER_CLASS, type GameViewProps } from './gameStatus.ts';

type GameListItemProps = GameViewProps & { game: TournamentGame };

const tdClassname = 'p-2';

export default function GameListItem(props: Readonly<GameListItemProps>) {
  const { game, participantName, playfieldName, bestOf = DEFAULT_BEST_OF } = props;

  const status = getGameStatus(game, bestOf);
  const winner = getGameWinner(game, bestOf);
  const [score1, score2] = formatScore(game);
  const running = getRunningScores(game);
  const slots = getRoundSlots(game, bestOf);
  const { label, badge } = statusConfig[status];

  // Only the player who started the round is highlighted
  const starterClass = (startingPlayer: string, side: Side) =>
    startingPlayer === getPlayerId(game, side) ? STARTER_CLASS : '';

  return (
    <details
      open={status === 'running'}
      className={'border-2 border-sky-800 bg-gray-950 rounded-2xl'}
    >
      <summary className={'flex items-center gap-4 p-3 cursor-pointer'}>
        <span className={'text-sm w-36'}>
          R{game.round} · {playfieldName(game.playfieldId)}
        </span>
        <span className={'grow text-center'}>
          <span className={winner === 1 ? WINNER_CLASS : ''}>
            {getPlayerName(game, 1, participantName)}
          </span>{' '}
          vs.{' '}
          <span className={winner === 2 ? WINNER_CLASS : ''}>
            {getPlayerName(game, 2, participantName)}
          </span>
        </span>
        <span className={`text-xs rounded-lg px-2 py-1 ${badge}`}>{label}</span>
        <span className={`font-bold rounded-lg px-2 py-1 ${badge}`}>
          {score1} : {score2}
        </span>
      </summary>

      <table className={'table-fixed w-full text-left text-sm'}>
        <tbody>
          {slots.map((round, index) => {
            // Only the number of the round winner is highlighted
            const roundWinner = sideOf(game, round?.winner);
            return (
              <tr
                key={`${game.id}-slot-${index + 1}`}
                className={'even:bg-gray-800 odd:bg-gray-700 border-t-2 border-sky-800'}
              >
                <td className={`${tdClassname} w-12`}>R{index + 1}</td>
                {round ? (
                  <>
                    <td
                      className={`${tdClassname} text-right truncate ${starterClass(round.startingPlayer, 1)}`}
                    >
                      {getPlayerName(game, 1, participantName)}
                    </td>
                    <td className={`${tdClassname} w-20 text-center`}>
                      <span className={roundWinner === 1 ? WINNER_CLASS : ''}>
                        {running[index].side1}
                      </span>
                      {' : '}
                      <span className={roundWinner === 2 ? WINNER_CLASS : ''}>
                        {running[index].side2}
                      </span>
                    </td>
                    <td
                      className={`${tdClassname} text-left truncate ${starterClass(round.startingPlayer, 2)}`}
                    >
                      {getPlayerName(game, 2, participantName)}
                    </td>
                  </>
                ) : (
                  <td className={`${tdClassname} text-center`} colSpan={3}>
                    -
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </details>
  );
}
