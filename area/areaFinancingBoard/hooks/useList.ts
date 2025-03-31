import { useState, useEffect } from 'react';

import { useRequest } from 'ahooks';
import { isEmpty } from 'lodash';

import { useSelector } from '@/pages/area/areaF9/context';
import { useConditionCtx } from '@/pages/area/areaFinancingBoard/context';
import type { ModuleListProps } from '@/pages/area/areaFinancingBoard/types';

const useList = ({ listApiFunction, type }: ModuleListProps) => {
  const { update } = useConditionCtx();
  const [data, setData] = useState([]);
  const { areaInfo } = useSelector((store) => ({ areaInfo: store.areaInfo }));
  const { run, loading } = useRequest(listApiFunction, {
    manual: true,
    onSuccess: (res: Record<string, any>) => {
      setData(res && res.data ? res.data : []);
    },
    onError() {
      setData([]);
    },
    onFinally: (params, res: any, error) => {
      if (isEmpty(res?.data)) {
        update((draft) => {
          draft.hideModule[type] = true;
        });
      }
      update((draft) => {
        draft.firstLoading[`${type}Loading`] = false;
      });
    },
  });

  useEffect(() => {
    if (areaInfo?.regionCode) {
      run({
        regionCode: areaInfo.regionCode,
      });
    }
  }, [areaInfo?.regionCode, run]);

  return { data, loading };
};

export default useList;
