import type { TournamentGame } from '../../types/Tournament.ts';
import { getGroupLabel, groupGames } from '../../utils/gameScore.ts';
import GameCard from './GameCard.tsx';
import GameListItem from './GameListItem.tsx';
import type { GameViewProps } from './gameStatus.ts';

type GamesOverviewProps = GameViewProps & {
  games: TournamentGame[];
  /** 'list' = variant A, 'cards' = variant B */
  variant?: 'list' | 'cards';
};

export default function GamesOverview(props: Readonly<GamesOverviewProps>) {
  const { games, variant = 'list', ...view } = props;

  if (games.length === 0) {
    return <p className={'text-sm'}>No games found</p>;
  }

  return (
    <div className={'flex flex-col gap-6'}>
      {groupGames(games).map(([group, groupList]) => (
        <section key={`group-${group}`}>
          <p className={'font-bold mb-2'}>{getGroupLabel(group)}</p>
          {variant === 'list' ? (
            <div className={'flex flex-col gap-2'}>
              {groupList.map((game) => (
                <GameListItem key={game.id} game={game} {...view} />
              ))}
            </div>
          ) : (
            <div className={'flex flex-wrap gap-4'}>
              {groupList.map((game) => (
                <GameCard key={game.id} game={game} {...view} />
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
