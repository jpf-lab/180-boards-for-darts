import { Routes, Route } from 'react-router';
import '../css/App.css';
import Navigation from './Navigation';
import Header from './Header.tsx';
import Footer from './Footer';
import { useState } from 'react';
import type { userType } from '../types/types.ts';

function App() {
  const [user, setUser] = useState<userType | undefined>(undefined);

  return (
    <>
      <Header user={user} setUser={setUser} />
      <Navigation />
      <main>
        <Routes>
          <Route path="/" element={<>Home</>} />
          <Route path="/about" element={<>About</>} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
