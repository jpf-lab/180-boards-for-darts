import { type JSX, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import './css/index.css';
import App from './App.tsx';
import Tournaments from './routes/Tournaments.tsx';
import Home from './routes/Home.tsx';
import Participants from './routes/Participants.tsx';
import Playfields from './routes/Playfields.tsx';
import Locations from './routes/Locations.tsx';
// import TournamentEdit from './components/TournamentEdit.tsx';

type naviProps = naviItem[];

type naviItem = {
  name: string;
  path: string;
  component: JSX.Element;
  protected?: boolean;
};

export const navi: naviProps = [
  {
    name: 'Home',
    path: '/',
    component: <Home />,
  },
  {
    name: 'Tournaments',
    path: '/tournaments',
    component: <Tournaments />,
    protected: true,
  },
  {
    name: 'Participants',
    path: '/participants',
    component: <Participants />,
    protected: true,
  },
  {
    name: 'Playfields',
    path: '/playfields',
    component: <Playfields />,
    protected: true,
  },
  {
    name: 'Locations',
    path: '/locations',
    component: <Locations />,
    protected: true,
  },
];

export const customRoutes: naviProps = [
  // {
  //   name: 'Tournament Edit',
  //   path: '/tournaments/:id/edit',
  //   component: <TournamentEdit />,
  //   protected: true,
  // },
];

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
