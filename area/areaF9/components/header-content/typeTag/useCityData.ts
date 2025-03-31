import { useState } from 'react';

import { useRequest } from 'ahooks';
import { isArray } from 'lodash';

import { getAreaCityCircle } from '@/apis/area/areaEconomy';

export const useCityData = () => {
  const [list, setList] = useState<Record<string, any>[]>([]);
  // const [condition, updateCondition] = useImmer<Record<string, any>>(defaultParams)

  const { run, loading } = useRequest(getAreaCityCircle, {
    manual: true,
    onSuccess(res: any) {
      const data = res?.data;
      if (isArray(data) && data?.length > 0) {
        setList(data);
      } else {
        setList([]);
      }
    },
    onError() {
      setList([]);
    },
  });

  return { data: list, run, loading };
};
