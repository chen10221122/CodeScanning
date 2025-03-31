import { FC, memo, useEffect, useMemo } from 'react';

import { useMemoizedFn } from 'ahooks';

import { useTab } from '@/libs/route';
import { formatThreeNumber } from '@/pages/area/areaF9/modules/regionalLand/utils';
import { useECharts } from '@/utils/hooks';
import { useLocation } from '@/utils/router';

type ChartData = {
  // x轴数据
  xAxisData: string[];
  yAxisData: any[];
  data: {
    data: string[];
    name: string;
    // 目前支持三种;line,bar以及堆叠bar，不传默认是堆叠bar
    type?: string;
    color?: string;
    itemStyle?: any;
    // 现在改为必传，每个页面宽度不一样，需要动态设置
    barWidth: number;
    // 是哪个y轴，0左边1右边，根据设计稿传，不传默认是0
    yAxisIndex?: number;
  }[];
  // 图例数据
  legendData: {
    name: string;
  }[];
  // 图例位置
  legendBottom: number;
  AllDataforTooltip?: {
    name: string;
    data: string[];
  };
  // x轴底部位置
  gridBottom?: number;
  // 滑动条底部位置
  // sliderBottom?: number;
  // 图例之间的间距
  itemGap?: number;
  selected?: Record<string, boolean>; // 添加 selected 属性
};

const ChartType: FC<{ chartData: ChartData }> = ({ chartData }) => {
  const { pathname } = useLocation();
  const { href } = window.location;
  /**
   * 渲染tooltip的函数
   * @param data 接收的数据
   * @param index 接收的索引, -1表示没有index
   * @returns string类型的html
   */
  const renderTooltip = useMemoizedFn((data: any, index?: number) => {
    // 提示框前面的带颜色小图标
    const marker = `<span style="display:inline-block;margin-right:6px;width: 6px;height:6px;background-color:${data?.color}; vertical-align: middle"></span>`;
    const circleMarker = `<span style="display:inline-block;margin-right:6px;width: 6px;height:6px;background-color:${data?.color}; vertical-align: middle; border-radius: 50%;"></span>`;
    const name = `<span>${
      data?.seriesName?.includes('同比') ? data?.seriesName + '(%)' : data?.seriesName || '-'
    }：</span>`;
    const content = `<span>${data?.value && !isNaN(+data?.value) ? formatThreeNumber(data?.value) : '-'}</span>`;
    // index -1 时将 增量 顶格展示，不需要占位
    return `<div style="margin-bottom: 2px;display: flex;align-items: center; font-size: 12px"><div>${
      (index !== -1 ? (data?.seriesType === 'bar' ? marker : circleMarker) : '') + name
    }</div><div>${content}</div></div>`;
  });

  const option = useMemo(() => {
    const defaultSelected = {};
    return {
      legend: {
        data: chartData?.legendData,
        padding: 0,
        orient: 'horizontal',
        itemGap: chartData?.itemGap,
        width: '90%',
        itemWidth: 8,
        itemHeight: 8,
        borderRadius: 0,
        alain: 'left',
        textStyle: {
          color: '#8C8C8C',
        },
        left: 'center',
        bottom: chartData?.legendBottom,
        selected: chartData?.selected ?? defaultSelected,
      },
      title: chartData?.yAxisData,
      tooltip: {
        trigger: 'axis',
        zIndex: 9999, // 防止tooltip被遮挡
        backgroundColor: 'rgba(255,255,255, .96)',
        extraCssText: 'box-shadow: 1px 1px 5px 0px rgba(0,0,0,0.20);border-radius: 2px;',
        textStyle: {
          color: '#3C3C3C',
          lineHeight: 17,
        },
        // 弹窗限制在chart图之内
        confine: true,
        padding: [8, 10, 3, 10],
        formatter(params: any) {
          const title = `<div style="margin-bottom: 0px; font-size: 12px; font-weight: 500;">${
            // params?.[0]?.name + '年:'
            params?.[0]?.name
              ? /^\d{4}$/.test(params?.[0]?.name)
                ? `${params?.[0]?.name}年`
                : /^\d{4}-\d{2}$/.test(params?.[0]?.name)
                ? `${params?.[0]?.name.replace('-', '年')}月`
                : params?.[0]?.name
              : '-'
          }</div>`;
          // 手动加上全部的tooltip
          const total = renderTooltip(
            {
              seriesName: chartData?.AllDataforTooltip?.name,
              value: chartData?.AllDataforTooltip?.data[params?.[0]?.dataIndex],
            },
            -1,
          );
          if (chartData?.AllDataforTooltip) {
            return title + total + params?.map((data: any, index: number) => renderTooltip(data, index)).join('');
          } else {
            return title + params?.map((data: any, index: number) => renderTooltip(data, index)).join('');
          }
        },
      },
      grid: {
        top: 25,
        right: 0,
        // bottom: 55,
        bottom: chartData?.gridBottom,
        left: 0,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: chartData?.xAxisData,
        axisLine: {
          lineStyle: {
            color: '#dfdfdf',
          },
        },
        // boundaryGap: true, // 柱状图从轴线开始
        axisTick: {
          show: false,
          alignWithLabel: true,
        },
        axisLabel: {
          color: '#494949',
          fontWeight: 400,
        },
      },
      yAxis: [
        {
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
            alignWithLabel: true,
          },
          axisLabel: {
            color: '#494949',
            fontWeight: 400,
            formatter(value: number) {
              // const unit = chartData?.yAxisData[0].text;
              // return unit === '宗' || unit === '宗数'
              //   ? formatThreeNumber(value.toFixed(0))
              //   : formatThreeNumber(value.toFixed(2));
              return formatThreeNumber(value.toFixed(0));
            },
          },
          splitLine: {
            lineStyle: {
              color: '#dfdfdf',
              type: 'dashed',
            },
          },
        },
        {
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
            alignWithLabel: true,
          },
          axisLabel: {
            color: '#494949',
            fontWeight: 400,
            formatter(value: number) {
              return formatThreeNumber(value.toFixed(0));
            },
          },
          splitLine: {
            show: false,
          },
        },
      ],
      series: chartData?.data?.map((info: any, idx: number) => {
        return info?.type === 'line'
          ? {
              type: 'line',
              name: info?.name,
              barWidth: 'auto', // 自动调整柱子的宽度
              barMaxWidth: chartData?.data[idx]?.barWidth,
              barMinWidth: 1,
              // barWidth: chartData?.data[idx]?.barWidth,
              // 对应哪个y轴
              yAxisIndex: chartData?.data[idx]?.yAxisIndex,
              data: info?.data,
              itemStyle: { ...chartData?.data[idx]?.itemStyle },
              color: chartData?.data[idx]?.color,
              connectNulls: true, // 是否连接空值
            }
          : info?.type === 'smoothLine'
          ? {
              type: 'line',
              // 平滑折线图
              smooth: true,
              name: info?.name,
              barWidth: 'auto', // 自动调整柱子的宽度
              barMaxWidth: chartData?.data[idx]?.barWidth,
              barMinWidth: 1,
              // 对应哪个y轴
              yAxisIndex: chartData?.data[idx]?.yAxisIndex,
              data: info?.data,
              // itemStyle用于隐藏全部那一条数据的折线
              itemStyle: { ...chartData?.data[idx]?.itemStyle },
              color: chartData?.data[idx]?.color,
              connectNulls: true,
            }
          : info?.type === 'bar'
          ? {
              type: 'bar',
              name: info?.name,
              data: info?.data,
              itemStyle: { ...chartData?.data[idx]?.itemStyle },
              barWidth: 'auto', // 自动调整柱子的宽度
              barMaxWidth: chartData?.data[idx]?.barWidth,
              barMinWidth: 1,
              color: chartData?.data[idx]?.color,
            }
          : {
              // 堆叠图
              type: 'bar',
              name: info?.name,
              data: info?.data,
              itemStyle: { ...chartData?.data[idx]?.itemStyle },
              barWidth: 'auto', //自动调整柱子的宽度
              barMaxWidth: chartData?.data[idx]?.barWidth,
              barMinWidth: 1,
              //是否堆叠与堆叠颜色
              stack: 'year',
              color: chartData?.data[idx]?.color,
            };
      }),
    };
  }, [renderTooltip, chartData]);

  const [chartRef, chartInstance] = useECharts(option as any, 'canvas', href, false);

  useEffect(() => {
    if (chartInstance) {
      (chartInstance as any)?.setOption(option, true);
      const chart = (chartInstance as any)._dom;

      if (chart?.offsetWidth < chart.children[0]?.clientWidth) {
        chartInstance.resize();
      }
    }
  }, [option, chartInstance, pathname]); // 监听条件

  // 监听拖动左侧目录树导致的图表变化
  useEffect(() => {
    const contentViewDom = document.querySelector('.main-content') as HTMLElement;
    const resizeOb = new ResizeObserver((entries) => {
      requestAnimationFrame(() => {
        if (chartInstance) {
          (chartInstance as any)?.resize();
        }
      });
    });
    resizeOb.observe(contentViewDom);

    return () => {
      resizeOb.disconnect();
    };
  }, [chartInstance]);

  useTab({
    onActive() {
      if (chartInstance) {
        (chartInstance as any)?.resize();
      }
    },
  });

  return <div style={{ width: '100%', height: '100%' }} ref={chartRef}></div>;
};

export default memo(ChartType);
