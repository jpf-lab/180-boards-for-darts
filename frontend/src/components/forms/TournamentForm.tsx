import { useEffect, useState } from 'react';
import type { SubmitEvent } from 'react';
import FormField from './FormField';
import CustomButton from '../CustomButton.tsx';
import Fieldset from './Fieldset.tsx';
import LoadingText from '../LoadingText.tsx';
import Alert from '../Alert.tsx';
import { getTournamentDetails } from '../../utils/tournamentHelper.ts';
import type {
  TournamentLocation,
  TournamentParticipant,
  TournamentPlayfield,
} from '../../types/Tournament.ts';
import { TrashIcon } from '@heroicons/react/20/solid';

type TournamentFormVariant = 'create' | 'edit' | 'details';

export type TournamentFormValues = {
  name: string;
  datetime: string;
  location: TournamentLocation;
  participants: TournamentParticipant[];
  playfields: TournamentPlayfield[];
};

const initialValues: TournamentFormValues = {
  name: '',
  datetime: '',
  location: {
    street: '',
    number: '',
    postalcode: '',
    city: '',
  },
  participants: [],
  playfields: [],
};

const thClassname = 'p-2';
const trBodyClassname = 'even:bg-gray-800 odd:bg-gray-700 border-t-2 border-sky-800';
const tdClassname = 'p-2';

function getMinDateTime(): string {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
}

async function getTournamentValues(tournamentId: string): Promise<TournamentFormValues | null> {
  const tournamentDetails = await getTournamentDetails(tournamentId);
  if (tournamentDetails) {
    return tournamentDetails;
  }
  return null;
}

type TournamentFormProps = {
  variant: TournamentFormVariant;
  tournamentId?: string;
};

export default function TournamentForm(props: Readonly<TournamentFormProps>) {
  const [values, setValues] = useState<TournamentFormValues>(initialValues);
  const [resetCounter, setResetCounter] = useState(0);
  const [loading, setLoading] = useState(props.variant !== 'create');
  const [error, setError] = useState<string | null>(null);

  const readOnly = props.variant === 'details';

  useEffect(() => {
    if (props.variant === 'create') {
      setLoading(false);
      return;
    }

    if (!props.tournamentId) {
      setError('No tournament id provided.');
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      const fetched = await getTournamentValues(props.tournamentId!);

      if (cancelled) return;

      if (!fetched) {
        setError('Failed to load tournament.');
        setLoading(false);
        return;
      }

      setValues(fetched);
      setLoading(false);
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [props.variant, props.tournamentId]);

  function updateField<K extends keyof TournamentFormValues>(
    field: K,
    value: TournamentFormValues[K]
  ) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function updateLocationField<K extends keyof TournamentFormValues['location']>(
    field: K,
    value: TournamentFormValues['location'][K]
  ) {
    setValues((prev) => ({
      ...prev,
      location: { ...prev.location, [field]: value },
    }));
  }

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    console.log('Submit:', values);
    // TODO: API-Call zum Anlegen/Bearbeiten des Turniers
  }

  function handleReset() {
    setValues(initialValues);
    setResetCounter((count) => count + 1);
  }

  if (loading) {
    return <LoadingText />;
  }

  if (error) {
    return <Alert variant={'error'}>{error}</Alert>;
  }

  return (
    <div className={`max-w-md my-10`}>
      <form onSubmit={handleSubmit} onReset={handleReset}>
        <div className={'flex gap-4 mb-4'}>
          <Fieldset legend={'Tournament'}>
            <FormField
              key={`name-${resetCounter}`}
              id="name"
              label="Name"
              type="text"
              placeholder="e.g. Summer Dart Championship"
              required
              minLength={3}
              maxLength={100}
              disabled={readOnly}
              errorMessage="Name must be between 3 and 100 characters."
              value={values.name}
              onChange={(v) => updateField('name', v)}
            />

            <FormField
              key={`datetime-${resetCounter}`}
              id="datetime"
              label="Date & Time"
              type="datetime-local"
              required
              min={getMinDateTime()}
              disabled={readOnly}
              errorMessage="Please select a date and time in the future."
              value={values.datetime}
              onChange={(v) => updateField('datetime', v)}
            />
          </Fieldset>
          <Fieldset legend={'Location'}>
            <FormField
              key={`street-${resetCounter}`}
              id="street"
              label="Street"
              type="text"
              placeholder="e.g. Main Street"
              required
              minLength={2}
              pattern="^(?!\d+$).+"
              disabled={readOnly}
              errorMessage="Street must be at least 2 characters and not only numbers."
              value={values.location.street ? values.location.street : ''}
              onChange={(v) => updateLocationField('street', v)}
            />

            <FormField
              key={`number-${resetCounter}`}
              id="number"
              label="House Number"
              type="text"
              placeholder="e.g. 12a"
              required
              pattern="^[0-9]+[a-zA-Z]?$"
              title="Digits, optionally followed by one letter"
              disabled={readOnly}
              errorMessage="Use digits, optionally followed by one letter (e.g. 12 or 12a)."
              value={values.location.number ? values.location.number : ''}
              onChange={(v) => updateLocationField('number', v)}
            />

            <FormField
              key={`postalcode-${resetCounter}`}
              id="postalcode"
              label="Postal Code"
              type="text"
              placeholder="e.g. 10115"
              required
              pattern="[0-9]{5}"
              maxLength={5}
              inputMode="numeric"
              title="German postal code: exactly 5 digits"
              disabled={readOnly}
              errorMessage="Must be exactly 5 digits."
              value={values.location.postalcode ? values.location.postalcode : ''}
              onChange={(v) => updateLocationField('postalcode', v)}
            />

            <FormField
              key={`city-${resetCounter}`}
              id="city"
              label="City"
              type="text"
              placeholder="e.g. Berlin"
              required
              minLength={2}
              pattern="^(?!\d+$).+"
              disabled={readOnly}
              errorMessage="City must be at least 2 characters and not only numbers."
              value={values.location.city ? values.location.city : ''}
              onChange={(v) => updateLocationField('city', v)}
            />
          </Fieldset>
          <Fieldset legend={'Participants'} className={'h-full'}>
            <div
              className={
                'border-2 border-sky-800 bg-gray-950 text-left rounded-t-2xl border-separate border-spacing-0'
              }
            >
              <table className={'table-auto w-full'}>
                <thead className={''}>
                  <tr className={''}>
                    <th className={`${thClassname}`}>ID</th>
                    <th className={`${thClassname}`}>Firstname</th>
                    <th className={`${thClassname}`}>Lastname</th>
                    <th className={`${thClassname}`}></th>
                  </tr>
                </thead>
                <tbody>
                  {values.participants?.length ? (
                    values.participants?.map((participant: TournamentParticipant, index) => (
                      <tr key={'tournamentRow' + index} className={`${trBodyClassname}`}>
                        <td className={`${tdClassname}`}>{participant.id}</td>
                        <td className={`${tdClassname}`}>{participant.firstname}</td>
                        <td className={`${tdClassname}`}>{participant.lastname}</td>
                        <td className={`${tdClassname}`}>
                          <div className={'flex items-center justify-center'}>
                            <CustomButton buttonstyle={'red'} title={'Delete'}>
                              <TrashIcon className={'size-3'} />
                            </CustomButton>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className={`${trBodyClassname}`}>
                      <td className={`text-center ${tdClassname}`} colSpan={4}>
                        No participants found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Fieldset>
          <Fieldset legend={'Playfields'} className={'h-full'}>
            <div
              className={
                'border-2 border-sky-800 bg-gray-950 text-left rounded-t-2xl border-separate border-spacing-0'
              }
            >
              <table className={'table-auto w-full'}>
                <thead className={''}>
                  <tr className={''}>
                    <th className={`${thClassname}`}>ID</th>
                    <th className={`${thClassname}`}>Name</th>
                    <th className={`${thClassname}`}></th>
                  </tr>
                </thead>
                <tbody>
                  {values.playfields?.length ? (
                    values.playfields?.map((playfield: TournamentPlayfield, index) => (
                      <tr key={'tournamentRow' + index} className={`${trBodyClassname}`}>
                        <td className={`${tdClassname}`}>{playfield.id}</td>
                        <td className={`${tdClassname}`}>{playfield.name}</td>
                        <td className={`${tdClassname}`}>
                          <div className={'flex items-center justify-center'}>
                            <CustomButton buttonstyle={'red'} title={'Delete'}>
                              <TrashIcon className={'size-3'} />
                            </CustomButton>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className={`${trBodyClassname}`}>
                      <td className={`text-center ${tdClassname}`} colSpan={3}>
                        No playfields found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Fieldset>
        </div>

        {!readOnly && (
          <p className={`text-sm mb-6`}>
            <span>*</span> required
          </p>
        )}

        {!readOnly && (
          <div className={`flex gap-3 mt-2`}>
            <CustomButton type={'submit'}>Save</CustomButton>
            <CustomButton type={'reset'} buttonstyle={'secondary'}>
              Reset
            </CustomButton>
          </div>
        )}
      </form>
    </div>
  );
}
