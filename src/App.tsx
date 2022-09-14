import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import { ReptileFeederProvider } from './libs/reptile-feeder/ReptileFeederProvider';

const App: React.FC = () => (
  <Authenticator>
    <ReptileFeederProvider>
      <Authenticator.Provider>
        {/* TODO */}
      </Authenticator.Provider>
    </ReptileFeederProvider>
  </Authenticator>
);

export default App;
