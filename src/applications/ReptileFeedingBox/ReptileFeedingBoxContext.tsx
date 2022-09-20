import React, { FC, useState, createContext } from 'react';
type ReptileFeedingBoxContext = {

};

export const ReptileFeedingBoxContext = createContext<ReptileFeedingBoxContext>(
  {} as ReptileFeedingBoxContext
);

export const ReptileFeedingBoxProvider: FC<{children: React.ReactNode}> = ({ children }) => {


  return (
    <ReptileFeedingBoxContext.Provider
      value={{  }}
    >
      {children}
    </ReptileFeedingBoxContext.Provider>
  );
};
