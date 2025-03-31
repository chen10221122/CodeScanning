import { useState, useEffect } from 'react';

import { useMemoizedFn, useRequest } from 'ahooks';
import { isArray } from 'lodash';

import { getLandDetail } from '@pages/area/landTopic/api';
import { SelectItem } from '@pages/area/landTopic/components/IndexTable';
import { useCtx as useCommonCtx } from '@pages/area/landTopic/provider';

import { shortId } from '@/utils/share';

const useData = (params: Record<string, any>, scrollTop?: () => void) => {
  const [total, setTotal] = useState(0);
  const [companyNum, setCompanyNum] = useState(0);
  const [loading, setLoading] = useState(true);

  const [indicator, setIndicator] = useState<SelectItem[]>([]);

  const [dataSource, setDataSource] = useState<Record<string, any>[]>([]);
  const {
    state: {
      overview: { detailDefault },
    },
  } = useCommonCtx();

  useEffect(() => {
    setIndicator([...detailDefault]);
  }, [detailDefault]);

  const { run } = useRequest(getLandDetail, {
    manual: true,
    onSuccess: ({ data: res }) => {
      const { data, total, companyNum } = res || {};
      if (isArray(data)) {
        setDataSource(data.map((item) => ({ ...item, key: shortId() })));
        setTotal(total);
        setCompanyNum(companyNum || 0);
      } else {
        setDataSource([]);
        setTotal(0);
        setCompanyNum(0);
      }
    },
    onError: () => {
      setDataSource([]);
      setTotal(0);
      setCompanyNum(0);
    },
    onBefore: () => {
      scrollTop?.();
      setLoading(true);
    },
    onFinally: () => {
      setLoading(false);
    },
  });

  const onIndicatorChange = useMemoizedFn((selects: SelectItem[]) => {
    setIndicator(selects);
  });

  useEffect(() => {
    const { contractSignDate, dealDate, transferDate } = params;
    if (contractSignDate || dealDate || transferDate) {
      run(params);
    }
  }, [params, run]);

  const resetState = useMemoizedFn(() => {
    setTotal(0);
    setDataSource([]);
    setLoading(true);
  });

  return { loading, dataSource, resetState, indicator, total, onIndicatorChange, companyNum };
};

export default useData;
