import React from 'react';
import { Helmet } from 'react-helmet-async';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { ModalProvider } from './context/ModalContext';
import { ReptileEditingProvider } from './context/ReptileEditingContext';

import { ReptileProvider } from '../../libs/context/ReptileContext';
import ReptileEditing from './component/ReptileEditing';

const ApplicationsReptileEditing = () => (
  <>
    <Helmet>
      <title>尾巴屋爬宠管理平台 - 爬宠管理</title>
    </Helmet>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ModalProvider>
        <ReptileProvider>
          <ReptileEditingProvider>
            <ReptileEditing />
          </ReptileEditingProvider>
        </ReptileProvider>
      </ModalProvider>
    </LocalizationProvider>
  </>
);

export default ApplicationsReptileEditing;
