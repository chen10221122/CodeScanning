import { FC, useEffect, useMemo } from 'react';

import { useTab } from '@/libs/route';
import { EchartsOption, useECharts } from '@/utils/hooks';

export interface OptioinsProp {
  chartDataInfo: any[];
}
const color = [
  '#3986FE',
  '#F57F50',
  '#F9D237',
  '#35CACA',
  '#73E6BF',
  '#4CCA72',
  '#F26279',
  '#DB80D1',
  '#9D8AEE',
  '#529CEB',
  '#965EE3',
  '#F08882',
  '#60C3D2',
  '#EDB965',
  '#7D90DB',
  '#9CD88A',
  '#31B0F7',
  '#FDB078',
];
const ChartContainer: FC<OptioinsProp> = ({ chartDataInfo }) => {
  const option: EchartsOption = useMemo(
    () => ({
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(255, 255, 255, 0.88)',
        textStyle: {
          color: '#3c3c3c',
          fontSize: 13,
          lineHeight: 20,
        },
        appendToBody: true,
        extraCssText:
          'border-radius: 2px;padding: 10px 12px;box-sizing: border-box; box-shadow: 1px 1px 5px 0px rgba(0,0,0,0.20);',
        formatter: (params: any) => {
          const curData = params?.data;
          const name = `<span>${params?.name ?? '-'}</span>`;
          const content = `<span><span>金额(亿)：${curData.mValue || '-'}</span></span>`;
          return `<div style='min-width: 202px;z-index: 2'><div style='margin-bottom: 4px;'>${name}</div><div style='display: flex; align-items: center; justify-content: space-between;'>${content}</div></div>`;
        },
      },
      series: [
        {
          type: 'treemap',
          top: 18,
          left: 18,
          bottom: 16,
          right: 18,
          // 是否缩放，默认为可缩放
          roam: false,
          // 点击的行为
          nodeClick: false,
          // 底部的面包屑
          breadcrumb: {
            show: false,
          },
          // 内部文字标签
          label: {
            formatter: (params: any) => {
              return params.name + '\n' + params?.data?.mValue;
            },
            lineHeight: 18,
          },
          itemStyle: {
            // 每个色块之间的间距
            gapWidth: chartDataInfo?.length > 1 ? 1 : 0,
          },
          data: chartDataInfo
            ? chartDataInfo?.map((item: any, i: number) => {
                return {
                  mValue: item.value_0,
                  value: item.percent_0 || '-',
                  name: item.name,
                  itemStyle: {
                    color: color[i],
                  },
                };
              })
            : [],
        },
      ],
    }),
    [chartDataInfo],
  );

  const [chartRef, chartInstance] = useECharts(option, 'canvas');

  useEffect(() => {
    if (chartInstance && option) {
      chartInstance.setOption(option);
      const chart = (chartInstance as any)._dom;
      if (chart?.offsetWidth !== chart.children[0]?.clientWidth) {
        chartInstance.resize();
      }
    }
  }, [chartInstance, option]);

  useEffect(() => {
    const resize = () => {
      chartInstance?.resize();
    };

    window.addEventListener('resize', resize);

    // 监听拖动左侧目录树导致的图表变化
    const contentViewDom = document.getElementsByClassName('side-content')?.[0];

    const resizeOb = new ResizeObserver((entries) => {
      requestAnimationFrame(() => resize());
    });
    contentViewDom && resizeOb.observe(contentViewDom);

    return () => {
      window.removeEventListener('resize', resize);
      resizeOb.disconnect();
    };
  }, [chartInstance]);

  useTab({
    onActive() {
      if (chartInstance) {
        (chartInstance as any)?.resize();
      }
    },
  });

  return <div style={{ width: '100%', height: '100%' }} ref={chartRef}></div>;
};

export default ChartContainer;
