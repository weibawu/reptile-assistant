import React, { FC, useState, createContext, useContext, useEffect } from 'react';

import { ModalContext } from './ModalContext';
import { ReptileContext } from '../../../libs/context/ReptileContext';
import { ReptileWeightLogTableModalContext } from './ReptileWeightLogTableModalContext';

import { useReptileRepository } from '../../../libs/reptile-repository/UseReptileRepository';

import { Reptile, ReptileWeightLog } from '../../../models';

type ReptileWeightLogContext = {
  ModalToggle: boolean, // 创建/编辑Reptile Weight Log Modal显隐
  toggleModal: () => void, // 切换Reptile Weight Log Modal显隐

  ReptileWeightLogTableModalToggle: boolean, // 查看Reptile Weight Log Modal显隐
  toggleReptileWeightLogTableModal: () => void, // 切换Reptile Weight Log Modal显隐

  editableReptileWeightLog: ReptileWeightLog | undefined,
  handleModifyReptileWeightLogModalOpen: (reptileWeightLog: ReptileWeightLog | undefined) => void,
  handleModifyReptileWeightLogModalClose: () => void,
  handleReptileWeightLogsDelete: (reptileWeightLogIds: string[]) => void

  viewableLogReptile: Reptile | undefined // 正在查看日志的Reptile
  handleViewableReptileLogModalOpen: (reptile: Reptile) => void // 打开正在查看日志的Reptile
  handleViewableReptileLogModalClose: () => void // 关闭正在查看日志的Reptile
  handleModifyReptileWeightLogModalOpenInReptileTable: (reptile: Reptile, reptileWeightLog: ReptileWeightLog) => void;
};

export const ReptileWeightLogContext = createContext<ReptileWeightLogContext>(
  {} as ReptileWeightLogContext
);

export const ReptileWeightLogProvider: FC<{ children: React.ReactNode }> = ({ children }) => {

  const {
    reptileWeightLogs
  } = useContext(ReptileContext);

  const { reptileRepository } = useReptileRepository();

  const {
    toggleModal,
    ModalToggle,
    closeModal
  } = useContext(ModalContext);
  const [editableReptileWeightLog, setEditableReptileWeightLog] = useState<ReptileWeightLog | undefined>();

  const {
    toggleReptileWeightLogTableModal,
    ReptileWeightLogTableModalToggle,
    closeReptileWeightLogTableModal
  } = useContext(ReptileWeightLogTableModalContext);
  const [viewableLogReptile, setViewableLogReptile] = useState<Reptile | undefined>();

  const [currentReptileWeightLog, setCurrentReptileWeightLog] = useState<ReptileWeightLog | undefined>();


  const handleModifyReptileWeightLogModalOpen = (reptileWeightLog: ReptileWeightLog | undefined) => {
    if (reptileWeightLog) {
      setEditableReptileWeightLog(reptileWeightLog);
    }
    toggleModal();
  };

  const handleModifyReptileWeightLogModalClose = () => {
    setEditableReptileWeightLog(undefined);
    closeModal();
  };

  const handleReptileWeightLogsDelete = async (reptileWeightLogIds: string[]) => {
    for await (const reptileWeightLogId of reptileWeightLogIds) {
      await reptileRepository.removeReptileWeightLog(reptileWeightLogId);
    }
    await reptileRepository.fetchAll();
  };

  const handleModifyReptileWeightLogModalOpenInReptileTable = (reptile: Reptile, reptileWeightLog: ReptileWeightLog) => {
    handleViewableReptileLogModalOpen(reptile);
    setCurrentReptileWeightLog(reptileWeightLog);
  };

  const handleModifyReptileWeightLogModalCloseInReptileTable = () => {
    setCurrentReptileWeightLog(undefined);
    handleModifyReptileWeightLogModalClose();
    handleViewableReptileLogModalClose();
  };

  useEffect(() => {
    if (currentReptileWeightLog) handleModifyReptileWeightLogModalOpen(currentReptileWeightLog);
  }, [reptileWeightLogs]);

  useEffect(() => {
    if (currentReptileWeightLog && !ModalToggle) handleModifyReptileWeightLogModalCloseInReptileTable();
  }, [ModalToggle]);

  const handleViewableReptileLogModalOpen = (reptile: Reptile) => {
    setViewableLogReptile(reptile);
    toggleReptileWeightLogTableModal();
  };

  const handleViewableReptileLogModalClose = () => {
    closeReptileWeightLogTableModal();
    setViewableLogReptile(undefined);
  };

  return (
    <ReptileWeightLogContext.Provider
      value={{
        ModalToggle,
        toggleModal,

        ReptileWeightLogTableModalToggle,
        toggleReptileWeightLogTableModal,

        editableReptileWeightLog,
        handleModifyReptileWeightLogModalOpen,
        handleModifyReptileWeightLogModalClose,
        handleReptileWeightLogsDelete,

        viewableLogReptile,
        handleViewableReptileLogModalClose,
        handleViewableReptileLogModalOpen,
        handleModifyReptileWeightLogModalOpenInReptileTable
      }}
    >
      {children}
    </ReptileWeightLogContext.Provider>
  );
};
