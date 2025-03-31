import { memo, useEffect, useMemo, useRef } from 'react';

import { useSize } from 'ahooks';
import { EChartOption } from 'echarts';

import { useECharts } from '@/utils/hooks';

const BarChart = (props: any) => {
  const { scoreDistributeList, position } = props;
  const sizeWidth = useRef(0);
  // console.log('scoreDistributeList', scoreDistributeList, position, complexScore);

  let sData = useMemo(() => {
    if (Array.isArray(scoreDistributeList)) {
      let returnArr = scoreDistributeList.map((d: any, index) => {
        return {
          value: +d.count,
          itemStyle: {
            color: d.position ? '#73E6BF' : '#0085FF',
          },
        };
      });
      return returnArr;
    }
    return Array(scoreDistributeList?.length || 10).fill(0);
  }, [scoreDistributeList]);

  let xData = useMemo(() => {
    if (Array.isArray(scoreDistributeList)) {
      let returnXData = scoreDistributeList.map((item: any) => {
        return item.interval;
      });
      return returnXData;
    }
    return Array(scoreDistributeList?.length || 10).fill(0);
  }, [scoreDistributeList]);

  const tooltipInfo = useMemo(() => {
    return {
      trigger: 'axis',
      extraCssText:
        'border-radius: 4px;font-size: 12px;font-family: PingFangSC, PingFangSC-Regular;font-weight: 400;color: #121922;padding:6px 8px;background: linear-gradient(105deg,#ffffff 6%, #eef7ff 100%);border: 1px solid #ebf4ff;border-radius: 4px;',
      formatter: (params: any) => {
        // console.log('params', params);
        let str = '';
        let weight = 500;
        if (params[0].color === '#0085FF') {
          str = `<div style="">
            <span>评分档位: </span><span style="font-weight: ${weight};">${params[0].axisValue}</span></br>
            <span>地区数量: </span><span style="font-weight: ${weight};">${params[0].data.value}</span>
          </div>`;
        } else {
          str = `<div style="">
            <span>评分档位: </span><span style="font-weight: ${weight};">${params[0].axisValue}</span></br>
            <span>地区数量: </span><span style="font-weight: ${weight};">${params[0].data.value}</span></br>
            <span>评分位置: </span><span style="font-weight: ${weight};">${position}</span>
          </div>`;
        }
        return str;
      },
    } as EChartOption.Tooltip;
  }, [position]);
  const option = useMemo(() => {
    return {
      tooltip: tooltipInfo,
      color: ['#0085FF'],
      grid: {
        top: 35,
        left: 48,
        right: 10,
        bottom: 32,
        // containLabel: true,
      },
      xAxis: {
        type: 'category' as 'category',
        data: xData,
        axisLine: {
          lineStyle: {
            color: '#F6F6F6',
          },
        },
        axisLabel: {
          color: '#8c8c8c',
          fontSize: 10,
          fontWeight: 400,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
      },
      yAxis: {
        type: 'value' as 'value',
        name: '区域数量',
        splitLine: {
          show: false,
        },
        axisLabel: {
          color: '#8c8c8c',
          fontSize: 10,
          fontWeight: 400,
        },
        nameTextStyle: {
          // 设置名称的文本样式
          color: '#8c8c8c', // 文本颜色
          fontWeight: 400, // 字体粗细
          fontSize: 11, // 字体大小
          fontFamily: 'PingFangSC, PingFangSC-Light',
          lineHeight: 15,
          padding: [0, 0, 0, -20], // 调整名称与轴线之间的距离，这里的数组代表[上,右,下,左]的距离
        },
      },
      series: [
        {
          data: sData,
          type: 'bar',
          barWidth: 7,
          itemStyle: {
            borderRadius: [4, 4, 4, 4], // 分别设置柱子左上、右上、右下、左下的圆角
          },
        },
      ],
    } as EChartOption;
  }, [sData, tooltipInfo, xData]);
  // const [barRef, chartInstance] = useECharts(option, 'canvas');
  const [barRef, chartInstance] = useECharts(option, 'canvas');
  const size = useSize(document.getElementById('barline'));

  useEffect(() => {
    if (chartInstance) {
      chartInstance.setOption(option);
      if (size?.width && sizeWidth.current !== size?.width) {
        sizeWidth.current = size?.width;
        chartInstance.resize();
      }
    }
  }, [chartInstance, option, size?.width]);

  return <div className="barline" ref={barRef} id="barline"></div>;
};

export default memo(BarChart);
