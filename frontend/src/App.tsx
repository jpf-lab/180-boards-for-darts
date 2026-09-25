import { Routes, Route } from 'react-router';
import Navigation from './components/Navigation.tsx';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import { useState } from 'react';
import type { AppUserType } from './types/AppUser.ts';
import { navi } from './main.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';

function App() {
  const [user, setUser] = useState<AppUserType | undefined>(undefined);

  return (
    <>
      <Header user={user} setUser={setUser} />
      <Navigation />
      <main className={'flex-1 bg-gray-600 text-white p-5'}>
        <Routes>
          {navi.map((nav, i) => (
            <Route key={'route' + i} element={nav.protected && <ProtectedRoute user={user} />}>
              <Route path={nav.link} element={nav.component} />
            </Route>
          ))}
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
