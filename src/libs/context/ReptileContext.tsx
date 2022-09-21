import React, { FC, createContext } from 'react';
import {
  Reptile,
  ReptileFeedingBoxIndexCollection,
  ReptileType,
  ReptileFeedingBox,
  ReptileFeedingLog
} from '../../models';

import { useReptileRepository } from '../reptile-repository/UseReptileRepository';
import ReptileRepository from '../reptile-repository/ReptileRepository';

import {
  CognitoUserAmplify
} from '@aws-amplify/ui-react/node_modules/@aws-amplify/ui/dist/types/types/authenticator/user.d';

type ReptileContext = {
  loading: boolean, // 是否正在获取数据
  reptiles: Reptile[],
  reptileTypes: ReptileType[],
  reptileFeedingBoxes: ReptileFeedingBox[],
  reptileFeedingBoxIndexes: ReptileFeedingBoxIndexCollection[],
  reptileFeedingLogs: ReptileFeedingLog[],
  reptileRepository: ReptileRepository,
  currentUser: CognitoUserAmplify,
  currentUserDisplayedUsername: string,
  handleReptilesDelete: (reptileIds: string[]) => void // 处理删除Reptiles逻辑
};

export const ReptileContext = createContext<ReptileContext>(
  {} as ReptileContext
);

export const ReptileProvider: FC<{children: React.ReactNode}> = ({ children }) => {
  const {
    loading,
    currentUser,
    reptiles,
    reptileTypes,
    reptileFeedingBoxes,
    reptileFeedingBoxIndexes,
    reptileFeedingLogs,
    reptileRepository
  } = useReptileRepository();

  const currentUserDisplayedUsername =
    currentUser.attributes
      ? currentUser.attributes.email
      : '新朋友';

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
        reptiles,
        reptileTypes,
        reptileFeedingBoxes,
        reptileFeedingBoxIndexes,
        reptileFeedingLogs,
        reptileRepository,
        currentUser,
        currentUserDisplayedUsername,
        handleReptilesDelete,
      }}
    >
      {children}
    </ReptileContext.Provider>
  );
};
