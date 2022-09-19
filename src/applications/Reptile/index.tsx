import Reptiles from './Reptiles';
import { Helmet } from 'react-helmet-async';
import { ModalProvider } from '../../libs/context/ModalContext';
import {ReptileFeedingLogTableModalProvider} from './ReptileFeedingLogTableModalContext';
import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const ApplicationsReptiles = () =>(
  <>
    <Helmet>
      <title>尾巴屋爬宠管理平台 - 爬宠管理</title>
    </Helmet>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ModalProvider>
        <ReptileFeedingLogTableModalProvider>
          <Reptiles/>
        </ReptileFeedingLogTableModalProvider>
      </ModalProvider>
    </LocalizationProvider>
  </>
);

export default ApplicationsReptiles;
