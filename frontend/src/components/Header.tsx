import logo from '../assets/logo.svg';
import OAuth from './OAuth.tsx';
import type { AppUser } from '../types/AppUser.ts';

type HeaderProps = AppUser;

export default function Header(props: Readonly<HeaderProps>) {
  return (
    <header className={'flex items-center justify-between w-full h-20 bg-gray-800 text-white p-5'}>
      <div className={'flex items-center'}>
        {logo && <img src={logo} alt={'Logo'} className={'w-10 mr-5'} />}
        <span>180 Boards for Darts</span>
      </div>
      <OAuth user={props.user} setUser={props.setUser} />
    </header>
  );
}
