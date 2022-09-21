import React, { FC, useState, createContext, useContext, useEffect } from 'react';

import { ModalContext } from './ModalContext';
import { ReptileContext } from '../../../libs/context/ReptileContext';
import { ReptileTemperatureAndHumidityLogTableModalContext } from './ReptileTemperatureAndHumidityLogTableModalContext';

import { useReptileRepository } from '../../../libs/reptile-repository/UseReptileRepository';

import { Reptile, ReptileTemperatureAndHumidityLog } from '../../../models';

type ReptileTemperatureAndHumidityLogContext = {
  ModalToggle: boolean // 创建/编辑Reptile TemperatureAndHumidity Log Modal显隐
  toggleModal: () => void // 切换Reptile TemperatureAndHumidity Log Modal显隐

  ReptileTemperatureAndHumidityLogTableModalToggle: boolean // 查看Reptile TemperatureAndHumidity Log Modal显隐
  toggleReptileTemperatureAndHumidityLogTableModal: () => void // 切换Reptile TemperatureAndHumidity Log Modal显隐

  editableReptileTemperatureAndHumidityLog: ReptileTemperatureAndHumidityLog | undefined
  handleModifyReptileTemperatureAndHumidityLogModalOpen: (
    reptileTemperatureAndHumidityLog: ReptileTemperatureAndHumidityLog | undefined,
  ) => void
  handleModifyReptileTemperatureAndHumidityLogModalClose: () => void
  handleReptileTemperatureAndHumidityLogsDelete: (
    reptileTemperatureAndHumidityLogIds: string[],
  ) => void

  viewableLogReptile: Reptile | undefined // 正在查看日志的Reptile
  handleViewableReptileLogModalOpen: (reptile: Reptile) => void // 打开正在查看日志的Reptile
  handleViewableReptileLogModalClose: () => void // 关闭正在查看日志的Reptile
  handleModifyReptileTemperatureAndHumidityLogModalOpenInReptileTable: (
    reptile: Reptile,
    reptileTemperatureAndHumidityLog: ReptileTemperatureAndHumidityLog,
  ) => void
}

export const ReptileTemperatureAndHumidityLogContext =
  createContext<ReptileTemperatureAndHumidityLogContext>(
    {} as ReptileTemperatureAndHumidityLogContext,
  );

export const ReptileTemperatureAndHumidityLogProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { reptileTemperatureAndHumidityLogs } = useContext(ReptileContext);

  const { reptileRepository } = useReptileRepository();

  const { toggleModal, ModalToggle, closeModal } = useContext(ModalContext);
  const [editableReptileTemperatureAndHumidityLog, setEditableReptileTemperatureAndHumidityLog] =
    useState<ReptileTemperatureAndHumidityLog | undefined>();

  const {
    toggleReptileTemperatureAndHumidityLogTableModal,
    ReptileTemperatureAndHumidityLogTableModalToggle,
    closeReptileTemperatureAndHumidityLogTableModal,
  } = useContext(ReptileTemperatureAndHumidityLogTableModalContext);
  const [viewableLogReptile, setViewableLogReptile] = useState<Reptile | undefined>();

  const [currentReptileTemperatureAndHumidityLog, setCurrentReptileTemperatureAndHumidityLog] =
    useState<ReptileTemperatureAndHumidityLog | undefined>();

  const handleModifyReptileTemperatureAndHumidityLogModalOpen = (
    reptileTemperatureAndHumidityLog: ReptileTemperatureAndHumidityLog | undefined,
  ) => {
    if (reptileTemperatureAndHumidityLog) {
      setEditableReptileTemperatureAndHumidityLog(reptileTemperatureAndHumidityLog);
    }
    toggleModal();
  };

  const handleModifyReptileTemperatureAndHumidityLogModalClose = () => {
    setEditableReptileTemperatureAndHumidityLog(undefined);
    closeModal();
  };

  const handleReptileTemperatureAndHumidityLogsDelete = async (
    reptileTemperatureAndHumidityLogIds: string[],
  ) => {
    for await (const reptileTemperatureAndHumidityLogId of reptileTemperatureAndHumidityLogIds) {
      await reptileRepository.removeReptileTemperatureAndHumidityLog(
        reptileTemperatureAndHumidityLogId,
      );
    }
    await reptileRepository.fetchAll();
  };

  const handleModifyReptileTemperatureAndHumidityLogModalOpenInReptileTable = (
    reptile: Reptile,
    reptileTemperatureAndHumidityLog: ReptileTemperatureAndHumidityLog,
  ) => {
    handleViewableReptileLogModalOpen(reptile);
    setCurrentReptileTemperatureAndHumidityLog(reptileTemperatureAndHumidityLog);
  };

  const handleModifyReptileTemperatureAndHumidityLogModalCloseInReptileTable = () => {
    setCurrentReptileTemperatureAndHumidityLog(undefined);
    handleModifyReptileTemperatureAndHumidityLogModalClose();
    handleViewableReptileLogModalClose();
  };

  useEffect(() => {
    if (currentReptileTemperatureAndHumidityLog)
      handleModifyReptileTemperatureAndHumidityLogModalOpen(currentReptileTemperatureAndHumidityLog);
  }, [reptileTemperatureAndHumidityLogs]);

  useEffect(() => {
    if (currentReptileTemperatureAndHumidityLog && !ModalToggle)
      handleModifyReptileTemperatureAndHumidityLogModalCloseInReptileTable();
  }, [ModalToggle]);

  const handleViewableReptileLogModalOpen = (reptile: Reptile) => {
    setViewableLogReptile(reptile);
    toggleReptileTemperatureAndHumidityLogTableModal();
  };

  const handleViewableReptileLogModalClose = () => {
    closeReptileTemperatureAndHumidityLogTableModal();
    setViewableLogReptile(undefined);
  };

  return (
    <ReptileTemperatureAndHumidityLogContext.Provider
      value={{
        ModalToggle,
        toggleModal,

        ReptileTemperatureAndHumidityLogTableModalToggle,
        toggleReptileTemperatureAndHumidityLogTableModal,

        editableReptileTemperatureAndHumidityLog,
        handleModifyReptileTemperatureAndHumidityLogModalOpen,
        handleModifyReptileTemperatureAndHumidityLogModalClose,
        handleReptileTemperatureAndHumidityLogsDelete,

        viewableLogReptile,
        handleViewableReptileLogModalClose,
        handleViewableReptileLogModalOpen,
        handleModifyReptileTemperatureAndHumidityLogModalOpenInReptileTable,
      }}
    >
      {children}
    </ReptileTemperatureAndHumidityLogContext.Provider>
  );
};
