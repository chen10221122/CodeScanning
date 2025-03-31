import { useEffect, useState, useContext } from 'react';

import { useRequest } from 'ahooks';

import { getCompanyScale } from '@/apis/area/areaFinancingBoard';
import { useSelector } from '@/pages/area/areaF9/context';
import { useConditionCtx } from '@/pages/area/areaFinancingBoard/context';
import { FinancingScaleContext } from '@/pages/area/areaFinancingBoard/modules/financingScale/index';
import type { FinancingScaleList } from '@/pages/area/areaFinancingBoard/types';

const useEnterprise = () => {
  const { update } = useConditionCtx();
  const { year } = useContext(FinancingScaleContext);
  const { areaInfo } = useSelector((store) => ({ areaInfo: store.areaInfo }));
  const [data, setData] = useState<FinancingScaleList[]>([]);
  const { run, loading } = useRequest(getCompanyScale, {
    manual: true,
    onSuccess: (res: { data: FinancingScaleList[]; returncode: string }) => {
      setData(res && res.data ? res.data : []);
    },
    onError() {
      setData([]);
    },
    onFinally: (params, res, error) => {
      update((draft) => {
        draft.firstLoading.financingScaleLoading = false;
      });
    },
  });
  useEffect(() => {
    if (areaInfo?.regionCode && year) {
      run({
        regionCode: areaInfo.regionCode,
        year,
      });
    }
  }, [areaInfo?.regionCode, run, year]);

  return { loading, data };
};

export default useEnterprise;
