import type { AppUser } from '../types/AppUser.ts';
import { Navigate, Outlet } from 'react-router-dom';
import LoadingText from './LoadingText.tsx';

type ProtectedRouteProps = Pick<AppUser, 'user'>;

export default function ProtectedRoutes(props: Readonly<ProtectedRouteProps>) {
  if (props.user === undefined) {
    return (
      <div>
        <LoadingText />
        <p className={'mt-6'}>If this takes too long you might not be logged in</p>
      </div>
    );
  }

  return props.user ? <Outlet /> : <Navigate to="/" />;
}
