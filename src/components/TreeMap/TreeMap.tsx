import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

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

export const TreeMap: React.FC<{ rawData: RawNode; title: string }> = ({ rawData, title }) => {
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
      tooltip: {},
      series: [
        {
          name: title,
          type: 'treemap',
          visibleMin: 300,
          data: data.children,
          leafDepth: 2,
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
  return <div ref={chartRef} style={{ height: '80vh' }}></div>;
};
