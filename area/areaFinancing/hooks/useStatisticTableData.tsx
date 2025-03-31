import { useEffect, useRef, useState } from 'react';

import { useMemoizedFn, useRequest } from 'ahooks';
import { isArray } from 'lodash';

import { useCtx } from '@pages/area/areaFinancing/context';
import { SortMap } from '@pages/area/areaFinancing/types';

import { getAreaFinancingA } from '@/pages/area/areaFinancing/api';
import { useConditionCtx } from '@/pages/area/areaFinancing/components/commonLayout/context';
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
  const {
    state: { wrapperRef },
    update: fullUpdate,
  } = useCtx();
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [tableData, setTableData] = useState<any[]>([]);
  const loadingTypeRef = useRef<LoadType>(LoadType.SCREEN);

  const { loading, run } = useRequest(apiConfig?.apiName || getAreaFinancingA, {
    manual: true,
    onSuccess({ data }: { data: any[] }) {
      if (isArray(data) && data.length) {
        const res = data.map((o: any, i: number) => ({ ...o, rowIndex: i + 1 }));
        setTableData(res);
        setTotal(data.length);
      }
      update((d) => {
        if (d.error) d.error = undefined;
      });
    },
    onError(err: any) {
      setTotal(0);
      setTableData([]);
      update((d) => {
        d.error = err;
      });
    },
    onFinally() {
      requestAnimationFrame(() => {
        fullUpdate((d) => {
          if (d.fullLoading) d.fullLoading = false;
        });
        update((d) => {
          if (d.isFirstLoad) d.isFirstLoad = false;
        });
      });
      loadingTypeRef.current = LoadType.SCREEN;
    },
  });
  const scrollToTop = useMemoizedFn(() => {
    wrapperRef?.scrollTo({ top: 0 });
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
    scrollToTop();
    setCurrent(p);
    loadingTypeRef.current = LoadType.TABLE;
  });
  useEffect(() => {
    if (condition) {
      scrollToTop();
      setCurrent(1);
      run({ ...(condition as any), from: 0 });
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
  return { loading, tableData, current, total, handleTableChange, onPageChange, loadType: loadingTypeRef.current };
};
export default useStatisticTableData;
