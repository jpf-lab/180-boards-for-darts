import { useState } from 'react';
import type { SubmitEvent } from 'react';
import FormField from './FormField';
import CustomButton from '../CustomButton.tsx';

const pageWrapperStyles = 'max-w-md my-10 px-4';
const introTextStyles = 'text-sm mb-6';
const requiredMarkStyles = 'text-red-600';
const formStyles = 'flex flex-col gap-4';
const fieldsetStyles = 'border border-gray-300 rounded-lg px-4 pt-3 pb-4 flex flex-col gap-4';
const legendStyles = 'font-semibold text-sm px-2';
const actionsStyles = 'flex gap-3 mt-2';

type TournamentFormValues = {
  name: string;
  datetime: string;
  street: string;
  number: string;
  postalcode: string;
  city: string;
  participantIds: string;
  playfieldIds: string;
};

const initialValues: TournamentFormValues = {
  name: '',
  datetime: '',
  street: '',
  number: '',
  postalcode: '',
  city: '',
  participantIds: '',
  playfieldIds: '',
};

function getMinDateTime(): string {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
}

export default function TournamentForm() {
  const [values, setValues] = useState<TournamentFormValues>(initialValues);
  const [resetCounter, setResetCounter] = useState(0);

  function updateField<K extends keyof TournamentFormValues>(
    field: K,
    value: TournamentFormValues[K]
  ) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    console.log('Submit:', values);
    // TODO: API-Call zum Anlegen des Turniers
  }

  function handleReset() {
    setValues(initialValues);
    setResetCounter((count) => count + 1);
  }

  return (
    <div className={`${pageWrapperStyles}`}>
      <p className={`${introTextStyles}`}>
        Fields marked <span className={`${requiredMarkStyles}`}>*</span> are required.
      </p>

      <form onSubmit={handleSubmit} onReset={handleReset} className={`${formStyles}`}>
        <FormField
          key={`name-${resetCounter}`}
          id="name"
          label="Name"
          type="text"
          placeholder="e.g. Summer Dart Championship"
          required
          minLength={3}
          maxLength={100}
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
          errorMessage="Please select a date and time in the future."
          value={values.datetime}
          onChange={(v) => updateField('datetime', v)}
        />

        <fieldset className={`${fieldsetStyles}`}>
          <legend className={`${legendStyles}`}>Location</legend>

          <FormField
            key={`street-${resetCounter}`}
            id="street"
            label="Street"
            type="text"
            placeholder="e.g. Main Street"
            required
            minLength={2}
            pattern="^(?!\d+$).+"
            errorMessage="Street must be at least 2 characters and not only numbers."
            value={values.street}
            onChange={(v) => updateField('street', v)}
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
            errorMessage="Use digits, optionally followed by one letter (e.g. 12 or 12a)."
            value={values.number}
            onChange={(v) => updateField('number', v)}
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
            errorMessage="Must be exactly 5 digits."
            value={values.postalcode}
            onChange={(v) => updateField('postalcode', v)}
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
            errorMessage="City must be at least 2 characters and not only numbers."
            value={values.city}
            onChange={(v) => updateField('city', v)}
          />
        </fieldset>

        {/*<FormField*/}
        {/*  key={`participantIds-${resetCounter}`}*/}
        {/*  id="participantIds"*/}
        {/*  label="Number of Participants"*/}
        {/*  type="number"*/}
        {/*  placeholder="e.g. 16"*/}
        {/*  min={0}*/}
        {/*  errorMessage="Must be zero or greater."*/}
        {/*  value={values.participantIds}*/}
        {/*  onChange={(v) => updateField('participantIds', v)}*/}
        {/*/>*/}

        {/*<FormField*/}
        {/*  key={`playfieldIds-${resetCounter}`}*/}
        {/*  id="playfieldIds"*/}
        {/*  label="Number of Playfields"*/}
        {/*  type="number"*/}
        {/*  placeholder="e.g. 4"*/}
        {/*  min={0}*/}
        {/*  errorMessage="Must be zero or greater."*/}
        {/*  value={values.playfieldIds}*/}
        {/*  onChange={(v) => updateField('playfieldIds', v)}*/}
        {/*/>*/}

        <div className={`${actionsStyles}`}>
          <CustomButton type={'submit'}>Save</CustomButton>
          <CustomButton type={'reset'} variant={'secondary'}>
            Reset
          </CustomButton>
        </div>
      </form>
    </div>
  );
}
