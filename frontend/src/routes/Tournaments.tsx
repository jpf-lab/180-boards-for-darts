import { PencilIcon } from '@heroicons/react/24/solid';
import CustomButton from '../components/CustomButton.tsx';
import { useEffect, useState } from 'react';
import type { TournamentOverview, TournamentOverviewItem } from '../types/Tournament.ts';
import { TrashIcon } from '@heroicons/react/20/solid';
import Headline from '../components/Headline.tsx';
import Alert from '../components/Alert.tsx';
import LoadingText from '../components/LoadingText.tsx';
import { getTournamentOverview } from '../utils/tournamentHelper.ts';

export default function Tournaments() {
  const [tournaments, setTournaments] = useState<TournamentOverview>({
    tournaments: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadTournaments() {
    setLoading(true);
    setError(null);

    const tournaments = await getTournamentOverview();

    if (!tournaments) {
      setError('Failed to load tournaments.');
      setLoading(false);
      return;
    }

    setTournaments(tournaments);

    setLoading(false);
  }

  const thClassname = 'p-2';
  const trBodyClassname = 'even:bg-gray-800 odd:bg-gray-700 border-t-2 border-sky-800';
  const tdClassname = 'p-2';

  useEffect(() => {
    loadTournaments();
  }, []);

  return (
    <>
      <Headline variant={'h1'}>Tournaments</Headline>
      {error && (
        <Alert variant={'error'}>
          <span>{error}</span>
        </Alert>
      )}
      {loading && (
        <div>
          <LoadingText />
        </div>
      )}
      {!error && !loading && (
        <div className={'border-2 border-sky-800 bg-gray-950 rounded-2xl text-left'}>
          <table className={'w-full table-auto'}>
            <thead className={''}>
              <tr className={''}>
                <th className={`${thClassname}`}>Name</th>
                <th className={`${thClassname}`}>Date</th>
                <th className={`${thClassname}`}>Location</th>
                <th className={`${thClassname}`}>Participants</th>
                <th className={`${thClassname}`}>Playfields</th>
                <th className={`${thClassname}`}></th>
                <th className={`${thClassname}`}></th>
              </tr>
            </thead>
            <tbody>
              {tournaments.tournaments?.length ? (
                tournaments.tournaments?.map((tournament: TournamentOverviewItem, index) => (
                  <tr key={'tournamentRow' + index} className={`${trBodyClassname}`}>
                    <td className={`${tdClassname}`}>{tournament.name}</td>
                    <td className={`${tdClassname}`}>
                      {tournament.date ? new Date(tournament.date).toLocaleString() : 'Not found'}
                    </td>
                    <td className={`${tdClassname}`}>{tournament.location?.name || 'Not found'}</td>
                    <td className={`${tdClassname}`}>
                      {tournament.participantIds?.length || 'Not found'}
                    </td>
                    <td className={`${tdClassname}`}>
                      {tournament.playfieldIds?.length || 'Not found'}
                    </td>
                    <td className={`${tdClassname}`}>
                      <CustomButton>
                        <PencilIcon className={'size-3'} title={'Edit'} />
                      </CustomButton>
                    </td>
                    <td className={`${tdClassname}`}>
                      <CustomButton variant={'red'} title={'Delete'}>
                        <TrashIcon className={'size-3'} />
                      </CustomButton>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className={`${trBodyClassname}`}>
                  <td className={`text-center ${tdClassname}`} colSpan={7}>
                    No tournaments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
