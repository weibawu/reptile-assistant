import React, { FC, useState, createContext, useContext } from 'react';
import { ModalContext } from './ModalContext';
import { ReptileFeedingBox } from '../../models';
import { useReptileRepository } from '../../libs/reptile-repository/UseReptileRepository';

type ReptileFeedingBoxContext = {
  loading: boolean, // 是否正在获取数据
  currentUserDisplayedUsername: string, // 当前登陆用户用户名 TODO 提取公共Context

  ModalToggle: boolean, // 创建/编辑Reptile Modal显隐
  toggleModal: () => void, // 切换Reptile Modal显隐

  reptileFeedingBoxes: ReptileFeedingBox[],

  editableReptileFeedingBox: ReptileFeedingBox | undefined,
  handleModifyReptileFeedingBoxModalOpen: (reptileFeedingBox: ReptileFeedingBox | undefined) => void,
  handleModifyReptileFeedingBoxModalClose: () => void,
  handleReptileFeedingBoxesDelete: (reptileFeedingBoxIds: string[]) => void
};

export const ReptileFeedingBoxContext = createContext<ReptileFeedingBoxContext>(
  {} as ReptileFeedingBoxContext
);

export const ReptileFeedingBoxProvider: FC<{children: React.ReactNode}> = ({ children }) => {

  const {
    toggleModal,
    ModalToggle,
    closeModal
  } = useContext(ModalContext);
  const [editableReptileFeedingBox, setEditableReptileFeedingBox] = useState<ReptileFeedingBox | undefined>();

  const {
    loading,
    currentUser,
    reptileFeedingBoxes,
    reptileRepository
  } = useReptileRepository();

  const currentUserDisplayedUsername =
    currentUser.attributes
      ? currentUser.attributes.email
      : '新朋友';

  const handleModifyReptileFeedingBoxModalOpen = (reptileFeedingBox: ReptileFeedingBox | undefined) => {
    if (reptileFeedingBox) {
      setEditableReptileFeedingBox(reptileFeedingBox);
    }
    toggleModal();
  };

  const handleModifyReptileFeedingBoxModalClose = () => {
    setEditableReptileFeedingBox(undefined);
    closeModal();
  };

  const handleReptileFeedingBoxesDelete = async (reptileFeedingBoxIds: string[]) => {
    for await (const reptileFeedingBoxId of reptileFeedingBoxIds) {
      await reptileRepository.removeReptileFeedingBox(reptileFeedingBoxId);
    }
    await reptileRepository.fetchAll();
  };



  return (
    <ReptileFeedingBoxContext.Provider
      value={{
        loading,
        currentUserDisplayedUsername,
        ModalToggle,
        toggleModal,
        reptileFeedingBoxes,
        editableReptileFeedingBox,
        handleModifyReptileFeedingBoxModalOpen,
        handleModifyReptileFeedingBoxModalClose,
        handleReptileFeedingBoxesDelete
      }}
    >
      {children}
    </ReptileFeedingBoxContext.Provider>
  );
};
