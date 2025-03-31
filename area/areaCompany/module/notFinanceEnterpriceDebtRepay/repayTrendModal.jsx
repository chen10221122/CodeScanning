import { memo, useEffect, useMemo } from 'react';

import styled from 'styled-components';

import { Modal, Empty } from '@/components/antd';
import { useECharts } from '@/utils/hooks';

const RepayTrendModal = ({ datas, visible, setFalse }) => {
  const { href } = window.location;
  const { companyName, chartData } = useMemo(
    () => ({
      companyName: datas?.name,
      chartData: datas?.valueList?.filter((d) => d.name.length !== 10),
    }),
    [datas],
  );

  const option = useMemo(
    () => ({
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        extraCssText: 'box-shadow: 2px 2px 10px 0 rgba(0,0,0,0.20); padding: 6px 12px;border-radius: 3px;z-index:2',
        textStyle: {
          color: '#3c3c3c',
          fontSize: 12,
          fontWeight: 400,
        },
      },
      title: {
        text: '偿还金额(亿元)',
        padding: [0],
        textStyle: {
          color: '#434343',
          fontSize: 12,
          fontWeight: 400,
          lineHeight: 20,
        },
      },
      legend: {
        bottom: 0,
        icon: 'circle',
        itemWidth: 8,
        itemHeight: 8,
        itemGap: 20,
        data: ['偿还金额(亿元)'],
        textStyle: {
          color: '#434343',
          fontSize: 12,
        },
      },
      grid: {
        top: 36,
        left: 0,
        right: 0,
        bottom: 32,
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: chartData?.map((o) => o.name),
          boundaryGap: true,
          axisLine: {
            lineStyle: {
              color: '#dfdfdf',
            },
          },
          axisLabel: {
            interval: 0,
            color: '#8c8c8c',
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
            lineStyle: {
              color: '#dfdfdf',
            },
          },
          axisTick: {
            show: true,
          },
          axisLabel: {
            textStyle: {
              color: '#434343',
              fontSize: 12,
            },
            formatter: '{value}',
          },
        },
      ],
      series: [
        {
          name: '偿还金额(亿元)',
          type: 'bar',
          stack: 'issue',
          barWidth: 16,
          yAxisIndex: 0,
          itemStyle: {
            normal: {
              color: '#3986fe',
              //柱状图圆角
              barBorderRadius: [2, 2, 0, 0],
            },
          },
          data: chartData?.map((o) => o.amount || '-'),
        },
      ],
    }),
    [chartData],
  );
  const [chartRef, chartInstance] = useECharts(option, 'svg', href, false);

  useEffect(() => {
    if (chartInstance) {
      chartInstance.setOption(option);
      const chart = chartInstance._dom;
      if (chart?.offsetWidth < chart.children[0]?.clientWidth) {
        chartInstance.resize();
      }
    }
  }, [option, chartInstance]);

  return (
    <EchartsModal
      visible={visible}
      type="titleWidthBgAndMaskScroll"
      width={860}
      title={companyName + '偿还金额'}
      footer={null}
      contentId=""
      container={document.getElementById('area-company-index-container')}
      onCancel={() => {
        setFalse();
      }}
    >
      {chartData?.length ? <div className="chart" ref={chartRef}></div> : <Empty type={Empty.NO_DATA_NEW_IMG} />}
    </EchartsModal>
  );
};

export default memo(RepayTrendModal);

const EchartsModal = styled(Modal)`
  .ant-modal-body {
    height: 336px;
    padding: 20px;
    .chart {
      width: 100%;
      height: 296px;
    }
    .ant-empty {
      margin-top: 32px;
    }
  }
`;
