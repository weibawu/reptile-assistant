import React, { FC, useState, createContext } from 'react';

type ReptileFeedingLogTableModalContext = {
  ReptileFeedingLogTableModalToggle: boolean;
  toggleReptileFeedingLogTableModal: () => void;
  closeReptileFeedingLogTableModal: () => void;
};

export const ReptileFeedingLogTableModalContext = createContext<ReptileFeedingLogTableModalContext>(
  {} as ReptileFeedingLogTableModalContext
);

export const ReptileFeedingLogTableModalProvider: FC<{children: React.ReactNode}> = ({ children }) => {
  const [ReptileFeedingLogTableModalToggle, setReptileFeedingLogTableModalToggle] = useState(false);
  const toggleReptileFeedingLogTableModal = () => {
    setReptileFeedingLogTableModalToggle(!ReptileFeedingLogTableModalToggle);
  };
  const closeReptileFeedingLogTableModal = () => {
    setReptileFeedingLogTableModalToggle(false);
  };

  return (
    <ReptileFeedingLogTableModalContext.Provider
      value={{ ReptileFeedingLogTableModalToggle, toggleReptileFeedingLogTableModal, closeReptileFeedingLogTableModal }}
    >
      {children}
    </ReptileFeedingLogTableModalContext.Provider>
  );
};
