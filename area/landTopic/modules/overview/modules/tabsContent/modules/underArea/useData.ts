import { useState, useEffect } from 'react';

import { useMemoizedFn, useRequest } from 'ahooks';
import { isArray } from 'lodash';

import { getLandArea } from '@pages/area/landTopic/api';
import { SelectItem } from '@pages/area/landTopic/components/IndexTable';
import { useCtx as useCommonCtx } from '@pages/area/landTopic/provider';

import { shortId } from '@/utils/share';

const useData = (params: Record<string, any>, scrollTop: () => void) => {
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [indicator, setIndicator] = useState<SelectItem[]>([]);

  const [dataSource, setDataSource] = useState<Record<string, any>[]>([]);
  const {
    state: {
      overview: { statisticsDefault },
    },
  } = useCommonCtx();

  useEffect(() => {
    setIndicator([...statisticsDefault]);
  }, [statisticsDefault]);

  const { run } = useRequest(getLandArea, {
    manual: true,
    onSuccess: ({ data: res }) => {
      const { data, total } = res || {};
      if (isArray(data)) {
        setDataSource(data.map((item) => ({ ...item, key: shortId() })));
        setTotal(total);
      } else {
        setDataSource([]);
        setTotal(0);
      }
    },
    onError: () => {
      setDataSource([]);
      setTotal(0);
    },
    onBefore: () => {
      scrollTop();
      setLoading(true);
    },
    onFinally: () => {
      setLoading(false);
    },
  });

  const onIndicatorChange = useMemoizedFn((_: SelectItem[], selectsTree: SelectItem[]) => {
    setIndicator(selectsTree[0]?.children || []);
  });

  useEffect(() => {
    const { contractSignDate, dealDate, transferDate } = params;
    if (contractSignDate || dealDate || transferDate) {
      run(params);
    }
  }, [params, run]);

  return { loading, dataSource, indicator, total, onIndicatorChange };
};

export default useData;
