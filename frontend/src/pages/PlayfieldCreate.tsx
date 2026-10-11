import FormTemplate from '../components/forms/FormTemplate.tsx';
import Headline from '../components/Headline.tsx';
import { createPlayfieldFromForm } from '../utils/playfieldHelper.ts';
import { playfieldFields, playfieldInitialValues } from '../config/playfieldFormConfig.ts';
import type { TournamentPlayfield } from '../types/Tournament.ts';

type PlayfieldCreateProps = {
  columns?: number;
};

export default function PlayfieldCreate(props: Readonly<PlayfieldCreateProps>) {
  async function handleSubmit(values: TournamentPlayfield) {
    await createPlayfieldFromForm(values);
  }

  return (
    <>
      <Headline variant={'h1'}>Create Playfield</Headline>
      <FormTemplate<TournamentPlayfield>
        legend={'Playfield'}
        fields={playfieldFields}
        initialValues={playfieldInitialValues}
        onSubmit={handleSubmit}
        columns={props.columns}
        successMessage={'Playfield created.'}
      />
    </>
  );
}
