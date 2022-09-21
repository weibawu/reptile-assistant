import React, { FC, useState, createContext } from 'react';

type ReptileWeightLogTableModalContext = {
  ReptileWeightLogTableModalToggle: boolean
  toggleReptileWeightLogTableModal: () => void
  closeReptileWeightLogTableModal: () => void
}

export const ReptileWeightLogTableModalContext = createContext<ReptileWeightLogTableModalContext>(
  {} as ReptileWeightLogTableModalContext,
);

export const ReptileWeightLogTableModalProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [ReptileWeightLogTableModalToggle, setReptileWeightLogTableModalToggle] = useState(false);
  const toggleReptileWeightLogTableModal = () => {
    setReptileWeightLogTableModalToggle(!ReptileWeightLogTableModalToggle);
  };
  const closeReptileWeightLogTableModal = () => {
    setReptileWeightLogTableModalToggle(false);
  };

  return (
    <ReptileWeightLogTableModalContext.Provider
      value={{
        ReptileWeightLogTableModalToggle,
        toggleReptileWeightLogTableModal,
        closeReptileWeightLogTableModal,
      }}
    >
      {children}
    </ReptileWeightLogTableModalContext.Provider>
  );
};
