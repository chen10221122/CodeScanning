import { useMemo } from 'react';

import { useMemoizedFn } from 'ahooks';
import { cloneDeep } from 'lodash';
import styled from 'styled-components';

import { Skeleton } from '@/components/antd';
import { formatThreeNumber } from '@/pages/area/areaF9/modules/regionalFinancing/socialFinance/utils';
import Chart from '@/pages/area/areaFinancingBoard/components/Chart';
import { symbol } from '@/pages/area/areaFinancingBoard/config';
import { titleStyle, legendStyle, axisStyle } from '@/pages/area/areaFinancingBoard/style';

import useRegion from './useRegion';

export const colors = [
  '#006EFF',
  '#1A8EFF',
  '#4CA7FF',
  '#8DC7FF',
  '#C3E2FF',
  '#91E1DA',
  '#B7FFE2',
  '#6AF2DA',
  '#56DFFF',
];

//代码参考：src\pages\area\areaF9\modules\regionalFinancing\socialFinance\chart.tsx
const Region = () => {
  const { originData, loading } = useRegion();

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
        itemGap: 20,
        itemWidth: 8,
        itemHeight: 8,
        // height: 24,
        bottom: 0,
        type: 'scroll',
        textStyle: legendStyle,
        pageIcons: {
          horizontal: [
            'path://M729.6 931.2l-416-425.6 416-416c9.6-9.6 9.6-25.6 0-35.2-9.6-9.6-25.6-9.6-35.2 0l-432 435.2c-9.6 9.6-9.6 25.6 0 35.2l432 441.6c9.6 9.6 25.6 9.6 35.2 0C739.2 956.8 739.2 940.8 729.6 931.2z',
            'path://M761.6 489.6l-432-435.2c-9.6-9.6-25.6-9.6-35.2 0-9.6 9.6-9.6 25.6 0 35.2l416 416-416 425.6c-9.6 9.6-9.6 25.6 0 35.2s25.6 9.6 35.2 0l432-441.6C771.2 515.2 771.2 499.2 761.6 489.6z',
          ],
        },
        pageTextStyle: {
          color: '#141414',
          fontSize: 10,
        },
        pageButtonItemGap: 5,
        pageIconSize: [8, 10],
        pageIconColor: '#434343',
        pageIconInactiveColor: '#e0e0e0',
      },
      title: [
        {
          text: '融资金额(亿元)',
          padding: [5, 0, 0, 0],
          left: 0,
          textStyle: titleStyle,
        },
        {
          text: '增速(%)',
          padding: [5, 0, 0, 0],
          right: 0,
          textStyle: titleStyle,
        },
      ],
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255,255,255, .88)',
        extraCssText: 'box-shadow: 1px 1px 5px 0px rgba(0,0,0,0.20);border-radius: 2px;z-index: 2;',
        textStyle: {
          color: '#262626',
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
        bottom: 30,
        left: 0,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
        boundaryGap: true,
        axisLine: {
          onZero: false,
          lineStyle: {
            color: '#F6F6F6',
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: axisStyle,
      },
      yAxis: [
        {
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            ...axisStyle,
            formatter(value: number) {
              return formatThreeNumber(value.toFixed(2));
            },
          },
          splitLine: {
            show: false,
          },
        },
        {
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            ...axisStyle,
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
              smooth: true,
              symbol: symbol,
              symbolSize: 12,
              lineStyle: {
                width: 1,
              },
              showSymbol: false,
              name: info?.name?.replace('(%)', ''),
              barWidth: 50,
              yAxisIndex: 1,
              data: info?.data,
              color: '#FF6B00',
            }
          : {
              type: 'bar',
              name: info?.name?.replace('(亿元)', ''),
              data: info?.data,
              barWidth: 16,
              stack: 'year',
              color: colors[idx - 1],
            };
      }),
    };
  }, [xAxisData, data, renderTooltip]);

  return (
    <Skeleton paragraph={{ rows: 4 }} active loading={loading}>
      <ChartWrapper>
        <Chart option={option} isSvg={false} />
      </ChartWrapper>
    </Skeleton>
  );
};

export default Region;

const ChartWrapper = styled.div`
  height: 191px;
`;
