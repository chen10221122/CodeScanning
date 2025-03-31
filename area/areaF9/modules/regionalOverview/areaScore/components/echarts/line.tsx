import { memo, useMemo, useEffect, useRef } from 'react';

import { useSize } from 'ahooks';
import { EChartOption } from 'echarts';

// import { yearArr } from '@/pages/area/areaF9/modules/regionalOverview/areaScore/const';
import { useECharts } from '@/utils/hooks';

const LineChart = (props: any) => {
  let { historyData, regionName } = props;
  const sizeWidth = useRef(0);
  // console.log('historyData, regionName', historyData, regionName, yearArr);

  const option = useMemo(() => {
    let xData: any = [];
    let localScores: any[] = [];
    let provinceScores: any[] = [];
    let countryScores: any[] = [];

    if (!historyData || !historyData.data) {
      xData = [];
    } else {
      historyData.data.forEach((item: any) => {
        xData.push(item.year);
        localScores.push({
          value: +item.selfScore,
          tenGradeValue: item.tenGradeSelfScore,
        });
        provinceScores.push({
          value: +item.provinceAvgScore,
          tenGradeValue: item.tenGradeProvinceAvgScore,
        });
        countryScores.push({
          value: +item.nationalAvgScore,
          tenGradeValue: item.tenGradeNationalAvgScore,
        });
      });
    }
    let seriesData = [
      {
        name: `${regionName}`,
        type: 'line',
        // stack: 'Score',
        data: localScores,
      },
      {
        name: '全省均值',
        type: 'line',
        // stack: 'Score',
        data: provinceScores,
      },
      {
        name: '全国均值',
        type: 'line',
        // stack: 'Score',
        data: countryScores,
      },
    ];

    return {
      color: ['#3986FE', '#F9D237', '#F57F50'],
      tooltip: {
        trigger: 'axis',
        confine: true,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        // formatter: (params: any) => {
        //   // console.log('params', params);
        //   let arr = params.reduce((res: string, o: any, i: number) => {
        //     res += `<div>
        //       ${o.marker}
        //       <span style="">${o.seriesName}</span>
        //       <span style="">${o.data.tenGradeValue}</span>
        //     </div>`;
        //     return res;
        //   }, '');
        //   return `
        //     <div>${params[0].axisValue}<div>
        //     ${arr}
        //   `;
        // },
      },
      legend: {
        itemWidth: 8,
        itemHeight: 8,
        icon: 'circle',
        bottom: 4,
        textStyle: {
          color: '#8C8C8C',
          fontSize: 11,
        },
        data: [`${regionName}`, '全省均值', '全国均值'],
      },
      grid: {
        top: 35,
        left: 26,
        right: 16,
        bottom: 50,
        // containLabel: true,
      },
      xAxis: {
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          color: '#8C8C8C',
          fontSize: 11,
          fontWeight: 300,
          fontFamily: 'PingFangSC, PingFangSC-Light',
        },
        axisLine: {
          lineStyle: {
            color: '#DFDFDF',
          },
        },
        type: 'category',
        boundaryGap: false,
        data: xData,
      },
      yAxis: {
        type: 'value',
        splitNumber: 3,
        name: '历史评分',
        scale: true,
        nameTextStyle: {
          // 设置名称的文本样式
          color: '#262626', // 文本颜色
          fontWeight: 400, // 字体粗细
          fontSize: 13, // 字体大小
          fontFamily: 'PingFangSC, PingFangSC-Regular',
          lineHeight: 18,
          padding: [0, 0, 0, 6],
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          color: '#8C8C8C',
          fontSize: 11,
          fontWeight: 300,
          fontFamily: 'PingFangSC, PingFangSC-Light',
        },
        // axisLine: {
        //   onZero: false,
        // },
      },
      series: seriesData,
    } as EChartOption;
  }, [historyData, regionName]);

  const [lineRef, chartInstance] = useECharts(option, 'canvas');
  const size = useSize(document.getElementById('linechart'));

  useEffect(() => {
    if (chartInstance) {
      chartInstance.setOption(option);
      if (size?.width && sizeWidth.current !== size?.width) {
        sizeWidth.current = size?.width;
        chartInstance.resize();
      }
    }
  }, [chartInstance, option, size?.width]);

  return <div className="linechart" ref={lineRef} id="linechart"></div>;
};

export default memo(LineChart);
