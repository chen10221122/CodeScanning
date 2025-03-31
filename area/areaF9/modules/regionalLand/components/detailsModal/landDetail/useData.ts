import { useState, useEffect } from 'react';

import { useMemoizedFn, useRequest } from 'ahooks';
import { isArray } from 'lodash';

import { useCtx as useCommonCtx } from '@pages/area/areaF9/modules/regionalLand/components/detailsModal/provider';
import { getLandDetail } from '@pages/area/landTopic/api';
import { SelectItem } from '@pages/area/landTopic/components/IndexTable';

import { shortId } from '@/utils/share';

const useData = (params: Record<string, any>, scrollTop: () => void) => {
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
  const modalContainer = document.getElementById('detail-modalWrapper');
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
      scrollTop();
      setLoading(true);
      if (modalContainer) {
        modalContainer.scrollIntoView(true);
      }
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

  return { loading, dataSource, indicator, total, onIndicatorChange, companyNum };
};

export default useData;
