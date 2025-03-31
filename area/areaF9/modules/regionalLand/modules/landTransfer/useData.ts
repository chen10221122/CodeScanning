import { useState, useEffect } from 'react';

import { useRequest } from 'ahooks';
import { isArray, isEqual } from 'lodash';

import { getLandAnnualSales } from '@pages/area/landTopic/api';

import { shortId } from '@/utils/share';

const useData = (params: Record<string, any>) => {
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [dataSource, setDataSource] = useState<Record<string, any>[]>([]);
  const mainContainer = document.getElementById('main-container');
  const { run } = useRequest(getLandAnnualSales, {
    manual: true,
    onSuccess: ({ data: res }) => {
      const { data, total } = res || {};
      if (isArray(data)) {
        setDataSource(data.map((item) => ({ ...item, key: shortId() })));
        // 优化useEffect,解决双滚动条
        window.dispatchEvent(new Event('resize'));
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
      // scrollTop();
      setLoading(true);
      // 触发加载就立刻回到顶部，避免看不到loading图标
      if (loading && mainContainer) {
        mainContainer.scrollIntoView(true);
      }
    },
    onFinally: () => {
      setLoading(false);
    },
  });

  // 解决首次进入发两次请求
  const [prevPramas, setprevPramas] = useState<Record<string, any>>();
  useEffect(() => {
    const { contractSignDate, dealDate, transferDate, timeStatisticsType } = params;
    if ((contractSignDate || dealDate || transferDate) && timeStatisticsType && !isEqual(prevPramas, params)) {
      run(params);
    }
    setprevPramas(params);
  }, [params, prevPramas, run]);

  return { loading, dataSource, total };
};

export default useData;
