import { useState, useEffect } from 'react';

import { useRequest } from 'ahooks';

import { getParkFilters } from '@/apis/f9/enterprise/park';
import { useSelector } from '@/pages/area/areaF9/context';

import type { areaScreenApiResult } from '../type';

const initalState = {
  industryAgg: [],
  areaRange: [],
  enterpriseNature: [],
  industryCodeAgg: [],
  capitalMapAgg: [],
  enterpriseStatus: [],
  havePhone: [],
  haveMail: [],
};

const useFilter = () => {
  const { areaInfo } = useSelector((store) => ({ areaInfo: store.areaInfo }));
  const [option, setOption] = useState<areaScreenApiResult>(initalState);

  const { run } = useRequest(getParkFilters, {
    manual: true,
    onSuccess(res: { data: areaScreenApiResult }) {
      setOption(res?.data ? res.data : initalState);
    },
    onError() {
      setOption(initalState);
    },
  });

  useEffect(() => {
    if (areaInfo?.regionCode) {
      run({ areaCode: areaInfo.regionCode });
    }
  }, [areaInfo?.regionCode, run]);

  return option;
};

export default useFilter;
