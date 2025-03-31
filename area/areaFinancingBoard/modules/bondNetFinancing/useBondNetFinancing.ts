import { useState, useEffect } from 'react';

import { useRequest } from 'ahooks';
import { isEmpty } from 'lodash';

import { getBondNetFinance } from '@/apis/area/areaFinancingBoard';
import { useSelector } from '@/pages/area/areaF9/context';
import { useConditionCtx } from '@/pages/area/areaFinancingBoard/context';
import type { BondNetFinancingList } from '@/pages/area/areaFinancingBoard/types';

const useBondNetFinancing = (condition: { timeType: string; bondType: string }) => {
  const { update } = useConditionCtx();
  const [data, setData] = useState<BondNetFinancingList[]>([]);
  const [firstLoading, setFirstLoading] = useState(true);
  const { areaInfo } = useSelector((store) => ({ areaInfo: store.areaInfo }));
  const { run, loading } = useRequest(getBondNetFinance, {
    manual: true,
    onSuccess: (res: any) => {
      setData(res && res.data ? res.data : []);
    },
    onError() {
      setData([]);
    },
    onFinally: (params, res, error) => {
      if (isEmpty(res?.data) && firstLoading) {
        update((draft) => {
          draft.hideModule.bondNetFinancing = true;
        });
      }
      setFirstLoading(false);
      update((draft) => {
        draft.firstLoading.bondNetFinancingLoading = false;
      });
    },
  });

  useEffect(() => {
    if (areaInfo?.regionCode && condition.timeType) {
      run({
        regionCode: areaInfo.regionCode,
        ...condition,
      });
    }
  }, [areaInfo?.regionCode, condition, run]);

  return { data, loading };
};

export default useBondNetFinancing;
