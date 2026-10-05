import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, InputHTMLAttributes } from 'react';

type FormFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  errorMessage?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'value' | 'onChange'>;

export default function FormField(props: FormFieldProps) {
  const errorMessage = props.errorMessage ?? 'This field is invalid.';

  const inputRef = useRef<HTMLInputElement>(null);
  const [touched, setTouched] = useState(false);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    setIsValid(inputRef.current?.checkValidity() ?? true);
  }, [props.value]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    props.onChange(event.target.value);
    setTouched(true);
  }

  const showError = touched && !isValid;
  const showHint = showError && props.value.trim() !== '';

  return (
    <div className={`flex flex-col gap-1`}>
      <label htmlFor={props.id} className={`text-sm font-medium ${showError && 'text-red-500'}`}>
        {props.label}
        {props.required && ' *'}
      </label>
      <input
        ref={inputRef}
        required={props.required}
        aria-describedby={showHint ? `${props.id}-error` : undefined}
        className={`px-3 py-2 rounded-md border text-sm focus:outline-none focus:ring-2 text-gray-600 ${showError ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-sky-400'}`}
        {...props}
        onChange={handleChange}
      />
      {showHint && (
        <p id={`${props.id}-error`} className={`text-xs text-red-500`}>
          {errorMessage}
        </p>
      )}
    </div>
  );
}
