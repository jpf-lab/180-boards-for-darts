import type { JSX } from 'react';
import Home from '../pages/Home.tsx';
import TournamentOverview from '../pages/TournamentOverview.tsx';
import ParticipantOverview from '../pages/ParticipantOverview.tsx';
import PlayfieldOverview from '../pages/PlayfieldOverview.tsx';
import LocationOverview from '../pages/LocationOverview.tsx';
import LocationCreate from '../pages/LocationCreate.tsx';
import LocationEdit from '../pages/LocationEdit.tsx';
import ParticipantCreate from '../pages/ParticipantCreate.tsx';
import ParticipantEdit from '../pages/ParticipantEdit.tsx';
import PlayfieldCreate from '../pages/PlayfieldCreate.tsx';
import PlayfieldEdit from '../pages/PlayfieldEdit.tsx';
import TournamentEditor from '../pages/TournamentEditor.tsx';

export type AppRoute = {
  name: string;
  path: string;
  element: JSX.Element;
  protected?: boolean;
  /** Show the route as a link in the navigation, default false */
  showInNavigation?: boolean;
};

export const routes: AppRoute[] = [
  { name: 'Home', path: '/', element: <Home />, showInNavigation: true },
  {
    name: 'Tournaments',
    path: '/tournaments',
    element: <TournamentOverview />,
    protected: true,
    showInNavigation: true,
  },
  {
    name: 'Tournament Create',
    path: '/tournaments/new',
    element: <TournamentEditor columns={2} />,
    protected: true,
  },
  {
    name: 'Tournament Edit',
    path: '/tournaments/:id/edit',
    element: <TournamentEditor columns={2} />,
    protected: true,
  },
  {
    name: 'Participants',
    path: '/participants',
    element: <ParticipantOverview />,
    protected: true,
    showInNavigation: true,
  },
  {
    name: 'Participant Create',
    path: '/participants/new',
    element: <ParticipantCreate columns={2} />,
    protected: true,
  },
  {
    name: 'Participant Edit',
    path: '/participants/:id/edit',
    element: <ParticipantEdit columns={2} />,
    protected: true,
  },
  {
    name: 'Playfields',
    path: '/playfields',
    element: <PlayfieldOverview />,
    protected: true,
    showInNavigation: true,
  },
  {
    name: 'Playfield Create',
    path: '/playfields/new',
    element: <PlayfieldCreate />,
    protected: true,
  },
  {
    name: 'Playfield Edit',
    path: '/playfields/:id/edit',
    element: <PlayfieldEdit />,
    protected: true,
  },
  {
    name: 'Locations',
    path: '/locations',
    element: <LocationOverview />,
    protected: true,
    showInNavigation: true,
  },
  {
    name: 'Location Create',
    path: '/locations/new',
    element: <LocationCreate columns={2} />,
    protected: true,
  },
  {
    name: 'Location Edit',
    path: '/locations/:id/edit',
    element: <LocationEdit columns={2} />,
    protected: true,
  },
];

export const navigationRoutes = routes.filter((route) => route.showInNavigation);
