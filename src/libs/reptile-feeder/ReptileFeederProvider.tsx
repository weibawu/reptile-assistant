import React from 'react';
import ReptileFeeder from './ReptileFeeder';
import { useAuthenticator } from '@aws-amplify/ui-react';

const ReptileFeederContext = React.createContext<ReptileFeeder>({} as ReptileFeeder);

interface ReptileFeederProviderProps {
  children: React.ReactNode,
}

const ReptileFeederProvider: React.FC<ReptileFeederProviderProps> = ({children}) => {
  const {user} = useAuthenticator(ctx => [ctx.user]);
  const reptileFeeder = new ReptileFeeder(user);

  return (
    <ReptileFeederContext.Provider value={reptileFeeder}>
      {children}
    </ReptileFeederContext.Provider>
  );
};

export {
  ReptileFeederProvider,
  ReptileFeederContext,
};
