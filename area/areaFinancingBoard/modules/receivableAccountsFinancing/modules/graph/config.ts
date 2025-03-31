import { symbol } from '@/pages/area/areaFinancingBoard/config';
import { titleStyle, legendStyle, axisStyle } from '@/pages/area/areaFinancingBoard/style';

export const lineBarOption = {
  title: [
    {
      text: '单位：万元',
      padding: [5, 0, 0, 0],
      left: 0,
      textStyle: titleStyle,
    },
    {
      text: '单位：个',
      padding: [5, 0, 0, 0],
      right: 0,
      textStyle: titleStyle,
    },
  ],
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
    icon: 'circle',
    itemWidth: 8,
    itemHeight: 8,
    itemGap: 20,
    padding: 0,
    data: [
      { name: '应收账款融资事件', icon: 'rect' },
      { name: '融资额', icon: 'circle' },
    ],
    textStyle: legendStyle,
  },
  grid: {
    left: 0,
    right: 0,
    top: 30,
    bottom: 25,
    containLabel: true,
  },
  xAxis: [
    {
      type: 'category',
      data: [],
      boundaryGap: true,
      axisLine: {
        lineStyle: {
          color: '#F6F6F6',
        },
      },
      axisLabel: {
        ...axisStyle,
        interval: 'auto',
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
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        textStyle: axisStyle,
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
        textStyle: axisStyle,
        formatter: '{value}',
      },
    },
  ],
  series: [
    {
      name: '应收账款融资事件',
      type: 'bar',
      barWidth: 16,
      yAxisIndex: 1,
      itemStyle: {
        normal: {
          color: '#0085FF',
          barBorderRadius: [2, 2, 0, 0],
        },
      },
      data: [],
    },
    {
      name: '融资额',
      type: 'line',
      lineStyle: {
        width: 1,
      },
      smooth: true,
      symbol: symbol,
      symbolSize: 12,
      showSymbol: false,
      yAxisIndex: 0,
      itemStyle: {
        normal: {
          color: '#FF6B00',
        },
      },
      data: [],
    },
  ],
};
