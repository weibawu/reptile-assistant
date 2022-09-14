import React from 'react';
import ThemeProvider from './themes/ThemeProvider';

import { Authenticator } from '@aws-amplify/ui-react';
import { ReptileFeederProvider } from './libs/reptile-feeder/ReptileFeederProvider';
import Sidebar from './layouts/SidebarLayout/Sidebar';

const App: React.FC = () => (
  <ThemeProvider>
    <Authenticator>
      <ReptileFeederProvider>
        <Authenticator.Provider>
          <Sidebar></Sidebar>
        </Authenticator.Provider>
      </ReptileFeederProvider>
    </Authenticator>
  </ThemeProvider>
);

export default App;
