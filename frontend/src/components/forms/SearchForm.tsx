import { type SubmitEvent, useState } from 'react';
import Fieldset from './Fieldset.tsx';
import FormField from './FormField.tsx';
import CustomButton from '../CustomButton.tsx';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

export type SearchFormConfig = {
  legend: string;
  id: string;
  label: string;
  placeholder?: string;
  minLength?: number;
  errormessage?: string;
};

type SearchFormProps = SearchFormConfig & {
  onSearch: (query: string) => Promise<void> | void;
  onReset?: () => void;
  loading?: boolean;
};

export default function SearchForm(props: Readonly<SearchFormProps>) {
  const { legend, id, label, placeholder, minLength, errormessage, loading } = props;

  const [query, setQuery] = useState('');
  const [resetCounter, setResetCounter] = useState(0);

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    const trimmed = query.trim();
    if (loading || trimmed.length < (minLength ?? 1)) return;
    await props.onSearch(trimmed);
  }

  function handleReset() {
    setQuery('');
    setResetCounter((count) => count + 1);
    props.onReset?.();
  }

  return (
    <form onSubmit={handleSubmit} onReset={handleReset}>
      <Fieldset legend={legend}>
        <FormField
          key={`${id}-${resetCounter}`}
          id={id}
          label={label}
          type="search"
          placeholder={placeholder}
          required
          minLength={minLength}
          errormessage={errormessage}
          readOnly={loading}
          value={query}
          onChange={setQuery}
        />
        <div className={'flex gap-3'}>
          <CustomButton type={'submit'} disabled={loading}>
            <MagnifyingGlassIcon className={'size-5 inline-block mr-2'} />
            <span>Search</span>
          </CustomButton>
          <CustomButton type={'reset'} buttonstyle={'secondary'} disabled={loading}>
            Reset
          </CustomButton>
        </div>
      </Fieldset>
    </form>
  );
}
