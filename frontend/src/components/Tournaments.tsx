import { PencilIcon } from '@heroicons/react/24/solid';
import CustomButton from './CustomButton.tsx';
import { useEffect, useState } from 'react';
import type { TournamentOverview, TournamentOverviewItem } from '../types/Tournament.ts';
import { ExclamationCircleIcon, TrashIcon } from '@heroicons/react/20/solid';
import { getTournamentOverview } from '../api/tournaments.ts';
import Headline from './Headline.tsx';

export default function Tournaments() {
  const [tournaments, setTournaments] = useState<TournamentOverview>({
    tournaments: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadTournaments() {
    setLoading(true);
    setError(null);

    try {
      const response: TournamentOverview = await getTournamentOverview();
      setTournaments(response);
    } catch (err) {
      console.error('Failed to load tournaments', err);
      setError('Failed to load tournaments.');
    } finally {
      setLoading(false);
    }
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
      {error ? (
        <div
          className={'p-4 my-4 rounded-2xl bg-red-100 text-red-700 flex items-center'}
          role="alert"
        >
          <ExclamationCircleIcon className={'size-5 inline-block mr-4'} />
          <span>{error}</span>
        </div>
      ) : loading ? (
        <>Loading...</>
      ) : (
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
                      {tournament.date ? new Date(tournament.date).toLocaleString() : 'Not set'}
                    </td>
                    <td className={`${tdClassname}`}>{tournament.location?.name}</td>
                    <td className={`${tdClassname}`}>{tournament.participants?.length}</td>
                    <td className={`${tdClassname}`}>{tournament.playfields?.length}</td>
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
                    Not tournaments found
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
