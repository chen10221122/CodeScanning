export const BarOption = {
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
    icon: 'rect',
    itemWidth: 8,
    itemHeight: 8,
    itemGap: 20,
    padding: 0,
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
      name: '到期(亿元)',
      type: 'bar',
      stack: 'issue',
      barWidth: 16,
      yAxisIndex: 0,
      itemStyle: {
        normal: {
          color: '#0085ff',
          barBorderRadius: [2, 2, 2, 2],
        },
      },
      data: [],
    },
    {
      name: '回售(亿元)',
      type: 'bar',
      stack: 'issue',
      barWidth: 16,
      yAxisIndex: 0,
      itemStyle: {
        normal: {
          color: '#61A5FF',
          barBorderRadius: [2, 2, 2, 2],
        },
      },
      data: [],
    },
    {
      name: '其他(亿元)',
      type: 'bar',
      stack: 'issue',
      barWidth: 16,
      yAxisIndex: 0,
      itemStyle: {
        normal: {
          color: '#CCE6FF',
          barBorderRadius: [2, 2, 2, 2],
        },
      },
      data: [],
    },
  ],
};
