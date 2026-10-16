import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import FormTemplate from '../components/forms/FormTemplate.tsx';
import Headline from '../components/Headline.tsx';
import Alert from '../components/Alert.tsx';
import LoadingText from '../components/LoadingText.tsx';
import Fieldset from '../components/forms/Fieldset.tsx';
import EntitySearch from '../components/entity/EntitySearch.tsx';
import SelectedItemsTable from '../components/entity/SelectedItemsTable.tsx';
import {
  createTournament,
  searchLocations,
  searchParticipants,
  searchPlayfields,
  updateTournament,
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
import { addUnique, removeAt, toIds } from '../utils/selection.ts';
import { getTournamentEditData, type TournamentEditData } from '../utils/tournamentHelper.ts';
import type {
  TournamentLocation,
  TournamentParticipant,
  TournamentPlayfield,
} from '../types/Tournament.ts';

const editFields = tournamentFields.map(({ min: _min, ...field }) => field);

export default function TournamentEditor(props: Readonly<{ columns?: number }>) {
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [data, setData] = useState<TournamentEditData | null>(null);
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState<string | null>(null);

  const [location, setLocation] = useState<TournamentLocation | null>(null);
  const [participants, setParticipants] = useState<TournamentParticipant[]>([]);
  const [playfields, setPlayfields] = useState<TournamentPlayfield[]>([]);

  const [searchResetCounter, setSearchResetCounter] = useState(0);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function load(tournamentId: string) {
      const result = await getTournamentEditData(tournamentId);
      if (cancelled) return;

      if (result) {
        setData(result);
        setLocation(result.location);
        setParticipants(result.participants);
        setPlayfields(result.playfields);
      } else {
        setError('Failed to load tournament.');
      }
      setLoading(false);
    }

    void load(id);
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleSubmit(values: TournamentFormValues) {
    if (!location?.id) throw new Error('Please select a location.');

    const payload = {
      name: values.name,
      datetime: datetimeLocalToInstant(values.datetime),
      locationId: location.id,
      participantIds: toIds(participants),
      playfieldIds: toIds(playfields),
    };

    if (id) await updateTournament(id, payload);
    else await createTournament(payload);
  }

  function handleReset() {
    setLocation(data?.location ?? null);
    setParticipants(data?.participants ?? []);
    setPlayfields(data?.playfields ?? []);
    setSearchResetCounter((count) => count + 1);
  }

  return (
    <>
      <Headline variant={'h1'}>{isEdit ? 'Edit Tournament' : 'Create Tournament'}</Headline>
      {loading && <LoadingText />}
      {error && <Alert variant={'error'}>{error}</Alert>}
      {!loading && !error && (
        <FormTemplate<TournamentFormValues>
          key={id}
          legend={'Tournament'}
          fields={isEdit ? editFields : tournamentFields}
          initialValues={data?.values ?? tournamentInitialValues}
          onSubmit={handleSubmit}
          onReset={handleReset}
          columns={props.columns}
          successMessage={isEdit ? 'Tournament updated.' : 'Tournament created.'}
          resetOnSuccess={!isEdit}
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
                key={`location-search-${searchResetCounter}`}
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
                key={`participant-search-${searchResetCounter}`}
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
                key={`playfield-search-${searchResetCounter}`}
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
      )}
    </>
  );
}
