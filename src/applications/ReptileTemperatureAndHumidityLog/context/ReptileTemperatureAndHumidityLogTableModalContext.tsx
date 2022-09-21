import React, { FC, useState, createContext } from 'react';

type ReptileTemperatureAndHumidityLogTableModalContext = {
  ReptileTemperatureAndHumidityLogTableModalToggle: boolean
  toggleReptileTemperatureAndHumidityLogTableModal: () => void
  closeReptileTemperatureAndHumidityLogTableModal: () => void
}

export const ReptileTemperatureAndHumidityLogTableModalContext =
  createContext<ReptileTemperatureAndHumidityLogTableModalContext>(
    {} as ReptileTemperatureAndHumidityLogTableModalContext,
  );

export const ReptileTemperatureAndHumidityLogTableModalProvider: FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [
    ReptileTemperatureAndHumidityLogTableModalToggle,
    setReptileTemperatureAndHumidityLogTableModalToggle,
  ] = useState(false);
  const toggleReptileTemperatureAndHumidityLogTableModal = () => {
    setReptileTemperatureAndHumidityLogTableModalToggle(
      !ReptileTemperatureAndHumidityLogTableModalToggle,
    );
  };
  const closeReptileTemperatureAndHumidityLogTableModal = () => {
    setReptileTemperatureAndHumidityLogTableModalToggle(false);
  };

  return (
    <ReptileTemperatureAndHumidityLogTableModalContext.Provider
      value={{
        ReptileTemperatureAndHumidityLogTableModalToggle,
        toggleReptileTemperatureAndHumidityLogTableModal,
        closeReptileTemperatureAndHumidityLogTableModal,
      }}
    >
      {children}
    </ReptileTemperatureAndHumidityLogTableModalContext.Provider>
  );
};
