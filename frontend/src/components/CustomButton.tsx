import type { ButtonHTMLAttributes } from 'react';

type CustomButtonVariant = 'primary' | 'secondary' | 'green' | 'red';

const variantColor: Record<CustomButtonVariant, string> = {
  primary: 'bg-sky-800 hover:bg-sky-400',
  secondary: 'bg-sky-400 hover:bg-sky-800 ',
  green: 'bg-green-600 hover:bg-green-700',
  red: 'bg-red-600 hover:bg-red-700',
};

type CustomButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: CustomButtonVariant;
};

export default function CustomButton({ variant = 'primary', ...props }: CustomButtonProps) {
  return (
    <button
      onClick={props.onClick}
      className={`hover:cursor-pointer px-5 py-2 text-white rounded-2xl ${variantColor[variant]}`}
    >
      {props.children}
    </button>
  );
}
