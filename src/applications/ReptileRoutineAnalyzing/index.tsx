import React from 'react';
import { Helmet } from 'react-helmet-async';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { ModalProvider } from './context/ModalContext';
import { ReptileRoutineAnalyzingProvider } from './context/ReptileRoutineAnalyzingContext';

import { ReptileProvider } from '../../libs/context/ReptileContext';
import ReptileRoutineAnalyzing from './component/ReptileRoutineAnalyzing';

const ApplicationsReptileRoutineAnalyzing = () => (
  <>
    <Helmet>
      <title>尾巴屋爬宠管理平台 - 爬宠管理</title>
    </Helmet>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ModalProvider>
        <ReptileProvider>
          <ReptileRoutineAnalyzingProvider>
            <ReptileRoutineAnalyzing />
          </ReptileRoutineAnalyzingProvider>
        </ReptileProvider>
      </ModalProvider>
    </LocalizationProvider>
  </>
);

export default ApplicationsReptileRoutineAnalyzing;
