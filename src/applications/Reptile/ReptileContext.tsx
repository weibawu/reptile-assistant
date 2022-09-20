import React, { FC, useState, createContext, useContext } from 'react';
import { ModalContext } from './ModalContext';
import { Reptile, ReptileFeedingBoxIndexCollection, ReptileType, ReptileFeedingBox } from '../../models';
import { useReptileRepository } from '../../libs/reptile-repository/UseReptileRepository';
import { ReptileFeedingLogTableModalContext } from './ReptileFeedingLogTableModalContext';
type ReptileContext = {
  loading: boolean, // 是否正在获取数据
  currentUserDisplayedUsername: string, // 当前登陆用户用户名 TODO 提取公共Context

  ModalToggle: boolean, // 创建/编辑Reptile Modal显隐
  toggleModal: () => void, // 切换Reptile Modal显隐

  ReptileFeedingLogTableModalToggle: boolean, // 查看Reptile Feeding Log Modal显隐
  toggleReptileFeedingLogTableModal: () => void, // 切换Reptile Feeding Log Modal显隐

  reptiles: Reptile[],
  reptileTypes: ReptileType[],
  reptileFeedingBoxes: ReptileFeedingBox[],
  reptileFeedingBoxIndexes: ReptileFeedingBoxIndexCollection[],

  editableReptile: Reptile | undefined, // 正在编辑的Reptile
  handleModifyReptileModalOpen: (reptile: Reptile | undefined) => void, // 编辑Reptile -> 打开Modal
  handleModifyReptileModalClose: () => void, // 编辑完成 -> 关闭Modal
  handleReptilesDelete: (reptileIds: string[]) => void // 处理删除Reptiles逻辑

  viewableLogReptile: Reptile | undefined // 正在查看日志的Reptile
  handleViewableReptileLogModalOpen: (reptile: Reptile) => void // 打开正在查看日志的Reptile
  handleViewableReptileLogModalClose: () => void // 关闭正在查看日志的Reptile
};

export const ReptileContext = createContext<ReptileContext>(
  {} as ReptileContext
);

export const ReptileProvider: FC<{children: React.ReactNode}> = ({ children }) => {

  const {
    toggleModal,
    ModalToggle,
    closeModal
  } = useContext(ModalContext);
  const [editableReptile, setEditableReptile] = useState<Reptile | undefined>();

  const {
    toggleReptileFeedingLogTableModal,
    ReptileFeedingLogTableModalToggle,
    closeReptileFeedingLogTableModal,
  } = useContext(ReptileFeedingLogTableModalContext);
  const [viewableLogReptile, setViewableLogReptile] = useState<Reptile | undefined>();

  const {
    loading,
    currentUser,
    reptiles,
    reptileTypes,
    reptileFeedingBoxes,
    reptileFeedingBoxIndexes,
    reptileRepository
  } = useReptileRepository();

  const currentUserDisplayedUsername =
    currentUser.attributes
      ? currentUser.attributes.email
      : '新朋友';

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

  const handleViewableReptileLogModalOpen = (reptile: Reptile) => {
    setViewableLogReptile(reptile);
    toggleReptileFeedingLogTableModal();
  };

  const handleViewableReptileLogModalClose = () => {
    closeReptileFeedingLogTableModal();
    // todo try more elegant way to clear viewable log reptile before the modal close(don't use useEffect)
    setTimeout(() => {
      setViewableLogReptile(undefined);
    }, 100);
  };

  const handleReptilesDelete = async (reptileIds: string[]) => {
    for await (const reptileId of reptileIds) {
      await reptileRepository.removeReptile(reptileId);
    }
    await reptileRepository.fetchAll();
  };


  return (
    <ReptileContext.Provider
      value={{
        loading,
        currentUserDisplayedUsername,
        ModalToggle,
        toggleModal,
        ReptileFeedingLogTableModalToggle,
        toggleReptileFeedingLogTableModal,
        reptiles,
        reptileTypes,
        reptileFeedingBoxes,
        reptileFeedingBoxIndexes,
        editableReptile,
        handleModifyReptileModalOpen,
        handleModifyReptileModalClose,
        handleReptilesDelete,
        viewableLogReptile,
        handleViewableReptileLogModalClose,
        handleViewableReptileLogModalOpen,
      }}
    >
      {children}
    </ReptileContext.Provider>
  );
};