import { useEffect, useState, useRef } from 'react';

import { getGraphListData } from '@/pages/area/areaEconomy/modules/blackList/apis';
import { TabEnum } from '@/pages/area/areaEconomy/modules/blackList/constant';
import useRequest from '@/utils/ahooks/useRequest';

export const useGetGraphData = (params: Record<string, any>, activeTab: TabEnum) => {
  // 是否加载完成
  const [isLoadEnd, setIsLoadEnd] = useState(false);
  const paramsRef = useRef<Record<string, any>>();
  const [noData, setNoData] = useState(false);

  const { data, loading, error, run } = useRequest(getGraphListData, {
    manual: true,
    onError() {
      setIsLoadEnd(true);
    },
    formatResult(res: any) {
      const data = res?.data?.list;
      setIsLoadEnd(true);
      setNoData(!data?.length);
      return data || [];
    },
  });

  useEffect(() => {
    if (params && JSON.stringify(paramsRef.current) !== JSON.stringify(params) && activeTab === TabEnum.Graph) {
      paramsRef.current = params;
      setIsLoadEnd(false);
      run(params);
    }
  }, [params, run, activeTab]);

  return {
    data,
    loading,
    error,
    run,
    isLoadEnd,
    noData,
  };
};
