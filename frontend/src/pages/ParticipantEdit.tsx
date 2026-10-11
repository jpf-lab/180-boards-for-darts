import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import FormTemplate from '../components/forms/FormTemplate.tsx';
import Headline from '../components/Headline.tsx';
import Alert from '../components/Alert.tsx';
import LoadingText from '../components/LoadingText.tsx';
import { getParticipantById, updateParticipantById } from '../utils/participantHelper.ts';
import { participantFields, participantInitialValues } from '../config/participantFormConfig.ts';
import type { TournamentParticipant } from '../types/Tournament.ts';

type ParticipantEditProps = {
  columns?: number;
};

export default function ParticipantEdit(props: Readonly<ParticipantEditProps>) {
  const { id } = useParams();
  const [participant, setParticipant] = useState<TournamentParticipant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('No participant id provided.');
      setLoading(false);
      return;
    }

    const participantId = id;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      const result = await getParticipantById(participantId);
      if (cancelled) return;

      if (!result) {
        setError('Failed to load participant.');
      } else {
        setParticipant({
          ...participantInitialValues,
          ...Object.fromEntries(Object.entries(result).map(([key, value]) => [key, value ?? ''])),
        });
      }
      setLoading(false);
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleSubmit(values: TournamentParticipant) {
    if (!id) throw new Error('No participant id provided.');
    await updateParticipantById(id, values);
  }

  return (
    <>
      <Headline variant={'h1'}>Edit Participant</Headline>
      {loading && <LoadingText />}
      {error && <Alert variant={'error'}>{error}</Alert>}
      {!loading && !error && participant && (
        <FormTemplate<TournamentParticipant>
          key={id}
          legend={'Participant'}
          fields={participantFields}
          initialValues={participant}
          onSubmit={handleSubmit}
          columns={props.columns}
          successMessage={'Participant updated.'}
          resetOnSuccess={false}
        />
      )}
    </>
  );
}
