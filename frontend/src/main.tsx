import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import './css/index.css';
import App from './components/App.tsx';
import Home from './components/Home.tsx';

export const navi = [
  {
    name: 'Home',
    link: '/',
    component: <Home />,
  },
  {
    name: 'About',
    link: '/about',
  },
];

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
