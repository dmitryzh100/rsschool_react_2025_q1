import React from 'react';
import { useRoutes, Navigate } from 'react-router';
import MainPage from './pages/MainPage/MainPage';
import CharacterDetail from './components/CharacterDetail/CharacterDetail';
import NotFound from './components/NotFound/NotFoud';

const App: React.FC = () => {
  const routes = useRoutes([
    {
      path: '/',
      element: <Navigate to="/search/1" replace />,
    },
    {
      path: 'search/:page',
      element: <MainPage />,
      children: [
        {
          path: 'details/:characterId',
          element: <CharacterDetail />,
        },
      ],
    },
    { path: '*', element: <NotFound /> },
  ]);

  return <>{routes}</>;
};

export default App;
