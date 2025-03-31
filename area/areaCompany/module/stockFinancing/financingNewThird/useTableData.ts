import { useEffect, useRef, useState } from 'react';

import { useMemoizedFn, useRequest } from 'ahooks';
import { isArray, isEmpty } from 'lodash';

import { SortMap, LoadType } from '@/layouts/filterTableTemplate/config';

import { getNewThirdAddDetail } from './api';

const useTableData = ({ condition, setCondition, stickyDom }: any) => {
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [tableData, setTableData] = useState<any[]>([]);
  const loadingTypeRef = useRef<LoadType>(LoadType.SCREEN);

  const { loading, run, error } = useRequest(getNewThirdAddDetail, {
    manual: true,
    onSuccess({ data }: { data: any }) {
      if (isArray(data?.data) && data.data.length) {
        const res = data.data.map((o: any, i: number) => {
          return { ...o, rowIndex: (current - 1) * 50 + i + 1 };
        });
        setTableData(res);
        setTotal(data.total);
      }
    },
    onError(err: any) {
      setTableData([]);
      setTotal(0);
    },
    onFinally() {
      loadingTypeRef.current = LoadType.SCREEN;
    },
  });
  const scrollToTop = useMemoizedFn(() => {
    stickyDom?.scrollTo({ top: 0 });
  });
  const handleTableChange = useMemoizedFn((pagination, filters, sorter, extra) => {
    if (extra.action === 'sort') {
      loadingTypeRef.current = LoadType.TABLE;
      const { order, field } = sorter;
      setCondition((d: Record<string, any>) => {
        d.sortKey = order ? field : '';
        d.sortRule = order ? SortMap[order] : '';
      });
    }
  });
  const onPageChange = useMemoizedFn((p) => {
    setCurrent(p);
    loadingTypeRef.current = LoadType.TABLE;
    scrollToTop();
    run({ ...condition, from: (p - 1) * 50 });
  });
  // 筛选项参数变化，table数据变化
  useEffect(() => {
    if (!isEmpty(condition)) {
      scrollToTop();
      setCurrent(1);
      run({ ...condition, from: 0 });
    }
  }, [condition, run, scrollToTop]);
  return {
    loading,
    tableData,
    current,
    setCurrent,
    total,
    handleTableChange,
    onPageChange,
    loadType: loadingTypeRef.current,
    error,
  };
};
export default useTableData;
