import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { Box } from '@mui/material';

type RawNode = {
  [key: string]: RawNode
} & {
  $count: number
}

interface TreeNode {
  name: string
  value: number
  children?: TreeNode[]
}

export const TreeMap: React.FC<{ rawData: RawNode; title: string; rootName: string }> = ({
  rawData,
  title,
  rootName,
}) => {
  const chartRef = useRef<any>();

  useEffect(() => {
    const myChart = echarts.init(chartRef.current);

    function convert(source: RawNode, target: TreeNode, basePath: string) {
      for (const key in source) {
        const path = basePath ? basePath + ' - ' + key : key;
        if (!key.match(/^\$/)) {
          target.children = target.children || [];
          const child = {
            name: path,
          } as TreeNode;
          target.children.push(child);
          convert(source[key], child, path);
        }
      }

      if (!target.children) {
        target.value = source.$count || 1;
      } else {
        target.children.push({
          name: basePath,
          value: source.$count,
        });
      }
    }

    const data = {
      children: [] as TreeNode[],
    } as TreeNode;

    convert(rawData, data, '');

    myChart.setOption({
      title: {
        text: title,
        left: 'center',
      },
      tooltip: {},
      series: [
        {
          name: rootName,
          type: 'treemap',
          visibleMin: 300,
          data: data.children,
          leafDepth: 1,
          levels: [
            {
              itemStyle: {},
            },
            {
              colorSaturation: [0.3, 0.5],
              itemStyle: {},
            },
            {
              colorSaturation: [0.3, 0.6],
              itemStyle: {},
            },
            {
              colorSaturation: [0.3, 0.6],
            },
          ],
          roam: false,
        },
      ],
    });
  }, [chartRef, rawData]);
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <div ref={chartRef} style={{ height: '100%' }}></div>
    </Box>
  );
};
