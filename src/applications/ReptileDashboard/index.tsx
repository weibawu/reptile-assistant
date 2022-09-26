import React from 'react';
import { ReptileProvider } from '../../libs/context/ReptileContext';
import ReptileDashboardDiagramGroup from './ReptileDashboardDiagramGroup';

// todo reformat
const ReptileDashboard = () => (
  <ReptileProvider>
    <ReptileDashboardDiagramGroup />
  </ReptileProvider>
);

export default ReptileDashboard;
