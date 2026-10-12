import { Routes, Route } from 'react-router';
import { useState } from 'react';
import Navigation from './components/Navigation.tsx';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import type { AppUserType } from './types/AppUser.ts';
import { routes } from './routes/routes.tsx';

function App() {
  const [user, setUser] = useState<AppUserType | undefined>(undefined);

  return (
    <>
      <Header user={user} setUser={setUser} />
      <Navigation user={user} />
      <main className={'flex-1 bg-gray-600 text-white p-5'}>
        <Routes>
          {routes.map((route) => (
            <Route
              key={route.path}
              element={route.protected ? <ProtectedRoute user={user} /> : undefined}
            >
              <Route path={route.path} element={route.element} />
            </Route>
          ))}
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
