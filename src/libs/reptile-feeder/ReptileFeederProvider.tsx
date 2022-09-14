import React from 'react';
import ReptileFeeder from './ReptileFeeder';

const reptileFeeder = new ReptileFeeder();

const ReptileFeederContext = React.createContext<ReptileFeeder | null>(null);

interface ReptileFeederProviderProps {
  children: React.ReactNode,
}

const ReptileFeederProvider: React.FC<ReptileFeederProviderProps> = ({children}) => (
  <ReptileFeederContext.Provider value={reptileFeeder}>
    {children}
  </ReptileFeederContext.Provider>
);

export {
  ReptileFeederProvider,
  ReptileFeederContext,
};
