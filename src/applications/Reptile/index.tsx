import Reptiles from './Reptiles';
import { Helmet } from 'react-helmet-async';
import { ModalProvider } from '../../libs/context/ModalContext';
import {ReptileFeedingLogTableModalProvider} from './ReptileFeedingLogTableModalContext';
import React from 'react';

const ApplicationsReptiles = () =>(
  <>
    <Helmet>
      <title>尾巴屋爬宠管理平台 - 爬宠管理</title>
    </Helmet>
    <ModalProvider>
      <ReptileFeedingLogTableModalProvider>
        <Reptiles/>
      </ReptileFeedingLogTableModalProvider>
    </ModalProvider>
  </>
);

export default ApplicationsReptiles;
