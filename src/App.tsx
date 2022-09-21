import React from 'react';
import ThemeProvider from './themes/ThemeProvider';

import { Authenticator } from '@aws-amplify/ui-react';
import { ReptileRepositoryProvider } from './libs/reptile-repository/ReptileRepositoryProvider';
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
            <ReptileRepositoryProvider>{content}</ReptileRepositoryProvider>
          </Authenticator.Provider>
        </SidebarProvider>
      </Authenticator>
    </ThemeProvider>
  );
};

export default App;
