import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FormTemplate from '../components/forms/FormTemplate.tsx';
import Headline from '../components/Headline.tsx';
import Alert from '../components/Alert.tsx';
import LoadingText from '../components/LoadingText.tsx';
import { getLocationById, updateLocationById } from '../utils/locationHelper.ts';
import { locationFields, locationInitialValues } from '../config/locationFormConfig.ts';
import type { TournamentLocation } from '../types/Tournament.ts';

type LocationEditProps = {
  columns?: number;
};

export default function LocationEdit(props: Readonly<LocationEditProps>) {
  const { id } = useParams();
  const [location, setLocation] = useState<TournamentLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('No location id provided.');
      setLoading(false);
      return;
    }

    const locationId = id;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      const result = await getLocationById(locationId);
      if (cancelled) return;

      if (!result) {
        setError('Failed to load location.');
      } else {
        setLocation({
          ...locationInitialValues,
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

  async function handleSubmit(values: TournamentLocation) {
    if (!id) throw new Error('No location id provided.');
    await updateLocationById(id, values);
  }

  return (
    <>
      <Headline variant={'h1'}>Edit Location</Headline>
      {loading && <LoadingText />}
      {error && <Alert variant={'error'}>{error}</Alert>}
      {!loading && !error && location && (
        <FormTemplate<TournamentLocation>
          key={id}
          legend={'Location'}
          fields={locationFields}
          initialValues={location}
          onSubmit={handleSubmit}
          columns={props.columns}
          successMessage={'Location updated.'}
          resetOnSuccess={false}
        />
      )}
    </>
  );
}
