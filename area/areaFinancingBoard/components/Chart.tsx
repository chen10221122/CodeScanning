import { memo, useEffect, useImperativeHandle, forwardRef } from 'react';

import { useMemoizedFn } from 'ahooks';

import { useTab } from '@/libs/route';
import { useECharts } from '@/utils/hooks';
import { useLocation } from '@/utils/router';
interface Props {
  option: any;
  isSvg?: boolean;
  style?: any;
  // 监听容器，用于目录树拖动时的图resize
  resizeWrapper?: string;
}

interface Refs {
  resize: () => void;
}

const Chart = forwardRef<Refs, Props>(({ resizeWrapper, option, isSvg = true, style = {} }, ref) => {
  const { pathname } = useLocation();
  const { href } = window.location;

  const [chartRef, chartInstance] = useECharts(option as any, isSvg ? 'svg' : 'canvas', href, false);

  useImperativeHandle(ref, () => ({
    resize: handleResize,
  }));

  const handleResize = useMemoizedFn(() => {
    if (chartInstance) {
      (chartInstance as any)?.resize();
    }
  });

  useEffect(() => {
    if (chartInstance) {
      (chartInstance as any)?.setOption(option, true);
      const chart = (chartInstance as any)._dom;

      if (chart?.offsetWidth < chart.children[0]?.clientWidth) {
        chartInstance.resize();
      }
    }
  }, [option, chartInstance, pathname]); // 监听条件

  useTab({
    onActive() {
      if (chartInstance) {
        (chartInstance as any)?.resize();
      }
    },
  });
  // 监听拖动左侧目录树导致的图表变化
  useEffect(() => {
    if (resizeWrapper && chartInstance) {
      const contentViewDom = document.querySelector(resizeWrapper) as HTMLElement;
      const resizeOb = new ResizeObserver(() => {
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
    }
  }, [chartInstance, resizeWrapper]);

  //width不设置固定值，label显示不全
  return <div style={{ width: '100%', height: '100%', ...style }} ref={chartRef}></div>;
});

export default memo(Chart);
