import { symbol } from '@/pages/area/areaFinancingBoard/config';
import { formatNumber } from '@/utils/format';

export const lineBarOption = {
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    extraCssText: 'box-shadow: 2px 2px 10px 0 rgba(0,0,0,0.20); padding: 6px 12px;border-radius: 3px;z-index:2',
    textStyle: {
      color: '#262626',
    },
    formatter: function (p: any) {
      const str = p.reduce((pre: string, item: { seriesName: string; value: number }) => {
        const value =
          item?.seriesName === '总偿还额(亿元)'
            ? formatNumber(Math.abs(item?.value)) || '-'
            : formatNumber(item?.value) || '-';
        return pre + '<br/>' + item?.seriesName + '：' + value;
      }, '');
      return `${p[0].axisValue}` + str;
    },
  },
  legend: {
    bottom: 0,
    itemWidth: 8,
    itemHeight: 8,
    itemGap: 20,
    padding: 0,
    data: [
      { name: '净融资额(亿元)', icon: 'circle' },
      { name: '总发行额(亿元)', icon: 'rect' },
      { name: '总偿还额(亿元)', icon: 'rect' },
    ],
    textStyle: {
      color: '#3C3C3C',
      fontSize: 12,
      fontWeight: 300,
      lineHeight: 17,
    },
  },
  grid: {
    left: 0,
    right: 10,
    top: 12,
    bottom: 25,
    containLabel: true,
  },
  xAxis: [
    {
      type: 'category',
      data: [],
      boundaryGap: true,
      axisLine: {
        onZero: false,
        lineStyle: {
          color: '#F6F6F6',
        },
      },
      axisLabel: {
        color: '#262626',
        fontWeight: 300,
        fontSize: 10,
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
          color: '#262626',
          fontWeight: 300,
          fontSize: 10,
        },
        formatter: '{value}',
      },
    },
  ],
  series: [
    {
      name: '净融资额(亿元)',
      type: 'line',
      smooth: true,
      symbol: symbol,
      symbolSize: 12,
      showSymbol: false,
      yAxisIndex: 0,
      lineStyle: {
        width: 1,
      },
      itemStyle: {
        normal: {
          color: '#FF6B00',
        },
      },
      data: [],
    },
    {
      name: '总发行额(亿元)',
      type: 'bar',
      stack: 'issue',
      barWidth: 16,
      yAxisIndex: 0,
      itemStyle: {
        normal: {
          color: '#0085FF',
          barBorderRadius: [2, 2, 0, 0],
        },
      },
      data: [],
    },
    {
      name: '总偿还额(亿元)',
      type: 'bar',
      stack: 'issue',
      barWidth: 16,
      yAxisIndex: 0,
      itemStyle: {
        normal: {
          color: '#56DFFF',
          barBorderRadius: [0, 0, 2, 2],
        },
      },
      data: [],
    },
  ],
};
