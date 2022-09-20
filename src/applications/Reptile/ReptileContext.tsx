import React, { FC, useState, createContext } from 'react';
type ReptileContext = {

};

export const ReptileContext = createContext<ReptileContext>(
  {} as ReptileContext
);

export const ReptileProvider: FC<{children: React.ReactNode}> = ({ children }) => {


  return (
    <ReptileContext.Provider
      value={{  }}
    >
      {children}
    </ReptileContext.Provider>
  );
};
