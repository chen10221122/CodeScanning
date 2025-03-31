import { useEffect, useRef, useState } from 'react';

import { useMemoizedFn, useRequest } from 'ahooks';
import { isArray } from 'lodash';

import { getStockDistribution } from '../api';
import { useConditionCtx } from './context';
import { SortMap } from './type';
/** loading类型枚举 */
export enum LoadType {
  /** 操作表格 */
  TABLE,
  /** 操作筛选 */
  SCREEN,
}
const useStatisticTableData = (apiConfig?: { apiName: any; dataFormatFn: any }) => {
  const {
    state: { condition },
    update,
  } = useConditionCtx();
  const [summaryData, setSummaryData] = useState<Record<string, any> | undefined>();
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [tableData, setTableData] = useState<any[]>([]);
  const loadingTypeRef = useRef<LoadType>(LoadType.SCREEN);

  const { loading, run } = useRequest(apiConfig?.apiName || getStockDistribution, {
    manual: true,
    onSuccess({ data }: { data: any }) {
      if (isArray(data?.data) && data.data.length) {
        if (data.data[0].year === '合计') {
          setSummaryData(data.data[0]);
          data.data.splice(0, 1);
        }
        const res = data.data.map((o: any, i: number) => {
          return { ...o, rowIndex: (current - 1) * 50 + i + 1 };
        });
        setTableData(res);
        setTotal(data.total);
      }
      update((d) => {
        if (d.error) d.error = undefined;
      });
    },
    onError(err: any) {
      setTableData([]);
      setTotal(0);
      update((d) => {
        d.error = err;
      });
    },
    onFinally() {
      setTimeout(() => {
        update((d) => {
          if (d.isFirstLoad) d.isFirstLoad = false;
        });
      });
      loadingTypeRef.current = LoadType.SCREEN;
    },
  });
  const scrollToTop = useMemoizedFn(() => {
    // wrapperRef?.scrollTo({ top: 0 });
    document.querySelector('.side-page-content')?.scrollTo({ top: 0 });
  });
  const handleTableChange = useMemoizedFn((pagination, filters, sorter, extra) => {
    if (extra.action === 'sort') {
      loadingTypeRef.current = LoadType.TABLE;
      const { order, field } = sorter;
      update((d) => {
        d.condition!.sortKey = order ? field : '';
        d.condition!.sortRule = order ? SortMap[order] : '';
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
    if (condition) {
      scrollToTop();
      setCurrent(1);
      run({ ...condition, from: 0 });
    }
  }, [condition, run, scrollToTop]);
  /** 同步页码，用于序号列宽度计算 */
  useEffect(() => {
    if (current) {
      update((d) => {
        d.page = current;
      });
    }
  }, [current, update]);
  return {
    loading,
    tableData,
    current,
    setCurrent,
    total,
    handleTableChange,
    onPageChange,
    loadType: loadingTypeRef.current,
    summaryData,
  };
};
export default useStatisticTableData;
