import React from 'react';
import ReptileFeedingLogs from './ReptileFeedingLogs';
import { ModalProvider } from '../../libs/context/ModalContext';
import { Helmet } from 'react-helmet-async';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';

const ApplicationsReptileFeedingLog: React.FC = () => (
  <>
    <Helmet>
      <title>尾巴屋爬宠管理平台 - 饲养日志查询</title>
    </Helmet>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ModalProvider>
        <ReptileFeedingLogs/>
      </ModalProvider>
    </LocalizationProvider>
  </>
);

export default ApplicationsReptileFeedingLog;
