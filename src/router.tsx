import React, { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { RouteObject } from 'react-router';

import SidebarLayout from './layouts/SidebarLayout';

import SuspenseLoader from './components/SuspenseLoader';

const Loader = (Component: any) => (props: any) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

// Applications
const FeedingBox = Loader(
  lazy(() => import('./applications/ReptileFeedingBox'))
);
const FeedingLog = Loader(
  lazy(() => import('./applications/FeedingLog'))
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
        element: <FeedingBox />
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
        element: <FeedingLog />
      },
      {
        path: 'reptile/management',
        element: <Reptile />
      },
    ]
  },
];

export default routes;
