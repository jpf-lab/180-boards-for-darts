import type { MouseEventHandler, PropsWithChildren } from 'react';

type CustomButtonProps = PropsWithChildren & {
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export default function CustomButton(props: CustomButtonProps) {
  return (
    <button
      onClick={props.onClick}
      className={
        'bg-sky-800 hover:bg-sky-400 hover:cursor-pointer px-5 py-2 text-white rounded-2xl'
      }
    >
      {props.children}
    </button>
  );
}
