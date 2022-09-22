import React from 'react';
import ReptileFeedingBoxes from './component/ReptileFeedingBoxes';
import { ModalProvider } from './context/ModalContext';
import { Helmet } from 'react-helmet-async';
import { ReptileFeedingBoxProvider } from './context/ReptileFeedingBoxContext';
import { ReptileProvider } from '../../libs/context/ReptileContext';

const ApplicationsReptileFeedingBox: React.FC = () => (
  <>
    <Helmet>
      <title>尾巴屋爬宠管理平台 - 容器管理</title>
    </Helmet>
    <ModalProvider>
      <ReptileProvider>
        <ReptileFeedingBoxProvider>
          <ReptileFeedingBoxes />
        </ReptileFeedingBoxProvider>
      </ReptileProvider>
    </ModalProvider>
  </>
);

export default ApplicationsReptileFeedingBox;
