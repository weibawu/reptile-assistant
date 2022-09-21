import React, { FC, useState, createContext, useContext, useEffect } from 'react';
import { ModalContext } from './ModalContext';
import { Reptile, ReptileFeedingLog } from '../../../models';

import { useReptileRepository } from '../../../libs/reptile-repository/UseReptileRepository';
import { ReptileContext } from '../../../libs/context/ReptileContext';

type ReptileEditingContext = {
  ModalToggle: boolean, // 创建/编辑Reptile Modal显隐
  toggleModal: () => void, // 切换Reptile Modal显隐

  editableReptile: Reptile | undefined, // 正在编辑的Reptile
  handleModifyReptileModalOpen: (reptile: Reptile | undefined) => void, // 编辑Reptile -> 打开Modal
  handleModifyReptileModalClose: () => void, // 编辑完成 -> 关闭Modal
  handleReptilesDelete: (reptileIds: string[]) => void // 处理删除Reptiles逻辑
};

export const ReptileEditingContext = createContext<ReptileEditingContext>(
  {} as ReptileEditingContext
);

export const ReptileEditingProvider: FC<{children: React.ReactNode}> = ({ children }) => {

  const { handleReptilesDelete } = useContext(ReptileContext);

  const {
    toggleModal,
    ModalToggle,
    closeModal
  } = useContext(ModalContext);
  const [editableReptile, setEditableReptile] = useState<Reptile | undefined>();

  const handleModifyReptileModalOpen = (reptile: Reptile | undefined) => {
    if (reptile) {
      setEditableReptile(reptile);
    }
    toggleModal();
  };

  const handleModifyReptileModalClose = () => {
    setEditableReptile(undefined);
    closeModal();
  };

  return (
    <ReptileEditingContext.Provider
      value={{
        ModalToggle,
        toggleModal,
        editableReptile,
        handleModifyReptileModalOpen,
        handleModifyReptileModalClose,
        handleReptilesDelete,
      }}
    >
      {children}
    </ReptileEditingContext.Provider>
  );
};
