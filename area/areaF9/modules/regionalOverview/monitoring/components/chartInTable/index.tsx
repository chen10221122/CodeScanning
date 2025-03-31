import { FC, memo, useEffect } from 'react';

import { Icon } from '@dzh/components';
import { useMemoizedFn, useSize, useUpdateEffect } from 'ahooks';
import styled from 'styled-components';

import { useTab } from '@/libs/route';
import { useDispatch } from '@/pages/area/areaF9/modules/regionalOverview/monitoring/context';
import { EchartsOption, useECharts } from '@/utils/hooks';

const emptyData = [{ trendIndex: 1 }, { trendIndex: 1 }];

export const option = (data: Array<any> = []) => {
  const resultData = data.length ? data : emptyData;
  return {
    grid: {
      top: 0,
      bottom: 2,
      left: 0,
      right: 0,
    },
    tooltip: {
      show: false,
    },
    color: 'rgba(1,113,246, 0.6)',
    xAxis: {
      type: 'category',
      show: false,
      boundaryGap: false,
      data: resultData.map((o, i) => i),
    },
    yAxis: {
      type: 'value',
      show: false,
    },
    series: [
      {
        data: resultData.map((item) => item.trendIndex),
        type: 'line',
        symbol: 'none',
        areaStyle: {
          opacity: 0.5,
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(1,113,246, 0.5)', // 0% 处的颜色
              },
              {
                offset: 1,
                color: 'rgba(1,113,246,0)', // 100% 处的颜色
              },
            ],
          },
        },
        lineStyle: {
          width: 1, //设置线条粗细
        },
      },
    ],
  } as EchartsOption;
};

interface Props {
  data: Record<string, any>[];
  row: Record<string, any>;
}

const { href } = window.location;

const ChartInTable: FC<Props> = ({ data, row }) => {
  const dispatch = useDispatch();
  const [chartRef, chartInstance] = useECharts(option(data), 'canvas', href);
  const chartWidth = useSize((chartInstance as any)?._dom) || {};

  // 进入趋势弹窗
  const hanldeToTrendModal = useMemoizedFn(() => {
    dispatch((d) => {
      d.modalStatus.trendModal.visible = true;
      d.modalStatus.trendModal.data = row;
    });
  });

  useEffect(() => {
    if (chartInstance) {
      (chartInstance as any).setOption(option(data));
      const chart = (chartInstance as any)._dom as HTMLDivElement;
      if (chart?.offsetWidth < chart.children[0]?.clientWidth) {
        (chartInstance as any).resize();
      }
    }
  }, [data, chartInstance]);

  // 表格列支持拖拽
  useUpdateEffect(() => {
    if (chartWidth) {
      const chart = (chartInstance as any)._dom as HTMLDivElement;
      if (chartWidth !== chart.children[0]?.clientWidth) {
        (chartInstance as any).resize();
      }
    }
  }, [chartWidth, chartInstance]);

  useTab({
    onActive() {
      if (chartInstance) {
        (chartInstance as any).resize();
      }
    },
  });

  return (
    <TableChartInner onClick={hanldeToTrendModal}>
      <div style={{ width: '100%', height: '100%' }} ref={chartRef}></div>
      <Icon image={require('@/assets/images/common/scale.svg')} size={14} className="scale-icon" />
    </TableChartInner>
  );
  // return <div style={{ width: '100%', height: '38px' }} ref={chartRef} onClick={hanldeToTrendModal}></div>;
};

export default memo(ChartInTable);

const TableChartInner = styled.div`
  width: 100%;
  height: 49px;
  position: relative;
  cursor: pointer;
  padding: 3px 4px 0;
  .scale-icon {
    position: absolute;
    bottom: 0;
    right: 0;
  }
`;
