import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, InputHTMLAttributes } from 'react';

const containerStyles = 'flex flex-col gap-1';
const labelBaseStyles = 'text-sm font-medium';
const labelErrorStyles = 'text-red-600';
const labelNormalStyles = '';
const inputBaseStyles =
  'px-3 py-2 rounded-md border text-sm focus:outline-none focus:ring-2 text-gray-600';
const inputErrorStyles = 'border-red-400 focus:ring-red-400';
const inputNormalStyles = 'border-gray-300 focus:ring-sky-400';
const hintStyles = 'text-xs text-red-600';

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

  const labelClasses = `${labelBaseStyles} ${showError ? labelErrorStyles : labelNormalStyles}`;
  const inputClasses = `${inputBaseStyles} ${showError ? inputErrorStyles : inputNormalStyles}`;

  return (
    <div className={`${containerStyles}`}>
      <label htmlFor={id} className={`${labelClasses}`}>
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
        className={`${inputClasses}`}
        {...rest}
      />
      {showHint && (
        <p id={`${id}-error`} className={`${hintStyles}`}>
          {errorMessage}
        </p>
      )}
    </div>
  );
}
