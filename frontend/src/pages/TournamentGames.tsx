import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import Headline from '../components/Headline.tsx';
import Alert from '../components/Alert.tsx';
import LoadingText from '../components/LoadingText.tsx';
import CustomButton from '../components/CustomButton.tsx';
import GamesOverview from '../components/games/GamesOverview.tsx';
import TournamentBracket from '../components/games/TournamentBracket.tsx';
import { createNameResolvers } from '../components/games/useGameNames.ts';
import { getGamesByTournament } from '../api/tournaments.ts';
import { getTournamentEditData, type TournamentEditData } from '../utils/tournamentHelper.ts';
import type { TournamentGame } from '../types/Tournament.ts';

type View = 'list' | 'cards';

export default function TournamentGames() {
  const { id } = useParams();

  const [tournament, setTournament] = useState<TournamentEditData | null>(null);
  const [games, setGames] = useState<TournamentGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<View>('list');

  useEffect(() => {
    if (!id) {
      setError('No tournament id provided.');
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load(tournamentId: string) {
      setLoading(true);
      setError(null);

      try {
        const [tournamentData, gameList] = await Promise.all([
          getTournamentEditData(tournamentId),
          getGamesByTournament(tournamentId),
        ]);
        if (cancelled) return;

        if (!tournamentData) {
          setError('Failed to load tournament.');
        } else {
          setTournament(tournamentData);
          setGames(gameList);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) setError('Failed to load games.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load(id);
    return () => {
      cancelled = true;
    };
  }, [id]);

  const { participantName, participantShortName, playfieldName } = createNameResolvers(
    tournament?.participants ?? [],
    tournament?.playfields ?? []
  );

  return (
    <>
      <Headline variant={'h1'}>
        {tournament ? `Games: ${tournament.values.name}` : 'Games'}
      </Headline>
      {loading && <LoadingText />}
      {error && <Alert variant={'error'}>{error}</Alert>}
      {!loading && !error && (
        <>
          <div className={'flex gap-3 mb-4'}>
            <CustomButton variant={'link'} to={'/tournaments'} buttonstyle={'secondary'}>
              Back
            </CustomButton>
            <CustomButton
              type={'button'}
              buttonstyle={view === 'list' ? 'primary' : 'secondary'}
              onClick={() => setView('list')}
            >
              List
            </CustomButton>
            <CustomButton
              type={'button'}
              buttonstyle={view === 'cards' ? 'primary' : 'secondary'}
              onClick={() => setView('cards')}
            >
              Cards
            </CustomButton>
          </div>

          <Headline variant={'h3'}>Games</Headline>
          <GamesOverview
            games={games}
            variant={view}
            participantName={participantName}
            participantShortName={participantShortName}
            playfieldName={playfieldName}
          />

          <Headline variant={'h3'}>Bracket</Headline>
          <TournamentBracket games={games} participantName={participantName} />
        </>
      )}
    </>
  );
}
