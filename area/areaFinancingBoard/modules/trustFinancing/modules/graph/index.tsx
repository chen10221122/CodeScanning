import { memo, useState, useEffect } from 'react';

import { produce } from 'immer';
import { cloneDeep } from 'lodash';

import Chart from '@/pages/area/areaFinancingBoard/components/Chart';
import { clearNumber } from '@/pages/area/areaFinancingBoard/config';
import type { TrustFinancingLsit } from '@/pages/area/areaFinancingBoard/types';

import { lineBarOption } from './config';

const LineBar = ({ data }: { data: TrustFinancingLsit[] }) => {
  const [option, setOption] = useState(lineBarOption);

  useEffect(() => {
    if (data?.length > 0) {
      const chartData = cloneDeep(data);
      chartData.reverse();
      const xAxisData = chartData.map((item) => {
        const xAxis = item.startDate;
        var newStr = xAxis.replace(/-/, '');
        return newStr;
      });
      setOption(
        produce((draft) => {
          draft.xAxis[0].data = xAxisData;
          draft.series[0].data = chartData.map((item) => clearNumber(item.financeEventNum));
          draft.series[1].data = chartData.map((item) => clearNumber(item.totalFinanceAmount));
        }),
      );
    } else {
      setOption(
        produce((draft) => {
          draft.xAxis[0].data = [];
          draft.series[0].data = [];
          draft.series[1].data = [];
        }),
      );
    }
  }, [data]);

  return (
    <div style={{ height: 194 }}>
      <Chart option={option} />
    </div>
  );
};

export default memo(LineBar);
