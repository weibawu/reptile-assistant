import { Helmet } from 'react-helmet-async';
import { ModalProvider } from './context/ModalContext';
import { ReptileWeightLogTableModalProvider } from './context/ReptileWeightLogTableModalContext';
import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ReptileWeightLogProvider } from './context/ReptileWeightLogContext';
import { ReptileProvider } from '../../libs/context/ReptileContext';
import Reptiles from './component/Reptiles';

const ApplicationsReptileWeightLog = () => (
  <>
    <Helmet>
      <title>尾巴屋爬宠管理平台 - 体重日志</title>
    </Helmet>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ModalProvider>
        <ReptileWeightLogTableModalProvider>
          <ReptileProvider>
            <ReptileWeightLogProvider>
              <Reptiles />
            </ReptileWeightLogProvider>
          </ReptileProvider>
        </ReptileWeightLogTableModalProvider>
      </ModalProvider>
    </LocalizationProvider>
  </>
);

export default ApplicationsReptileWeightLog;
