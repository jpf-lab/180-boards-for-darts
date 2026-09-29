import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, InputHTMLAttributes } from 'react';

type FormFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  errorMessage?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'value' | 'onChange'>;

export default function FormField({
  id,
  label,
  value,
  onChange,
  errorMessage = 'This field is invalid.',
  required,
  ...rest
}: FormFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [touched, setTouched] = useState(false);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    setIsValid(inputRef.current?.checkValidity() ?? true);
  }, [value]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.target.value);
    setTouched(true);
  }

  const showError = touched && !isValid;
  const showHint = showError && value.trim() !== '';

  return (
    <div className={`flex flex-col gap-1`}>
      <label htmlFor={id} className={`text-sm font-medium ${showError && 'text-red-500'}`}>
        {label}
        {required && ' *'}
      </label>
      <input
        ref={inputRef}
        id={id}
        value={value}
        onChange={handleChange}
        required={required}
        aria-describedby={showHint ? `${id}-error` : undefined}
        className={`px-3 py-2 rounded-md border text-sm focus:outline-none focus:ring-2 text-gray-600 ${showError ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-sky-400'}`}
        {...rest}
      />
      {showHint && (
        <p id={`${id}-error`} className={`text-xs text-red-500`}>
          {errorMessage}
        </p>
      )}
    </div>
  );
}
