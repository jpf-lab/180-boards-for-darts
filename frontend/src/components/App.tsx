import { Routes, Route } from 'react-router';
import '../css/App.css';
import Navigation from './Navigation';
import Header from './Header.tsx';
import Footer from './Footer';
import { useState } from 'react';
import type { AppUserType } from '../types/AppUser.ts';
import { navi } from '../main.tsx';

function App() {
  const [user, setUser] = useState<AppUserType | undefined>(undefined);

  return (
    <>
      <Header user={user} setUser={setUser} />
      <Navigation />
      <main className={'flex-1 bg-gray-600 text-white p-5'}>
        <Routes>
          {navi.map((nav, i) => (
            <Route path={nav.link} key={'route' + i} element={nav.component} />
          ))}
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
