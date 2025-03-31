import { memo, useMemo, useEffect, useRef } from 'react';

import { useSize } from 'ahooks';
import { EChartOption } from 'echarts';

import { indiMap } from '@/pages/area/areaF9/modules/regionalOverview/areaScore/const';
// import { MAXSCORE } from '@/pages/area/areaF9/types';
import { useECharts } from '@/utils/hooks';

interface Props {
  indicatorScore: any;
  avgIndicatorScore: any;
  regionName?: string;
  regionRange?: any;
}

const lcoalName = '本区域';
// const avgSimple = '平均值';

const RadarChart = (props: Props) => {
  const { indicatorScore, avgIndicatorScore, regionName, regionRange } = props;
  const sizeWidth = useRef(0);

  const localAreaName = useMemo(() => {
    let tempName = regionName || lcoalName;
    return tempName.length > 5 ? tempName.slice(0, 5) + '...' : tempName;
  }, [regionName]);

  const avgName = useMemo(() => {
    return regionRange === '0' ? '全国均值' : '全省均值';
  }, [regionRange]);

  const [indiData]: any[] = useMemo(() => {
    let tempData = [];
    // let tenGradeIndi: any = [];
    if (!indicatorScore) {
      tempData = Array(8).fill(0);
    } else {
      indiMap.forEach((_, i) => {
        tempData.push(+indicatorScore[indiMap[i].indi]);
        // tenGradeIndi.push(indicatorScore[indiMap[i].tenIndi]);
      });
    }
    return [tempData];
  }, [indicatorScore]);

  const [avgData]: any[] = useMemo(() => {
    let tempData = [];
    // let tenGradeAvg: any = [];
    if (!avgIndicatorScore) {
      tempData = Array(8).fill(0);
    } else {
      indiMap.forEach((_, i) => {
        tempData.push(+avgIndicatorScore[indiMap[i].avg]);
        // tenGradeAvg.push(avgIndicatorScore[indiMap[i].tenAvg]);
      });
    }
    return [tempData];
  }, [avgIndicatorScore]);

  // console.log('localAreaName', localAreaName, localAreaName.length);

  const option = useMemo(() => {
    return {
      color: ['#FF5C5C', '#35EBFF'],
      tooltip: {
        trigger: 'item',
        confine: true,
        // textStyle: {
        //   color: 'rgba(255, 255, 255, 1)',
        // },
        borderColor: 'transparent',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        formatter: function (params: any) {
          let dom = '';
          // console.log('params', params, indiData, avgData);
          if (params.data?.value?.length) {
            dom += indiMap.reduce((res, o, i) => {
              let item = `<div style="${i !== indiMap.length - 1 ? 'margin-bottom:8px;' : ''}">
                <div style="font-size: 12px;font-family: PingFangSC, PingFangSC-Medium;font-weight: 500;
                color: #262626;line-height: 18px;margin-bottom:2px;">${o.text}</div>
                <div style="display:flex;font-size: 12px;font-family: PingFangSC, PingFangSC-Regular;font-weight: 400;
                color: #434343;line-height: 18px;">
                  <div style="display:flex;align-items: center;width:76px;">
                    <div style="width: 7px;height: 7px;background: rgba(59,135,255,0.10);border: 1px solid #3B87FF;
                    border-radius: 5px;margin-right:3px;"></div>
                    <div>${lcoalName}:${indiData[i]}</div>
                  </div>
                  <div style="display:flex;align-items: center;margin-left:12px;">
                    <div style="width: 7px;
                      height: 7px;margin-right:3px;
                      background: rgba(255,92,92,0.08);
                      border: 1px solid #FF5C5C;
                      border-radius: 5px;"></div>
                    <div>${avgName}:${avgData[i]}</div>
                  </div>
                </div>
              </div>`;
              res += item;
              return res;
            }, '');
          }
          return dom;
        },
      },
      // grid: {
      //   containLabel: true,
      // },
      legend: {
        top: '40%',
        right: 0,
        // bottom: 10,
        orient: 'vertical',
        itemWidth: 9,
        itemHeight: 9,
        textStyle: {
          fontSize: 11,
        },
        data: [
          {
            name: localAreaName,
            icon: 'image://https://cdn.finchina.com/app/PC-Web/frontPageIcon/ic_blue.png',
            tooltip: {
              show: true,
              trigger: 'item',
              padding: 8,
              formatter: () => {
                return `<div style="font-size:12px;">${regionName || lcoalName}</div>`;
              },
            },
          },
          {
            name: avgName,
            icon: 'image://https://cdn.finchina.com/app/PC-Web/frontPageIcon/ic_red.png',
          },
        ],
      },
      radar: [
        {
          splitArea: {
            areaStyle: {
              color: ['#fff'],
            },
          },
          axisLine: {
            lineStyle: {
              color: '#eee',
            },
          },
          axisName: {
            color: '#8c8c8c',
            fontSize: 10,
            fontFamily: 'PingFangSC, PingFangSC-Light',
            fontWeight: 300,
          },
          splitNumber: 4,
          nameGap: 4,
          indicator: indiMap,
          radius: 55,
          center: ['40%', '50%'],
        },
      ],
      series: [
        {
          type: 'radar',
          // radarIndex: 1,
          areaStyle: {},
          symbol: 'none',
          lineStyle: {
            width: 1,
          },
          data: [
            {
              value: indiData,
              name: localAreaName,
              itemStyle: { color: 'rgba(59,135,255,0.8)' },
              areaStyle: { opacity: 0.15, color: '#3B87FF' },
            },
            {
              value: avgData,
              name: avgName,
              itemStyle: { color: 'rgba(255,92,92,0.4)' },
              areaStyle: { opacity: 0.05, color: '#FF5C5C' },
            },
          ],
        },
      ],
    } as EChartOption;
  }, [avgData, avgName, indiData, localAreaName, regionName]);

  const [radarRef, chartInstance] = useECharts(option, 'canvas');
  const size = useSize(document.getElementById('radarchart'));

  useEffect(() => {
    if (chartInstance) {
      chartInstance.setOption(option);
      if (size?.width && sizeWidth.current !== size?.width) {
        sizeWidth.current = size?.width;
        chartInstance.resize();
      }
    }
  }, [chartInstance, option, size?.width]);

  return <div className="radar" ref={radarRef} id="radarchart"></div>;
};

export default memo(RadarChart);
