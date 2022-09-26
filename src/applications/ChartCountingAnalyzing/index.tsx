import React from 'react';
import { ReptileProvider } from '../../libs/context/ReptileContext';
import TreeMapAnalyzing from './TreeMapAnalyzing';

const ChartCountingAnalyzing = () => (
  <ReptileProvider>
    <TreeMapAnalyzing />
  </ReptileProvider>
);

export default ChartCountingAnalyzing;
