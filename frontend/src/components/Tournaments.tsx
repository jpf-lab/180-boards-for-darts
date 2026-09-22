import { PencilIcon } from '@heroicons/react/24/solid';
import CustomButton from './CustomButton.tsx';
import { useEffect, useState } from 'react';
import type { TournamentOverview } from '../types/Tournament.ts';
import { TrashIcon } from '@heroicons/react/20/solid';

export default function Tournaments() {
  const [tournaments, setTournaments] = useState<TournamentOverview>({
    tournaments: [],
  });

  function loadTournaments() {
    //TODO: axios call to variable
    const response: TournamentOverview = {
      tournaments: [
        //TODO: remove examples
        {
          name: 'Name1',
          date: Date.now(),
          location: 'Strasse 1, 12345 Stadt',
          participants: ['1', '2', '3', '4'],
          playfields: ['1'],
        },
      ],
    };

    setTournaments(response);
  }

  const thClassname = 'p-2';
  const trBodyClassname = 'even:bg-gray-800 odd:bg-gray-700 border-t-2 border-sky-800';
  const tdClassname = 'p-2';

  useEffect(() => {
    loadTournaments();
  }, []);

  return (
    <>
      <h1>Tournaments</h1>
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
            {tournaments.tournaments.map((tournament, index) => (
              <tr key={'tournamentRow' + index} className={`${trBodyClassname}`}>
                <td className={`${tdClassname}`}>{tournament.name}</td>
                <td className={`${tdClassname}`}>{new Date(tournament.date).toLocaleString()}</td>
                <td className={`${tdClassname}`}>{tournament.location}</td>
                <td className={`${tdClassname}`}>{tournament.participants.length}</td>
                <td className={`${tdClassname}`}>{tournament.playfields.length}</td>
                <td className={`${tdClassname}`}>
                  <CustomButton>
                    <PencilIcon className={'size-3'} />
                  </CustomButton>
                </td>
                <td className={`${tdClassname}`}>
                  <CustomButton variant={'red'}>
                    <TrashIcon className={'size-3'} />
                  </CustomButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
