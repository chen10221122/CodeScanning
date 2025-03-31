import { useEffect, useState } from 'react';

import { useRequest } from 'ahooks';

import { getSocianFinance } from '@/apis/area/areaEconomy';
import { useSelector } from '@/pages/area/areaF9/context';
import { getFormattedTableData } from '@/pages/area/areaF9/modules/regionalFinancing/socialFinance/useSocialFinanceData';

const useRegion = () => {
  const { areaInfo } = useSelector((store) => ({ areaInfo: store.areaInfo }));
  const [data, setData] = useState<any>([]);
  const { run, loading } = useRequest(getSocianFinance, {
    manual: true,
    onSuccess: (res) => {
      setData(res && res.data ? getFormattedTableData(res.data) : []);
    },
    onError() {
      setData([]);
    },
  });
  useEffect(() => {
    if (areaInfo?.regionCode) {
      run({
        EDBTreeID: '10001050,10001082,10001114,10001146,10001178,10001210,10001242,10001274,10001306', //指标目录
        dateSuffix: '12', //年度
        regionCode: areaInfo.regionCode,
      });
    }
  }, [areaInfo?.regionCode, run]);

  return { loading, originData: data };
};

export default useRegion;
