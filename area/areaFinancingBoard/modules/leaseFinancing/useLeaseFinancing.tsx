import { useState, useEffect } from 'react';

import { useRequest } from 'ahooks';

import { getLeaseFinance } from '@/apis/area/areaFinancingBoard';
import { useSelector } from '@/pages/area/areaF9/context';
import type { LeaseFinancingList } from '@/pages/area/areaFinancingBoard/types';

const useLeaseFinancing = () => {
  const [data, setData] = useState<LeaseFinancingList[]>([]);
  const { areaInfo } = useSelector((store) => ({ areaInfo: store.areaInfo }));
  const { run, loading } = useRequest(getLeaseFinance, {
    manual: true,
    onSuccess: (res: any) => {
      setData(res && res.data ? res.data : []);
    },
    onError() {
      setData([]);
    },
  });

  // const region = useMemo(() => {
  //   const { regionCode } = areaInfo || {};
  //   if (regionCode) {
  //     const level = getLevel(`${regionCode}`);
  //     switch (level) {
  //       case Level.PROVINCE:
  //         return { regionCode: regionCode };
  //       case Level.CITY:
  //         return { cityCode: regionCode };
  //       case Level.COUNTY:
  //         return { countryCode: regionCode };
  //       default:
  //         return null;
  //     }
  //   }
  //   return null;
  // }, [areaInfo]);

  useEffect(() => {
    if (areaInfo?.regionCode) {
      run({
        regionCode: areaInfo.regionCode,
      });
    }
  }, [run, areaInfo?.regionCode]);

  return { data, loading };
};

export default useLeaseFinancing;
