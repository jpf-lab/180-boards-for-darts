import { NavLink } from 'react-router';
import { navi } from '../main.tsx';
import type { AppUser } from '../types/AppUser.ts';

type NavigationProps = Pick<AppUser, 'user'>;

export default function Navigation(props: Readonly<NavigationProps>) {
  return (
    <nav className={'w-full p-5 h-10 bg-gray-800 text-white border-y-2 border-sky-800'}>
      <ul className={'flex items-center justify-center h-full w-full'}>
        {navi.map((nav, i) => {
          if (!nav.protected || (nav.protected && props.user?.name)) {
            return (
              <li key={'navilink' + i}>
                <NavLink to={nav.link} className={'m-5 hover:underline'}>
                  {nav.name}
                </NavLink>
              </li>
            );
          }
          return null;
        })}
      </ul>
    </nav>
  );
}
