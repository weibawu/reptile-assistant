import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { RouteObject } from 'react-router';

import SidebarLayout from 'src/layouts/SidebarLayout';
import BaseLayout from 'src/layouts/BaseLayout';

import SuspenseLoader from 'src/components/SuspenseLoader';

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

// Pages

// Dashboards

const Crypto = Loader(lazy(() => import('src/content/dashboards/Crypto')));

// Applications

const Messenger = Loader(
  lazy(() => import('src/content/applications/Messenger'))
);
const FeedingBox = Loader(
  lazy(() => import('src/content/applications/FeedingBox'))
);
const UserProfile = Loader(
  lazy(() => import('src/content/applications/Users/profile'))
);
const UserSettings = Loader(
  lazy(() => import('src/content/applications/Users/settings'))
);

// Status

const Status404 = Loader(
  lazy(() => import('src/content/pages/Status/Status404'))
);
const Status500 = Loader(
  lazy(() => import('src/content/pages/Status/Status500'))
);
const StatusComingSoon = Loader(
  lazy(() => import('src/content/pages/Status/ComingSoon'))
);
const StatusMaintenance = Loader(
  lazy(() => import('src/content/pages/Status/Maintenance'))
);

const routes: RouteObject[] = [
  {
    path: 'dashboards',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="crypto" replace />
      },
      {
        path: 'crypto',
        element: <Crypto />
      },
      {
        path: 'messenger',
        element: <Messenger />
      }
    ]
  },
  {
    path: '',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="reptile-feeding-box/overview" replace />
      },
      {
        path: 'reptile-feeding-box/management',
        element: <FeedingBox />
      },
      {
        path: 'reptile-feeding-box/overview',
        element: <div />
      },
      // {
      //   path: 'profile',
      //   children: [
      //     {
      //       path: '',
      //       element: <Navigate to="details" replace />
      //     },
      //     {
      //       path: 'details',
      //       element: <UserProfile />
      //     },
      //     {
      //       path: 'settings',
      //       element: <UserSettings />
      //     }
      //   ]
      // }
    ]
  },
];

export default routes;
