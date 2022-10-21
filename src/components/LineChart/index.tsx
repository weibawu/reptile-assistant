import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { Box } from '@mui/material';

const LineChart: React.FC<{ title: any; xAxisData: any; seriesData: any }> = ({
  xAxisData,
  seriesData,
  title,
}) => {
  const chartRef = useRef<any>();

  useEffect(() => {
    const myChart = echarts.init(chartRef.current);
    myChart.setOption({
      title: {
        text: title,
        left: 'center',
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}g',
        },
        axisPointer: {
          snap: true,
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
        formatter(params: any) {
          return params[0].value + 'g';
        },
      },
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {
            title: '保存图片',
          },
        },
      },
      series: [
        {
          data: seriesData,
          type: 'line',
          smooth: true,
        },
      ],
    });
  }, [chartRef]);
  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <div ref={chartRef} style={{ height: '100%' }}></div>
    </Box>
  );
};

export default LineChart;
