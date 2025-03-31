import { FC, memo, useEffect, useMemo } from 'react';

import { useMemoizedFn } from 'ahooks';
import { cloneDeep } from 'lodash';

import { useTab } from '@/libs/route';
import { useECharts } from '@/utils/hooks';
import { useLocation } from '@/utils/router';

import { formatThreeNumber } from './utils';

export const colorInfo = [
  '#3986FE',
  '#529CEB',
  '#35CACA',
  '#73E6BF',
  '#4CCA72',
  '#F26279',
  '#F08882',
  '#DB80D1',
  '#F57F50',
];

const ChartType: FC<any> = ({ data: originData }) => {
  const { pathname } = useLocation();
  const { href } = window.location;

  // x轴数据
  const xAxisData = useMemo(() => {
    return cloneDeep(originData?.columnsData)?.reverse() || [];
  }, [originData]);

  // 处理数据
  const data = useMemo(() => {
    if (originData) {
      let temp: Array<any> = [];
      // 筛选出不是标题的条目
      const noTitleData = originData?.resourceData?.filter((dataInfo: any) => !dataInfo?.quota?.isTitle);
      noTitleData?.forEach((dataInfo: any) => {
        let dataTemp: Array<any> = [];
        for (let key in dataInfo) {
          if (key !== 'key' && key !== 'quota') {
            dataTemp.push(dataInfo[key]);
          }
        }
        temp.push({
          name: dataInfo?.quota?.value,
          data: dataTemp?.reverse(),
        });
      });
      return temp;
    }
  }, [originData]);

  /**
   * 渲染tooltip的函数
   * @param data 接收的数据
   * @param index 接收的索引, -1表示没有index
   * @returns string类型的html
   */
  const renderTooltip = useMemoizedFn((data: any, index?: number) => {
    const marker = `<span style="display:inline-block;margin-right:6px;width: 5px;height:5px;background-color:${data?.color}; vertical-align: middle"></span>`;
    const circleMarker = `<span style="display:inline-block;margin-right:6px;width: 5px;height:5px;background-color:${data?.color}; vertical-align: middle; border-radius: 50%;"></span>`;
    const name = `<span>${
      data?.seriesName?.includes('同比') ? data?.seriesName + '(%)' : data?.seriesName + '(亿元)' || '-'
    }：</span>`;
    const content = `<span>${data?.value && !isNaN(+data?.value) ? formatThreeNumber(data?.value) : '-'}</span>`;
    // index -1 时将 增量 顶格展示，不需要占位
    return `<div style="margin-bottom: 6px;display: flex;align-items: center; font-size: 12px"><div>${
      (index !== -1 ? (index ? marker : circleMarker) : '') + name
    }</div><div>${content}</div></div>`;
  });

  const option = useMemo(() => {
    const totalInfo = data?.shift();
    const legendData = data?.map((item: any, idx: number) => ({
      name: idx ? item?.name?.replace('(亿元)', '') : item?.name?.replace('(%)', ''),
      icon: idx ? 'rect' : 'circle',
    }));
    return {
      legend: {
        data: legendData,
        padding: 2,
        itemGap: 8,
        itemWidth: 7,
        itemHeight: 7,
        textStyle: {
          color: '#8C8C8C',
          // width:60,
          // overflow:'truncate',
        },
        bottom: 9,
        // bottom: 3,
      },
      title: [
        {
          text: '融资金额(亿元)',
          padding: [5, 0, 0, 0],
          left: 0,
          textStyle: {
            color: '#434343',
            fontSize: 12,
            fontWeight: 400,
          },
        },
        {
          text: '增速(%)',
          padding: [5, 0, 0, 0],
          right: 0,
          textStyle: {
            color: '#434343',
            fontSize: 12,
            fontWeight: 400,
          },
        },
      ],
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255,255,255, .88)',
        extraCssText: 'box-shadow: 1px 1px 5px 0px rgba(0,0,0,0.20);border-radius: 2px;z-index: 2;',
        textStyle: {
          color: '#3C3C3C',
          lineHeight: 17,
        },
        // 弹窗限制在chart图之内
        confine: true,
        padding: [9, 10, 3, 10],
        formatter(params: any) {
          const title = `<div style="margin-bottom: 6px; font-size: 12px; font-weight: 500;">${params?.[0]?.name?.replace(
            '年',
            '',
          )}</div>`;
          // 手动加上增量
          const total = renderTooltip(
            {
              seriesName: totalInfo?.name?.replace('(亿元)', ''),
              value: totalInfo?.data?.[params?.[0]?.dataIndex],
            },
            -1,
          );
          return title + total + params?.map((data: any, index: number) => renderTooltip(data, index)).join('');
        },
      },
      grid: {
        top: 35,
        right: 0,
        bottom: 50,
        left: 0,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
        axisLine: {
          lineStyle: {
            color: '#dfdfdf',
          },
        },
        axisTick: {
          show: false,
          alignWithLabel: true,
        },
        axisLabel: {
          color: '#8C8C8C',
          fontWeight: 300,
        },
      },
      yAxis: [
        {
          // name: '融资金额(亿元)',
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
            alignWithLabel: true,
          },
          axisLabel: {
            color: '#8c8c8c',
            fontWeight: 300,
            formatter(value: number) {
              return formatThreeNumber(value.toFixed(2));
            },
          },
          splitLine: {
            lineStyle: {
              color: '#dfdfdf',
              type: 'dashed',
            },
          },
        },
        {
          // name: '增速(%)',
          // nameGap: 18,
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
            alignWithLabel: true,
          },
          axisLabel: {
            color: '#8c8c8c',
            fontWeight: 300,
            formatter(value: number) {
              return formatThreeNumber(value.toFixed(2));
            },
          },
          splitLine: {
            show: false,
          },
        },
      ],
      series: data?.map((info: any, idx: number) => {
        return idx === 0
          ? {
              type: 'line',
              name: info?.name?.replace('(%)', ''),
              barWidth: 50,
              yAxisIndex: 1,
              data: info?.data,
              color: '#F9D237',
            }
          : {
              type: 'bar',
              name: info?.name?.replace('(亿元)', ''),
              data: info?.data,
              barWidth: 50,
              stack: 'year',
              color: colorInfo[idx - 1],
            };
      }),
    };
  }, [xAxisData, data, renderTooltip]);

  const [chartRef, chartInstance] = useECharts(option as any, 'svg', href, false);

  useEffect(() => {
    if (chartInstance) {
      (chartInstance as any)?.setOption(option, true);
      const chart = (chartInstance as any)._dom;

      if (chart?.offsetWidth < chart.children[0]?.clientWidth) {
        chartInstance.resize();
      }
    }
  }, [option, chartInstance, pathname]); // 监听条件

  // 监听拖动左侧目录树导致的图表变化
  useEffect(() => {
    const contentViewDom = document.querySelector('.main-content') as HTMLElement;
    const resizeOb = new ResizeObserver((entries) => {
      requestAnimationFrame(() => {
        if (chartInstance) {
          (chartInstance as any)?.resize();
        }
      });
    });
    resizeOb.observe(contentViewDom);

    return () => {
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

export default memo(ChartType);
