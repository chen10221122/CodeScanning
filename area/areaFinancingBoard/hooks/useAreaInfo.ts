import { useState, useEffect } from 'react';

import { useRequest } from 'ahooks';

import { getConditionByRegionCode } from '@/apis/area/areaFinancingBoard';

const useAreaInfo = (areaInfo: Record<string, any> | undefined) => {
  const [data, setData] = useState(true);
  const { run, loading } = useRequest(getConditionByRegionCode, {
    manual: true,
    onSuccess: (res: any) => {
      setData(res && res.data ? res.data.condition : true);
    },
  });

  useEffect(() => {
    if (areaInfo?.regionCode) {
      run({
        regionCode: areaInfo.regionCode,
      });
    }
  }, [areaInfo?.regionCode, run]);

  return { county: data, loading };
};

export default useAreaInfo;
