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
const ReptileFeedingBox = Loader(
  lazy(() => import('./applications/ReptileFeedingBox'))
);
const ReptileFeedingLog = Loader(
  lazy(() => import('./applications/ReptileFeedingLog'))
);
const Reptile = Loader(
  lazy(() => import('./applications/Reptile'))
);

const routes: RouteObject[] = [
  {
    path: '',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="reptile-feeding-box" replace />
      },
      {
        path: 'reptile-feeding-box',
        element: <Navigate to="overview" replace />
      },
      {
        path: 'reptile-feeding-box/overview',
        element: <ReptileFeedingBox />
      },
      {
        path: 'reptile-feeding-box/logs',
        element: <div>开发中 ( ´▽｀)</div>
      },
      {
        path: 'reptile',
        element: <Navigate to="overview" replace />
      },
      {
        path: 'reptile/overview',
        element: <Reptile />
      },
      {
        path: 'reptile/logs',
        element: <ReptileFeedingLog />
      },
    ]
  },
];

export default routes;
