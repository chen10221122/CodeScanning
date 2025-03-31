import { useMemo } from 'react';

import { symbol } from '@/pages/area/areaFinancingBoard/config';
const useChartOption = (dateArray: any[], eventArray: any[], amountArray: any[]) => {
  const option = useMemo(() => {
    return {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        extraCssText: 'box-shadow: 2px 2px 10px 0 rgba(0,0,0,0.20); padding: 6px 12px;border-radius: 3px;z-index:2',
        textStyle: {
          color: '#3c3c3c',
        },
      },
      legend: {
        bottom: 0,
        itemWidth: 8,
        itemHeight: 8,
        itemGap: 16,
        padding: 0,
        textStyle: {
          color: '#5D6573',
          fontSize: 12,
          padding: [2, 20, 0, 0],
        },
        data: [
          {
            name: '融资额',
            itemStyle: {
              borderType: 'solid',
              borderWidth: 1,
            },
          },
          {
            name: 'PEVC事件数',
            icon: 'rect',
          },
        ],
      },
      title: [
        {
          text: '单位：亿元',
          padding: [9, 0, 0, 0],
          left: 0,
          textStyle: {
            color: '#434343',
            fontSize: 12,
            fontWeight: 400,
          },
        },
        {
          text: '件',
          padding: [9, 0, 0, 0],
          right: 0,
          textStyle: {
            color: '#434343',
            fontSize: 12,
            fontWeight: 400,
          },
        },
      ],
      grid: {
        left: 0,
        right: 0,
        top: 35,
        bottom: 20,
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
            fontFamily: 'PingFangSC, PingFangSC-Light',
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
              color: '#EFEFEF',
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
              fontSize: 10,
              color: '#262626',
              fontWeight: 300,
            },
            formatter: '{value}',
          },
        },
        {
          splitLine: {
            show: false,
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
              fontSize: 10,
              color: '#262626',
              fontWeight: 300,
            },
            formatter: '{value}',
          },
        },
      ],
      series: [
        {
          name: 'PEVC事件数',
          type: 'bar',
          barWidth: 16,
          yAxisIndex: 1,
          itemStyle: {
            normal: {
              color: '#0085FF',
              barBorderRadius: [2, 2, 2, 2],
            },
          },
          data: eventArray,
        },
        {
          name: '融资额',
          type: 'line',
          smooth: true,
          symbol: symbol,
          showSymbol: false,
          symbolSize: 12,
          yAxisIndex: 0,
          lineStyle: {
            width: 1,
          },
          itemStyle: {
            normal: {
              color: '#FF6B00',
            },
          },
          data: amountArray,
        },
      ],
    };
  }, [dateArray, eventArray, amountArray]);
  return option;
};

export default useChartOption;
