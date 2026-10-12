import { useState } from 'react';
import FormTemplate from '../components/forms/FormTemplate.tsx';
import Headline from '../components/Headline.tsx';
import Fieldset from '../components/forms/Fieldset.tsx';
import EntitySearch from '../components/entity/EntitySearch.tsx';
import SelectedItemsTable from '../components/entity/SelectedItemsTable.tsx';
import {
  createTournament,
  searchLocations,
  searchParticipants,
  searchPlayfields,
} from '../api/tournaments.ts';
import {
  tournamentFields,
  tournamentInitialValues,
  type TournamentFormValues,
} from '../config/tournamentFormConfig.ts';
import {
  locationColumnTitles,
  locationToRow,
  participantColumnTitles,
  participantToRow,
  playfieldColumnTitles,
  playfieldToRow,
} from '../config/entityTableConfig.ts';
import {
  locationSearchForm,
  participantSearchForm,
  playfieldSearchForm,
} from '../config/searchFormConfig.ts';
import { datetimeLocalToInstant } from '../utils/dateTime.ts';
import type {
  TournamentLocation,
  TournamentParticipant,
  TournamentPlayfield,
} from '../types/Tournament.ts';

type WithId = { id?: string };

function addUnique<T extends WithId>(list: T[], item: T): T[] {
  return list.some((entry) => entry.id === item.id) ? list : [...list, item];
}

function removeAt<T>(list: T[], index: number): T[] {
  return list.filter((_, i) => i !== index);
}

function toIds(list: WithId[]): string[] {
  return list.flatMap((entry) => (entry.id ? [entry.id] : []));
}

export default function TournamentCreate(props: Readonly<{ columns?: number }>) {
  const [location, setLocation] = useState<TournamentLocation | null>(null);
  const [participants, setParticipants] = useState<TournamentParticipant[]>([]);
  const [playfields, setPlayfields] = useState<TournamentPlayfield[]>([]);

  async function handleSubmit(values: TournamentFormValues) {
    if (!location?.id) throw new Error('Please select a location.');

    await createTournament({
      name: values.name,
      datetime: datetimeLocalToInstant(values.datetime),
      locationId: location.id,
      participantIds: toIds(participants),
      playfieldIds: toIds(playfields),
    });
  }

  function handleReset() {
    setLocation(null);
    setParticipants([]);
    setPlayfields([]);
  }

  return (
    <>
      <Headline variant={'h1'}>Create Tournament</Headline>
      <FormTemplate<TournamentFormValues>
        legend={'Tournament'}
        fields={tournamentFields}
        initialValues={tournamentInitialValues}
        onSubmit={handleSubmit}
        onReset={handleReset}
        columns={props.columns}
        successMessage={'Tournament created.'}
      >
        <div className={'flex flex-wrap gap-4 mb-4'}>
          <Fieldset legend={'Location'}>
            <SelectedItemsTable<TournamentLocation>
              columnTitles={locationColumnTitles}
              items={location ? [location] : []}
              toRow={locationToRow}
              onRemove={() => setLocation(null)}
            />
            <EntitySearch<TournamentLocation>
              form={locationSearchForm}
              columnTitles={locationColumnTitles}
              toRow={locationToRow}
              search={searchLocations}
              onAdd={setLocation}
              isAdded={(item) => item.id === location?.id}
            />
          </Fieldset>

          <Fieldset legend={'Participants'}>
            <SelectedItemsTable<TournamentParticipant>
              columnTitles={participantColumnTitles}
              items={participants}
              toRow={participantToRow}
              onRemove={(index) => setParticipants((prev) => removeAt(prev, index))}
            />
            <EntitySearch<TournamentParticipant>
              form={participantSearchForm}
              columnTitles={participantColumnTitles}
              toRow={participantToRow}
              search={searchParticipants}
              onAdd={(item) => setParticipants((prev) => addUnique(prev, item))}
              isAdded={(item) => participants.some((entry) => entry.id === item.id)}
            />
          </Fieldset>

          <Fieldset legend={'Playfields'}>
            <SelectedItemsTable<TournamentPlayfield>
              columnTitles={playfieldColumnTitles}
              items={playfields}
              toRow={playfieldToRow}
              onRemove={(index) => setPlayfields((prev) => removeAt(prev, index))}
            />
            <EntitySearch<TournamentPlayfield>
              form={playfieldSearchForm}
              columnTitles={playfieldColumnTitles}
              toRow={playfieldToRow}
              search={searchPlayfields}
              onAdd={(item) => setPlayfields((prev) => addUnique(prev, item))}
              isAdded={(item) => playfields.some((entry) => entry.id === item.id)}
            />
          </Fieldset>
        </div>
      </FormTemplate>
    </>
  );
}
