import { FC, useEffect } from 'react';

import { useTab } from '@/libs/route';
import { useECharts } from '@/utils/hooks';

import { useOptioins, OptioinsProp } from './useOptions';

import styles from '@/pages/area/areaEconomy/modules/blackList/style.module.less';

// interface ChartContainerProps {
//   type: string;
//   data?: any;
// }

const ChartContainer: FC<OptioinsProp> = ({ type, chartDataInfo }) => {
  const option = useOptioins({ type, chartDataInfo });

  const [chartRef, chartInstance] = useECharts(option, 'canvas');

  useEffect(() => {
    if (chartInstance && option) {
      chartInstance.setOption(option);
      const chart = (chartInstance as any)._dom;
      if (chart?.offsetWidth !== chart.children[0]?.clientWidth) {
        chartInstance.resize();
      }
    }
  }, [chartInstance, option]);

  useTab({
    onActive() {
      if (chartInstance) {
        (chartInstance as any)?.resize();
      }
    },
  });

  return <div style={{ width: '100%', height: '100%' }} className={styles.chartContainerBorder} ref={chartRef}></div>;
};

export default ChartContainer;
