import { useState, useEffect } from 'react';

import { useRequest } from 'ahooks';

import { getParkFilter } from '@/apis/area/industrialPark';
import { useSelector } from '@/pages/area/areaF9/context';

import type { ScreenApiResult } from './type';

const initalState = {
  lowerAgg: [],
  levelAgg: [],
  industryAgg: [],
  areaAgg: [],
};

const useFilter = () => {
  const { areaInfo } = useSelector((store) => ({ areaInfo: store.areaInfo }));
  const [filterFirstLoading, setFirstLoading] = useState(true);
  const [option, setOption] = useState<ScreenApiResult>(initalState);

  const { run } = useRequest(getParkFilter, {
    manual: true,
    onSuccess(res: { data: ScreenApiResult }) {
      setOption(res?.data ? res.data : initalState);
    },
    onError() {
      setOption(initalState);
    },
    onFinally() {
      setFirstLoading(false);
    },
  });

  useEffect(() => {
    if (areaInfo?.regionCode) {
      run({ areaCode: areaInfo.regionCode });
    }
  }, [areaInfo?.regionCode, run]);

  return { filterFirstLoading, option };
};

export default useFilter;
