import Reptiles from './Reptiles';
import { Helmet } from 'react-helmet-async';
import { ModalProvider } from './ModalContext';
import {ModalProvider as ReptileFeedingLogModalProvider } from '../ReptileFeedingLog/ModalContext';
import {ReptileFeedingLogTableModalProvider} from './ReptileFeedingLogTableModalContext';
import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ReptileFeedingLogProvider } from '../ReptileFeedingLog/ReptileFeedingLogContext';

const ApplicationsReptiles = () =>(
  <>
    <Helmet>
      <title>尾巴屋爬宠管理平台 - 爬宠管理</title>
    </Helmet>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ReptileFeedingLogModalProvider>
        <ReptileFeedingLogProvider>
          <ModalProvider>
            <ReptileFeedingLogTableModalProvider>
              <Reptiles/>
            </ReptileFeedingLogTableModalProvider>
          </ModalProvider>
        </ReptileFeedingLogProvider>
      </ReptileFeedingLogModalProvider>
    </LocalizationProvider>
  </>
);

export default ApplicationsReptiles;
