import React from 'react';
import ReptileFeedingBoxes from './component/ReptileFeedingBoxes';
import { ModalProvider } from './context/ModalContext';
import { Helmet } from 'react-helmet-async';
import { ReptileFeedingBoxProvider } from './context/ReptileFeedingBoxContext';

const ApplicationsReptileFeedingBox: React.FC = () => (
  <>
    <Helmet>
      <title>尾巴屋爬宠管理平台 - 容器管理</title>
    </Helmet>
    <ModalProvider>
      <ReptileFeedingBoxProvider>
        <ReptileFeedingBoxes />
      </ReptileFeedingBoxProvider>
    </ModalProvider>
  </>
);

export default ApplicationsReptileFeedingBox;
