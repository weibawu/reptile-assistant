import React from 'react';
import ReptileFeedingLogs from './ReptileFeedingLogs';
import { ModalProvider } from './ModalContext';
import { Helmet } from 'react-helmet-async';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { ReptileFeedingLogProvider } from './ReptileFeedingLogContext';

const ApplicationsReptileFeedingLog: React.FC = () => (
  <>
    <Helmet>
      <title>尾巴屋爬宠管理平台 - 饲育日志查询</title>
    </Helmet>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ModalProvider>
        <ReptileFeedingLogProvider>
          <ReptileFeedingLogs/>
        </ReptileFeedingLogProvider>
      </ModalProvider>
    </LocalizationProvider>
  </>
);

export default ApplicationsReptileFeedingLog;
