import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import './css/index.css';
import App from './App.tsx';
import Tournaments from './pages/Tournaments.tsx';
import Home from './pages/Home.tsx';

export const navi = [
  {
    name: 'Home',
    link: '/',
    component: <Home />,
  },
  {
    name: 'Tournaments',
    link: '/tournaments',
    component: <Tournaments />,
  },
];

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
