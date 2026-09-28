// pages/TournamentEdit.tsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { TournamentOverviewItem } from '../types/Tournament';
import { getTournamentById } from '../api/tournaments.ts';
import Headline from '../components/Headline';
import Alert from '../components/Alert';
import LoadingText from '../components/LoadingText';
import TournamentForm from './forms/TournamentForm.tsx';

export default function TournamentEdit() {
  const { id } = useParams<{ id: string }>();
  const [tournament, setTournament] = useState<TournamentOverviewItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!id) return;
      setLoading(true);
      setError(null);

      const result = await getTournamentById(id);

      if (!result) {
        setError('Failed to load tournament.');
      } else {
        setTournament(result);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  return (
    <>
      {loading && <LoadingText />}
      {!loading && error && (
        <Alert variant="error">
          <span>{error}</span>
        </Alert>
      )}
      {!loading && !error && !tournament && (
        <Alert variant="error">
          <span>Tournament not found</span>
        </Alert>
      )}
      {!loading && !error && tournament && (
        <div>
          <Headline variant="h1">{tournament.name}</Headline>
          <TournamentForm />
        </div>
      )}
    </>
  );
}
