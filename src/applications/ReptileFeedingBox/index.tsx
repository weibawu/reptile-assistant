import React from 'react';
import ReptileFeedingBoxes from './ReptileFeedingBoxes';
import { ModalProvider } from './ModalContext';
import { Helmet } from 'react-helmet-async';

const ApplicationsReptileFeedingBox: React.FC = () => (
  <>
    <Helmet>
      <title>尾巴屋爬宠管理平台 - 容器管理</title>
    </Helmet>
    <ModalProvider>
      <ReptileFeedingBoxes/>
    </ModalProvider>
  </>
);

export default ApplicationsReptileFeedingBox;
