import { useMemo } from 'react';

import { useMemoizedFn } from 'ahooks';
import { max } from 'lodash';

import { formatThreeNumber } from '@/pages/area/areaF9/modules/regionalFinancing/socialFinance/utils';
import { symbol } from '@/pages/area/areaFinancingBoard/config';
import { keepTwoDecimal } from '@/utils/format';

const useChartOption = (
  dateArray: any[],
  aShareIPO: any[],
  aShareRefinance: any[],
  newThreeIncrease: any,
  financeCount: any[],
) => {
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
    return {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        extraCssText: 'box-shadow: 2px 2px 10px 0 rgba(0,0,0,0.20); padding: 6px 12px;border-radius: 3px;z-index:2',
        textStyle: {
          color: '#3c3c3c',
        },
        formatter(params: any) {
          const filter = params.filter((item: any) => item?.seriesName !== '融资事件');
          const title = `<div style="margin-bottom: 6px; font-size: 12px; font-weight: 500;">${params?.[0]?.name}年</div>`;
          const totalNumber = filter?.reduce((prev: any, cur: any) => {
            return prev + cur.data;
          }, 0);
          const total = `<div style="margin-bottom: 6px; font-size: 12px; font-weight: 500;">融资总额: ${keepTwoDecimal(
            totalNumber,
          )}亿元</div>`;
          return title + total + filter?.map((data: any, index: number) => renderTooltip(data, index)).join('');
        },
      },
      title: [
        {
          text: '条',
          padding: [2, 0, 0, 2],
          left: 0,
          textStyle: {
            color: '#262626',
            fontSize: 12,
            fontWeight: 400,
          },
        },
        {
          text: '单位:亿元',
          padding: [2, 0, 0, 0],
          right: 0,
          textStyle: {
            color: '#262626',
            fontSize: 12,
            fontWeight: 400,
          },
        },
      ],
      legend: {
        bottom: 0,
        // icon: 'rect',
        itemWidth: 8,
        itemHeight: 8,
        itemGap: 8,
        padding: [4, 0, 0, 16],
        textStyle: {
          color: '#5c5c5c',
          fontSize: 12,
          padding: [2, 20, 0, 0],
        },
        data: [
          {
            name: '融资事件',
            itemStyle: {
              borderType: 'solid',
              borderWidth: 1,
            },
          },
          {
            name: 'A股IPO',
            icon: 'rect',
          },
          {
            name: 'A股再融资',
            icon: 'rect',
          },
          {
            name: '新三板定增',
            icon: 'rect',
          },
        ],
      },
      grid: {
        left: 0,
        right: 0,
        top: 30,
        bottom: 18,
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: dateArray,
          boundaryGap: true,
          axisLine: {
            lineStyle: {
              color: '#F6F6F6',
            },
          },
          axisLabel: {
            fontSize: 10,
            color: '#262626',
            fontWeight: 300,
          },
          axisTick: {
            show: false,
          },
        },
      ],
      yAxis: [
        {
          splitLine: {
            show: false,
            lineStyle: {
              type: 'dashed',
              color: '#dfdfdf',
            },
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            textStyle: {
              fontFamily: 'PingFangSC, PingFangSC-Light',
              color: '#262626',
              fontWeight: 300,
              fontSize: 10,
            },
            formatter: '{value}',
          },
          min: 0,
          max: max(financeCount),
        },
        {
          offset: 0,
          nameTextStyle: {
            // align: 'left',
            color: '#595959',
            fontSize: 12,
            padding: [0, 0, 0, 8],
          },
          type: 'value',
          axisLine: {
            show: false,
            lineStyle: {
              color: '#dfdfdf',
            },
          },
          axisTick: {
            show: false,
            color: '#b7b7b7',
          },
          axisLabel: {
            fontFamily: 'PingFangSC, PingFangSC-Light',
            color: '#262626',
            fontWeight: 300,
            fontSize: 10,
            align: 'left',
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: '#efefef',
              type: 'dashed',
            },
          },
          min: 0,
        },
      ],
      series: [
        {
          name: '融资事件',
          type: 'line',
          // 应该需要一张图
          symbol: symbol,
          symbolSize: 12,
          smooth: true,
          showSymbol: false,
          stack: 'issue',
          barWidth: 16,
          yAxisIndex: 0,
          lineStyle: {
            width: 1,
          },
          itemStyle: {
            normal: {
              color: '#FF6B00',
            },
          },
          data: financeCount,
        },
        {
          name: 'A股IPO',
          type: 'bar',
          stack: 'issue',
          barWidth: 16,
          yAxisIndex: 1,
          itemStyle: {
            normal: {
              color: '#0085FF',
              barBorderRadius: [0, 0, 2, 2],
            },
          },
          data: aShareIPO,
        },
        {
          name: 'A股再融资',
          type: 'bar',
          stack: 'issue',
          barWidth: 16,
          yAxisIndex: 1,
          itemStyle: {
            normal: {
              color: '#61A5FF',
              barBorderRadius: [0, 0, 0, 0],
            },
          },
          data: aShareRefinance,
        },
        {
          name: '新三板定增',
          type: 'bar',
          stack: 'issue',
          barWidth: 16,
          yAxisIndex: 1,
          itemStyle: {
            normal: {
              color: '#CCE6FF',
              barBorderRadius: [2, 2, 0, 0],
            },
          },
          data: newThreeIncrease,
        },
      ],
    };
  }, [dateArray, aShareIPO, aShareRefinance, newThreeIncrease, financeCount, renderTooltip]);
  return option;
};

export default useChartOption;
