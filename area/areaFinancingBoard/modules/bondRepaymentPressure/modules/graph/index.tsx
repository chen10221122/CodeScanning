import { memo, useEffect, useState, useRef } from 'react';

import { produce } from 'immer';
import { cloneDeep } from 'lodash';

import Chart from '@/pages/area/areaFinancingBoard/components/Chart';
import { clearNumber } from '@/pages/area/areaFinancingBoard/config';
import { useConditionCtx } from '@/pages/area/areaFinancingBoard/context';
import type { BondRepaymentList } from '@/pages/area/areaFinancingBoard/types';

import { BarOption } from './config';

const Bar = ({ data }: { data: BondRepaymentList[] }) => {
  const [option, setOption] = useState(BarOption);
  const {
    state: {
      hideModule: { bondNetFinancing },
    },
  } = useConditionCtx();

  const ref = useRef<{ resize: () => void }>(null);

  useEffect(() => {
    if (bondNetFinancing) {
      ref.current?.resize();
    }
  }, [bondNetFinancing]);

  useEffect(() => {
    if (data?.length > 0) {
      const chartData = cloneDeep(data);
      setOption(
        produce((draft) => {
          draft.xAxis[0].data = chartData.map((item) => item.year);
          draft.series[0].data = chartData.map((item) => clearNumber(item.expireAmount));
          draft.series[1].data = chartData.map((item) => clearNumber(item.soldAmount));
          draft.series[2].data = chartData.map((item) => clearNumber(item.otherAmount));
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

export default memo(Bar);
