import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';
import { Link, type LinkProps } from 'react-router-dom';

type CustomButtonStyle = 'primary' | 'secondary' | 'green' | 'red';

const buttonBaseStyle = 'inline-block hover:cursor-pointer px-5 py-2 text-white rounded-2xl';

const variantColor: Record<CustomButtonStyle, string> = {
  primary: 'bg-sky-800 hover:bg-sky-400',
  secondary: 'bg-sky-400 hover:bg-sky-800 ',
  green: 'bg-green-600 hover:bg-green-700',
  red: 'bg-red-600 hover:bg-red-700',
};

type ButtonVariantProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'button';
  buttonstyle?: CustomButtonStyle;
};

type AnchorVariantProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  LinkProps & {
    variant?: 'anchor';
    buttonstyle?: CustomButtonStyle;
  };

type LinkVariantProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  LinkProps & {
    variant?: 'link';
    buttonstyle?: CustomButtonStyle;
  };

export type CustomButtonProps = ButtonVariantProps | AnchorVariantProps | LinkVariantProps;

export default function CustomButton(props: CustomButtonProps) {
  const variant = props.variant || 'button';
  const buttonStyle = props.buttonstyle || 'primary';

  const elementStyle = `${buttonBaseStyle} ${variantColor[buttonStyle]}`;

  return (
    <>
      {variant === 'button' && (
        <button
          {...(props as ButtonVariantProps)}
          className={`${elementStyle} ${props.className ?? ''}`}
          title={props.title}
        />
      )}
      {variant === 'anchor' && (
        <a
          {...(props as AnchorVariantProps)}
          className={`${elementStyle} ${props.className ?? ''}`}
          title={props.title}
        />
      )}
      {variant === 'link' && (
        <Link
          {...(props as LinkVariantProps)}
          className={`${elementStyle} ${props.className ?? ''}`}
          title={props.title}
        />
      )}
    </>
  );
}
