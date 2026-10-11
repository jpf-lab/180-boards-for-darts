import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import FormTemplate from '../components/forms/FormTemplate.tsx';
import Headline from '../components/Headline.tsx';
import Alert from '../components/Alert.tsx';
import LoadingText from '../components/LoadingText.tsx';
import { getPlayfieldById, updatePlayfieldById } from '../utils/playfieldHelper.ts';
import { playfieldFields, playfieldInitialValues } from '../config/playfieldFormConfig.ts';
import type { TournamentPlayfield } from '../types/Tournament.ts';

type PlayfieldEditProps = {
  columns?: number;
};

export default function PlayfieldEdit(props: Readonly<PlayfieldEditProps>) {
  const { id } = useParams();
  const [playfield, setPlayfield] = useState<TournamentPlayfield | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('No playfield id provided.');
      setLoading(false);
      return;
    }

    const playfieldId = id;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      const result = await getPlayfieldById(playfieldId);
      if (cancelled) return;

      if (!result) {
        setError('Failed to load playfield.');
      } else {
        setPlayfield({
          ...playfieldInitialValues,
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

  async function handleSubmit(values: TournamentPlayfield) {
    if (!id) throw new Error('No playfield id provided.');
    await updatePlayfieldById(id, values);
  }

  return (
    <>
      <Headline variant={'h1'}>Edit Playfield</Headline>
      {loading && <LoadingText />}
      {error && <Alert variant={'error'}>{error}</Alert>}
      {!loading && !error && playfield && (
        <FormTemplate<TournamentPlayfield>
          key={id}
          legend={'Playfield'}
          fields={playfieldFields}
          initialValues={playfield}
          onSubmit={handleSubmit}
          columns={props.columns}
          successMessage={'Playfield updated.'}
          resetOnSuccess={false}
        />
      )}
    </>
  );
}
