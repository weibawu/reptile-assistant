import { Helmet } from 'react-helmet-async';
import { ModalProvider } from './context/ModalContext';
import { ReptileTemperatureAndHumidityLogTableModalProvider } from './context/ReptileTemperatureAndHumidityLogTableModalContext';
import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ReptileTemperatureAndHumidityLogProvider } from './context/ReptileTemperatureAndHumidityLogContext';
import { ReptileProvider } from '../../libs/context/ReptileContext';
import Reptiles from './component/Reptile';

const ApplicationsReptileTemperatureAndHumidityLog = () => (
  <>
    <Helmet>
      <title>尾巴屋爬宠管理平台 - 温湿度日志</title>
    </Helmet>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ModalProvider>
        <ReptileTemperatureAndHumidityLogTableModalProvider>
          <ReptileProvider>
            <ReptileTemperatureAndHumidityLogProvider>
              <Reptiles />
            </ReptileTemperatureAndHumidityLogProvider>
          </ReptileProvider>
        </ReptileTemperatureAndHumidityLogTableModalProvider>
      </ModalProvider>
    </LocalizationProvider>
  </>
);

export default ApplicationsReptileTemperatureAndHumidityLog;
