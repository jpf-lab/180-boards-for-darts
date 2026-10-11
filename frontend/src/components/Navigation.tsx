import { NavLink } from 'react-router';
import { navigationRoutes } from '../routes/routes.tsx';
import type { AppUser } from '../types/AppUser.ts';

type NavigationProps = Pick<AppUser, 'user'>;

export default function Navigation(props: Readonly<NavigationProps>) {
  const isLoggedIn = Boolean(props.user?.name);

  return (
    <nav className={'w-full p-5 h-10 bg-gray-800 text-white border-y-2 border-sky-800'}>
      <ul className={'flex items-center justify-center h-full w-full'}>
        {navigationRoutes
          .filter((route) => !route.protected || isLoggedIn)
          .map((route) => (
            <li key={route.path}>
              <NavLink to={route.path} className={'m-5 hover:underline'}>
                {route.name}
              </NavLink>
            </li>
          ))}
      </ul>
    </nav>
  );
}
