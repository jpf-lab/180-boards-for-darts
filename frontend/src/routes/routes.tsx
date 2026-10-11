import type { JSX } from 'react';
import Home from '../pages/Home.tsx';
import TournamentsOverview from '../pages/TournamentsOverview.tsx';
import ParticipantsOverview from '../pages/ParticipantsOverview.tsx';
import PlayfieldsOverview from '../pages/PlayfieldsOverview.tsx';
import LocationOverview from '../pages/LocationOverview.tsx';
import LocationCreate from '../pages/LocationCreate.tsx';
import LocationEdit from '../pages/LocationEdit.tsx';

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
    element: <TournamentsOverview />,
    protected: true,
    showInNavigation: true,
  },
  {
    name: 'Participants',
    path: '/participants',
    element: <ParticipantsOverview />,
    protected: true,
    showInNavigation: true,
  },
  {
    name: 'Playfields',
    path: '/playfields',
    element: <PlayfieldsOverview />,
    protected: true,
    showInNavigation: true,
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
