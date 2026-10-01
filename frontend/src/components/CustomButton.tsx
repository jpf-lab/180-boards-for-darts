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

type CustomButtonProps = ButtonVariantProps | AnchorVariantProps | LinkVariantProps;

export default function CustomButton(props: CustomButtonProps) {
  const variant = props.variant || 'button';
  const buttonStyle = props.buttonstyle || 'primary';

  const elementStyle = `${buttonBaseStyle} ${variantColor[buttonStyle]}`;

  return (
    <>
      {variant === 'button' && (
        <button
          className={`${elementStyle}`}
          title={props.title}
          {...(props as ButtonVariantProps)}
        />
      )}
      {variant === 'anchor' && (
        <a className={`${elementStyle}`} title={props.title} {...(props as AnchorVariantProps)} />
      )}
      {variant === 'link' && (
        <Link className={`${elementStyle}`} title={props.title} {...(props as LinkVariantProps)} />
      )}
    </>
  );
}
