import type { ComponentPropsWithoutRef } from 'react';

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

type HeadlineProps = Pick<ComponentPropsWithoutRef<'h1'>, 'className' | 'children'> & {
  variant?: HeadingTag;
};

const variantClasses: Record<HeadingTag, string> = {
  h1: 'text-5xl font-bold',
  h2: 'text-4xl font-bold',
  h3: 'text-3xl font-semibold',
  h4: 'text-2xl font-semibold',
  h5: 'text-xl font-medium',
  h6: 'text-lg font-medium',
};

export default function Headline({ variant = 'h2', ...props }: HeadlineProps) {
  const Tag = variant;

  return (
    <Tag className={`mb-5 ${variantClasses[variant]} ${props.className}`}>{props.children}</Tag>
  );
}
