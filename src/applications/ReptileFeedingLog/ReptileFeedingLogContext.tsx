import React, { FC, useState, createContext, useContext } from 'react';
import { ModalContext } from './ModalContext';
import { Reptile, ReptileFeedingLog } from '../../models';
import { useReptileRepository } from '../../libs/reptile-repository/UseReptileRepository';
type ReptileFeedingLogContext = {
  loading: boolean,
  ModalToggle: boolean,
  reptiles: Reptile[],
  reptileFeedingLogs: ReptileFeedingLog[],
  currentUserDisplayedUsername: string,
  editableReptileFeedingLog: ReptileFeedingLog | undefined,
  handleModifyReptileFeedingLogModalOpen: (reptileFeedingLog: ReptileFeedingLog | undefined) => void,
  handleModifyReptileFeedingLogModalClose: () => void,
  handleReptileFeedingLogsDelete: (reptileFeedingLogIds: string[]) => void
  toggleModal: () => void
};

export const ReptileFeedingLogContext = createContext<ReptileFeedingLogContext>(
  {} as ReptileFeedingLogContext
);

export const ReptileFeedingLogProvider: FC<{children: React.ReactNode}> = ({ children }) => {

  const {
    toggleModal,
    ModalToggle,
    closeModal
  } = useContext(ModalContext);
  const [editableReptileFeedingLog, setEditableReptileFeedingLog] = useState<ReptileFeedingLog | undefined>();

  const {
    loading,
    currentUser,
    reptiles,
    reptileFeedingLogs,
    reptileRepository
  } = useReptileRepository();

  const currentUserDisplayedUsername =
    currentUser.attributes
      ? currentUser.attributes.email
      : '新朋友';

  const handleModifyReptileFeedingLogModalOpen = (reptileFeedingLog: ReptileFeedingLog | undefined) => {
    if (reptileFeedingLog) {
      console.log(reptileFeedingLog);
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



  return (
    <ReptileFeedingLogContext.Provider
      value={{
        loading,
        ModalToggle,
        toggleModal,
        reptiles,
        reptileFeedingLogs,
        currentUserDisplayedUsername,
        editableReptileFeedingLog,
        handleModifyReptileFeedingLogModalOpen,
        handleModifyReptileFeedingLogModalClose,
        handleReptileFeedingLogsDelete
      }}
    >
      {children}
    </ReptileFeedingLogContext.Provider>
  );
};
