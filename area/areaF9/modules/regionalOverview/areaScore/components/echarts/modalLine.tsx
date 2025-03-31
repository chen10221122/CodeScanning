import { memo, useMemo, useEffect, useRef } from 'react';

import { useSize } from 'ahooks';
import { EChartOption } from 'echarts';

// import { yearArr } from '@/pages/area/areaF9/modules/regionalOverview/areaScore/const';
import { useECharts } from '@/utils/hooks';

const ModalLine = (props: any) => {
  const { calcData, indicatorName, unit } = props;
  const sizeWidth = useRef(0);
  // console.log('historyData, regionName', historyData, regionName, yearArr);

  const option = useMemo(() => {
    let { xData, score, values } = calcData;

    xData = xData.reverse();
    score = score.reverse();
    values = values.reverse();

    return {
      tooltip: {
        trigger: 'axis',
        confine: true,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
      },
      color: ['#3986FE'],
      legend: {
        // data: [ 'Precipitation', 'Temperature'],
        itemWidth: 8,
        itemHeight: 8,
        data: [
          {
            name: indicatorName,
            icon: 'roundRect',
          },
          {
            name: '评分',
            icon: 'circle',
          },
        ],
        bottom: 0,
      },
      grid: {
        top: 35,
        left: 26,
        right: 26,
        bottom: 36,
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: xData,
          axisLabel: {
            color: '#8C8C8C',
            fontSize: 12,
            fontWeight: 300,
            fontFamily: 'PingFangSC, PingFangSC-Light',
          },
          axisLine: {
            lineStyle: {
              color: '#DFDFDF',
            },
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: unit,
          nameTextStyle: {
            color: '#8C8C8C',
            fontSize: 12,
            fontWeight: 300,
            fontFamily: 'PingFangSC, PingFangSC-Light',
            lineHeight: 18,
            // padding: [0, 0, 0, -14],
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#EFEFEF',
            },
          },
          axisLabel: {
            color: '#8C8C8C',
            fontSize: 12,
            fontWeight: 300,
            fontFamily: 'PingFangSC, PingFangSC-Light',
          },
        },
        {
          type: 'value',
          name: '评分',
          splitLine: {
            show: false,
          },
          nameTextStyle: {
            color: '#8C8C8C',
            fontSize: 12,
            fontWeight: 300,
            fontFamily: 'PingFangSC, PingFangSC-Light',
            lineHeight: 18,
            padding: [0, 0, 0, 8],
          },
          axisLabel: {
            color: '#8C8C8C',
            fontSize: 12,
            fontWeight: 300,
            fontFamily: 'PingFangSC, PingFangSC-Light',
          },
        },
      ],
      series: [
        {
          name: indicatorName,
          type: 'bar',
          barWidth: 16,
          itemStyle: {
            borderRadius: [4, 4, 0, 0], // 分别设置柱子左上、右上、右下、左下的圆角
          },
          data: values,
        },
        {
          name: '评分',
          type: 'line',
          yAxisIndex: 1,
          lineStyle: {
            color: '#FF6B00',
          },
          symbol: 'none',
          itemStyle: {
            color: '#FF6B00',
          },
          // tooltip: {
          //   valueFormatter: function (value) {
          //     return value + ' °C';
          //   }
          // },
          data: score,
        },
      ],
    } as EChartOption;
  }, [calcData, indicatorName, unit]);

  const [lineRef, chartInstance] = useECharts(option, 'canvas');
  const size = useSize(document.getElementById('innerechart'));
  useEffect(() => {
    if (chartInstance) {
      chartInstance.setOption(option);
      if (size?.width && sizeWidth.current !== size?.width) {
        sizeWidth.current = size?.width;
        chartInstance.resize();
      }
    }
  }, [chartInstance, option, size?.width]);

  return <div className="inner-echart" ref={lineRef} id="innerechart"></div>;
};

export default memo(ModalLine);
