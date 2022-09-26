import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { Box } from '@mui/material';


const PieMap: React.FC<{ title: string, rawData: any }> = ({ title, rawData }) => {
  const chartRef = useRef<any>();

  useEffect(() => {
    const myChart = echarts.init(chartRef.current);
    myChart.setOption({
      title: {
        text: title,
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      // legend: {
      //   type: 'scroll',
      //   orient: 'vertical',
      //   right: 0,
      //   top: 20,
      //   bottom: 20,
      //   data: rawData
      // },
      series: [
        {
          type: 'pie',
          radius: '50%',
          center: ['50%', '50%'],
          data: rawData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    });

  }, [chartRef]);
  return <Box sx={{ height: 400, width: '100%' }}>
    <div ref={chartRef} style={{ height: '100%' }}></div>
  </Box>;
};

export default PieMap;
