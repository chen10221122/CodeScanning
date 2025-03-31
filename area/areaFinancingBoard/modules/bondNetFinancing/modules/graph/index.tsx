import { memo, useEffect, useState, useRef } from 'react';

import { produce } from 'immer';
import { cloneDeep } from 'lodash';

import Chart from '@/pages/area/areaFinancingBoard/components/Chart';
import { clearNumber } from '@/pages/area/areaFinancingBoard/config';
import { useConditionCtx } from '@/pages/area/areaFinancingBoard/context';
import type { BondNetFinancingList } from '@/pages/area/areaFinancingBoard/types';

import { lineBarOption } from './config';

const getWidth = (length: number) => {
  const width = document.documentElement.clientWidth;
  if (width < 1920 && length > 20) {
    return 8;
  } else {
    return 16;
  }
};

const LineBar = ({ data }: { data: BondNetFinancingList[] }) => {
  const [option, setOption] = useState(lineBarOption);
  const {
    state: {
      hideModule: { bondRepaymentPressure },
    },
  } = useConditionCtx();
  const ref = useRef<{ resize: () => void }>(null);

  useEffect(() => {
    if (bondRepaymentPressure) {
      ref.current?.resize();
    }
  }, [bondRepaymentPressure]);

  useEffect(() => {
    if (data?.length > 0) {
      const chartData = cloneDeep(data);
      chartData.reverse();
      setOption(
        produce((draft) => {
          draft.xAxis[0].data = chartData.map((item) => item.date);
          draft.series[0].data = chartData.map((item) => clearNumber(item.netFinanceAmount));
          draft.series[1].data = chartData.map((item) => clearNumber(item.totalIssueAmount));
          draft.series[2].data = chartData.map((item) => -clearNumber(item.totalRepayAmount));
          draft.series[1].barWidth = getWidth(chartData.length);
          draft.series[2].barWidth = getWidth(chartData.length);
        }),
      );
    } else {
      setOption(
        produce((draft) => {
          draft.xAxis[0].data = [];
          draft.series[0].data = [];
          draft.series[1].data = [];
          draft.series[2].data = [];
        }),
      );
    }
  }, [data]);
  return (
    <div style={{ height: 184 }}>
      <Chart option={option} ref={ref} />
    </div>
  );
};

export default memo(LineBar);
