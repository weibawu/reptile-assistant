import React from 'react';
import ReptileRepository from './ReptileRepository';
import { useAuthenticator } from '@aws-amplify/ui-react';

const ReptileRepositoryContext = React.createContext<ReptileRepository>({} as ReptileRepository);

interface ReptileFeederProviderProps {
  children: React.ReactNode
}

const ReptileRepositoryProvider: React.FC<ReptileFeederProviderProps> = ({ children }) => {
  const { user } = useAuthenticator((ctx) => [ctx.user]);
  const reptileFeeder = new ReptileRepository(user);

  return (
    <ReptileRepositoryContext.Provider value={reptileFeeder}>
      {children}
    </ReptileRepositoryContext.Provider>
  );
};

export { ReptileRepositoryProvider, ReptileRepositoryContext };
