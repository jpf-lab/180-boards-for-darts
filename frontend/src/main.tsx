import { type JSX, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import './css/index.css';
import App from './App.tsx';
import Tournaments from './routes/Tournaments.tsx';
import Home from './routes/Home.tsx';

type naviProps = naviItem[];

type naviItem = {
  name: string;
  link: string;
  component: JSX.Element;
  protected?: boolean;
};

export const navi: naviProps = [
  {
    name: 'Home',
    link: '/',
    component: <Home />,
  },
  {
    name: 'Tournaments',
    link: '/tournaments',
    component: <Tournaments />,
    protected: true,
  },
];

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
