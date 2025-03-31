import { useEffect, useRef, useState } from 'react';

import { useRequest } from 'ahooks';

import { getMainRatingList } from '@/pages/area/areaCompany/api/regionFinancingApi';
import { useLoading } from '@/utils/hooks';

type TObj = Record<string, any>;

export default ({ condition, tabParams }: { condition: TObj; tabParams: any }) => {
  const paramsRef = useRef<TObj>();
  const [listInfo, setListInfo] = useState<TObj>({ data: [], total: 0 });
  const { loading, run, error } = useRequest(getMainRatingList, {
    manual: true,
    onSuccess(res: TObj) {
      setListInfo({ total: res?.total ?? '', data: res?.data ?? [] });
    },
    onError(err: any) {
      setListInfo({ total: 0, data: [] });
    },
  });
  const isFirstLoading = useLoading(loading);

  useEffect(() => {
    if (condition && (condition.provinceCode || condition.cityCode || condition.countyCode)) {
      let rebuildParams = {
        ...condition,
        ...tabParams,
      };
      run(rebuildParams);
      paramsRef.current = condition;
    }
  }, [run, condition, tabParams]);

  return { loading, isFirstLoading, error, listInfo };
};
