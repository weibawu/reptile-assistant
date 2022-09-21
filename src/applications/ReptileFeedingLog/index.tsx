import { Helmet } from 'react-helmet-async';
import { ModalProvider } from './context/ModalContext';
import { ReptileFeedingLogTableModalProvider } from './context/ReptileFeedingLogTableModalContext';
import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ReptileFeedingLogProvider } from './context/ReptileFeedingLogContext';
import { ReptileProvider } from '../../libs/context/ReptileContext';
import Reptiles from './component/Reptile';

const ApplicationsReptileFeedingLog = () => (
  <>
    <Helmet>
      <title>尾巴屋爬宠管理平台 - 饲育日志</title>
    </Helmet>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ModalProvider>
        <ReptileFeedingLogTableModalProvider>
          <ReptileProvider>
            <ReptileFeedingLogProvider>
              <Reptiles />
            </ReptileFeedingLogProvider>
          </ReptileProvider>
        </ReptileFeedingLogTableModalProvider>
      </ModalProvider>
    </LocalizationProvider>
  </>
);

export default ApplicationsReptileFeedingLog;
