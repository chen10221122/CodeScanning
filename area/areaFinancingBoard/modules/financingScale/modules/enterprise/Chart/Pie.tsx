import { memo, useEffect, useState } from 'react';

import { produce } from 'immer';

import { clearNumber } from '@/pages/area/areaFinancingBoard/config';
import type { FinancingScaleList } from '@/pages/area/areaFinancingBoard/types';

import Chart from '../../../../../components/Chart';
import { PieOption } from './configs';

const Pie = ({ data }: { data: FinancingScaleList[] }) => {
  const [option, setOption] = useState(PieOption);

  useEffect(() => {
    if (data?.length > 0) {
      setOption(
        produce((draft: any) => {
          draft.series[0].data = data
            .map((item) => {
              return {
                name: item.financeType,
                value: clearNumber(item.financeAmount),
                count: clearNumber(item.financeNum),
                percent: item.percent,
              };
            })
            .slice(0, 5);
        }),
      );
    } else {
      setOption(
        produce((draft) => {
          draft.series[0].data = [];
        }),
      );
    }
  }, [data]);

  return <Chart option={option} />;
};

export default memo(Pie);
