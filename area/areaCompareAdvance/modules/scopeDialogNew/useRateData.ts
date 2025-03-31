import { useEffect, useState } from 'react';

import { getNewAreaModel } from '@/apis/area/areaEconomy';
import useRequest from '@/utils/ahooks/useRequest';

export default function useRateData(regionCode: string, visible: boolean, date: any) {
  const [info, setInfo] = useState<any>(null);

  // 悬浮框接口请求
  const { run: getModelInfo, loading } = useRequest(getNewAreaModel as any, {
    manual: true,
    onSuccess: (res) => {
      setInfo(res?.data || null);
    },
  });

  useEffect(() => {
    if (regionCode && visible) getModelInfo({ regionCode, year: date });
  }, [date, getModelInfo, regionCode, visible]);

  return {
    loading,
    info,
  };
}
