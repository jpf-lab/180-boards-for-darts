import FormTemplate from '../components/forms/FormTemplate.tsx';
import Headline from '../components/Headline.tsx';
import { createLocationFromForm } from '../utils/locationHelper.ts';
import { locationFields, locationInitialValues } from '../config/locationFormConfig.ts';
import type { TournamentLocation } from '../types/Tournament.ts';

type LocationCreateProps = {
  columns?: number;
};

export default function LocationCreate(props: Readonly<LocationCreateProps>) {
  async function handleSubmit(values: TournamentLocation) {
    await createLocationFromForm(values);
  }

  return (
    <>
      <Headline variant={'h1'}>Create Location</Headline>
      <FormTemplate<TournamentLocation>
        legend={'Location'}
        fields={locationFields}
        initialValues={locationInitialValues}
        onSubmit={handleSubmit}
        columns={props.columns}
      />
    </>
  );
}
