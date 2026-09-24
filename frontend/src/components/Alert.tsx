import type { ComponentType, PropsWithChildren, SVGProps } from 'react';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/solid';
import { InformationCircleIcon } from '@heroicons/react/24/solid';

type Variant = 'error' | 'success' | 'warning' | 'info';

type AlertProps = PropsWithChildren & {
  variant?: Variant;
};

const icons: Record<Variant, ComponentType<SVGProps<SVGSVGElement>>> = {
  error: ExclamationCircleIcon,
  success: CheckCircleIcon,
  warning: ExclamationTriangleIcon,
  info: InformationCircleIcon,
};

const styles: Record<Variant, string> = {
  error: 'bg-red-100 text-red-700 ring-red-700',
  success: 'bg-emerald-50 text-emerald-800 ring-emerald-800',
  warning: 'bg-amber-50 text-amber-800 ring-amber-800',
  info: 'bg-blue-50 text-blue-800 ring-blue-800',
};

export default function Alert({ variant = 'info', ...props }: AlertProps) {
  const Icon = icons[variant];

  return (
    <div
      className={`p-4 my-4 rounded-2xl flex items-center ring-2 ${styles[variant]}`}
      role="alert"
    >
      <Icon className={'size-6 inline-block mr-4 shrink-0'} />
      <div className={'inline-block'}>{props.children}</div>
    </div>
  );
}
