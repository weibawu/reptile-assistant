import React, { FC, useState, createContext, useContext, useEffect } from 'react';

import { ModalContext } from './ModalContext';
import { ReptileContext } from '../../../libs/context/ReptileContext';
import { ReptileFeedingLogTableModalContext } from './ReptileFeedingLogTableModalContext';

import { useReptileRepository } from '../../../libs/reptile-repository/UseReptileRepository';

import { Reptile, ReptileFeedingLog } from '../../../models';

type ReptileFeedingLogContext = {
  ModalToggle: boolean, // 创建/编辑Reptile Feeding Log Modal显隐
  toggleModal: () => void, // 切换Reptile Feeding Log Modal显隐

  ReptileFeedingLogTableModalToggle: boolean, // 查看Reptile Feeding Log Modal显隐
  toggleReptileFeedingLogTableModal: () => void, // 切换Reptile Feeding Log Modal显隐

  editableReptileFeedingLog: ReptileFeedingLog | undefined,
  handleModifyReptileFeedingLogModalOpen: (reptileFeedingLog: ReptileFeedingLog | undefined) => void,
  handleModifyReptileFeedingLogModalClose: () => void,
  handleReptileFeedingLogsDelete: (reptileFeedingLogIds: string[]) => void

  viewableLogReptile: Reptile | undefined // 正在查看日志的Reptile
  handleViewableReptileLogModalOpen: (reptile: Reptile) => void // 打开正在查看日志的Reptile
  handleViewableReptileLogModalClose: () => void // 关闭正在查看日志的Reptile
  handleModifyReptileFeedingLogModalOpenInReptileTable: (reptile: Reptile, reptileFeedingLog: ReptileFeedingLog) => void;
};

export const ReptileFeedingLogContext = createContext<ReptileFeedingLogContext>(
  {} as ReptileFeedingLogContext
);

export const ReptileFeedingLogProvider: FC<{ children: React.ReactNode }> = ({ children }) => {

  const {
    reptileFeedingLogs
  } = useContext(ReptileContext);

  const { reptileRepository } = useReptileRepository();

  const {
    toggleModal,
    ModalToggle,
    closeModal
  } = useContext(ModalContext);
  const [editableReptileFeedingLog, setEditableReptileFeedingLog] = useState<ReptileFeedingLog | undefined>();

  const {
    toggleReptileFeedingLogTableModal,
    ReptileFeedingLogTableModalToggle,
    closeReptileFeedingLogTableModal
  } = useContext(ReptileFeedingLogTableModalContext);
  const [viewableLogReptile, setViewableLogReptile] = useState<Reptile | undefined>();

  const [currentReptileFeedingLog, setCurrentReptileFeedingLog] = useState<ReptileFeedingLog | undefined>();


  const handleModifyReptileFeedingLogModalOpen = (reptileFeedingLog: ReptileFeedingLog | undefined) => {
    if (reptileFeedingLog) {
      setEditableReptileFeedingLog(reptileFeedingLog);
    }
    toggleModal();
  };

  const handleModifyReptileFeedingLogModalClose = () => {
    setEditableReptileFeedingLog(undefined);
    closeModal();
  };

  const handleReptileFeedingLogsDelete = async (reptileFeedingLogIds: string[]) => {
    for await (const reptileFeedingLogId of reptileFeedingLogIds) {
      await reptileRepository.removeReptileFeedingLog(reptileFeedingLogId);
    }
    await reptileRepository.fetchAll();
  };

  const handleModifyReptileFeedingLogModalOpenInReptileTable = (reptile: Reptile, reptileFeedingLog: ReptileFeedingLog) => {
    handleViewableReptileLogModalOpen(reptile);
    setCurrentReptileFeedingLog(reptileFeedingLog);
  };

  const handleModifyReptileFeedingLogModalCloseInReptileTable = () => {
    setCurrentReptileFeedingLog(undefined);
    handleModifyReptileFeedingLogModalClose();
    handleViewableReptileLogModalClose();
  };

  useEffect(() => {
    if (currentReptileFeedingLog) handleModifyReptileFeedingLogModalOpen(currentReptileFeedingLog);
  }, [reptileFeedingLogs]);

  useEffect(() => {
    if (currentReptileFeedingLog && !ModalToggle) handleModifyReptileFeedingLogModalCloseInReptileTable();
  }, [ModalToggle]);

  const handleViewableReptileLogModalOpen = (reptile: Reptile) => {
    setViewableLogReptile(reptile);
    toggleReptileFeedingLogTableModal();
  };

  const handleViewableReptileLogModalClose = () => {
    closeReptileFeedingLogTableModal();
    setViewableLogReptile(undefined);
  };

  return (
    <ReptileFeedingLogContext.Provider
      value={{
        ModalToggle,
        toggleModal,

        ReptileFeedingLogTableModalToggle,
        toggleReptileFeedingLogTableModal,

        editableReptileFeedingLog,
        handleModifyReptileFeedingLogModalOpen,
        handleModifyReptileFeedingLogModalClose,
        handleReptileFeedingLogsDelete,

        viewableLogReptile,
        handleViewableReptileLogModalClose,
        handleViewableReptileLogModalOpen,
        handleModifyReptileFeedingLogModalOpenInReptileTable
      }}
    >
      {children}
    </ReptileFeedingLogContext.Provider>
  );
};
