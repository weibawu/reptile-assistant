import React from 'react';
import ThemeProvider from './themes/ThemeProvider';

import { Authenticator } from '@aws-amplify/ui-react';
import { ReptileFeederProvider } from './libs/reptile-feeder/ReptileFeederProvider';
import { SidebarProvider } from './libs/context/SidebarContext';
import { useRoutes } from 'react-router-dom';
import router from './router';

const App: React.FC = () => {
  const content = useRoutes(router);
  return (
    <ThemeProvider>
      <Authenticator>
        <SidebarProvider>
          <Authenticator.Provider>
            <ReptileFeederProvider>
              {content}
            </ReptileFeederProvider>
          </Authenticator.Provider>
        </SidebarProvider>
      </Authenticator>
    </ThemeProvider>
  );
};

export default App;
