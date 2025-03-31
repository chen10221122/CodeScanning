import { useState, useEffect } from 'react';

import { useRequest } from 'ahooks';
import { isEmpty } from 'lodash';

import { getBondRepayPressure } from '@/apis/area/areaFinancingBoard';
import { useSelector } from '@/pages/area/areaF9/context';
import { useConditionCtx } from '@/pages/area/areaFinancingBoard/context';
import type { BondRepaymentList } from '@/pages/area/areaFinancingBoard/types';

const useBondNetFinancing = (bondType: string) => {
  const { update } = useConditionCtx();
  const [data, setData] = useState<BondRepaymentList[]>([]);
  const [firstLoading, setFirstLoading] = useState(true);
  const { areaInfo } = useSelector((store) => ({ areaInfo: store.areaInfo }));
  const { run, loading } = useRequest(getBondRepayPressure, {
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
          draft.hideModule.bondRepaymentPressure = true;
        });
      }
      setFirstLoading(false);
      update((draft) => {
        draft.firstLoading.bondRepaymentPressureLoading = false;
      });
    },
  });

  useEffect(() => {
    if (areaInfo?.regionCode) {
      run({
        regionCode: areaInfo.regionCode,
        bondType,
      });
    }
  }, [areaInfo?.regionCode, bondType, run]);

  return { data, loading };
};

export default useBondNetFinancing;
