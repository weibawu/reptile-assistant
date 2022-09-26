import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { Box } from '@mui/material';


const BarMap: React.FC<{ title: string, rawData: any }> = ({ title, rawData }) => {
  const chartRef = useRef<any>();

  useEffect(() => {
    const myChart = echarts.init(chartRef.current);
    myChart.setOption({
      legend: {},
      tooltip: {},
      dataset: {
        source: rawData
      },
      xAxis: { type: 'category' },
      yAxis: {},
      // Declare several bar series, each will be mapped
      // to a column of dataset.source by default.
      series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }]
    });

  }, [chartRef]);
  return <Box sx={{ height: 400, width: '100%' }}>
    <div ref={chartRef} style={{ height: '100%' }}></div>
  </Box>;
};

export default BarMap;
