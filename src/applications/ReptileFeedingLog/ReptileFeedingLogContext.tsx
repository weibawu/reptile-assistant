import React, { FC, useState, createContext, useContext } from 'react';
import { ModalContext } from './ModalContext';
import { Reptile, ReptileFeedingLog } from '../../models';
import { useReptileRepository } from '../../libs/reptile-repository/UseReptileRepository';
type ReptileFeedingLogContext = {
  loading: boolean,
  currentUserDisplayedUsername: string,

  ModalToggle: boolean,
  toggleModal: () => void

  reptiles: Reptile[],
  reptileFeedingLogs: ReptileFeedingLog[],

  editableReptileFeedingLog: ReptileFeedingLog | undefined,
  handleModifyReptileFeedingLogModalOpen: (reptileFeedingLog: ReptileFeedingLog | undefined) => void,
  handleModifyReptileFeedingLogModalClose: () => void,
  handleReptileFeedingLogsDelete: (reptileFeedingLogIds: string[]) => void
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
        currentUserDisplayedUsername,
        ModalToggle,
        toggleModal,
        reptiles,
        reptileFeedingLogs,
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
