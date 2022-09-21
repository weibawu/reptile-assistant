import React, { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { RouteObject } from 'react-router';

import SidebarLayout from './layouts/SidebarLayout';

import SuspenseLoader from './components/SuspenseLoader';

// eslint-disable-next-line react/display-name
const Loader = (Component: any) => (props: any) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

// Applications
const ReptileFeedingBox = Loader(lazy(() => import('./applications/ReptileFeedingBox')));
const ReptileFeedingLog = Loader(lazy(() => import('./applications/ReptileFeedingLog')));
const ReptileWeightLog = Loader(lazy(() => import('./applications/ReptileWeightLog')));
const ReptileTemperatureAndHumidityLog = Loader(
  lazy(() => import('./applications/ReptileTemperatureAndHumidityLog')),
);
const Reptile = Loader(lazy(() => import('./applications/ReptileEditing')));

const routes: RouteObject[] = [
  {
    path: '',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <Navigate to='feeding-box' replace />,
      },
      {
        path: 'feeding-box',
        element: <Navigate to='overview' replace />,
      },
      {
        path: 'feeding-box/overview',
        element: <ReptileFeedingBox />,
      },
      {
        path: 'reptile',
        element: <Navigate to='overview' replace />,
      },
      {
        path: 'reptile/overview',
        element: <Reptile />,
      },
      {
        path: 'reptile/temperature-and-humidity-logs',
        element: <ReptileTemperatureAndHumidityLog />,
      },
      {
        path: 'reptile/weight-logs',
        element: <ReptileWeightLog />,
      },
      {
        path: 'reptile/feeding-logs',
        element: <ReptileFeedingLog />,
      },
    ],
  },
];

export default routes;
