import { useEffect, useState } from 'react';

import { useMemoizedFn, useRequest } from 'ahooks';
import { omit } from 'lodash';

import { getAreaBondInventoryDetail } from '@/pages/area/areaFinancing/api';
import { useConditionCtx } from '@/pages/area/areaFinancing/components/commonLayout/context';
import usePage from '@/pages/area/areaFinancing/hooks/usePage';
import { SortMap } from '@/pages/area/areaFinancing/types';
import { formatDetailModalData } from '@/pages/area/areaFinancing/utils';
import { useImmer } from '@/utils/hooks';

import { BondDetailModalInfoMap } from '../type';

export default function useModalData() {
  const {
    state: {
      visible,
      detailModalConfig: { modalType, defaultCondition },
    },
  } = useConditionCtx();

  const { page, setPage, handleChangePage } = usePage();
  const [condition, setCondition] = useImmer<Record<string, any>>({});

  const [dataSource, setDataSource] = useState<any[]>([]);
  const [count, setCount] = useState(0);

  const { run, loading, error } = useRequest(
    BondDetailModalInfoMap.get(modalType as any)?.apiName || getAreaBondInventoryDetail,
    {
      manual: true,
      onSuccess: (res: any, params: Record<string, any>[]) => {
        if (res.data?.data?.length) {
          setDataSource(formatDetailModalData(res.data.data, params[0].from || 0));
          setCount(res.data?.total);
        } else {
          setDataSource([]);
          setCount(0);
        }
      },
      onError() {
        setDataSource([]);
        setCount(0);
      },
    },
  );
  /** 刷新 */
  const handleReset = useMemoizedFn(() => {});
  /** 排序 */
  const handleTableSortChange = useMemoizedFn((pagination, filters, sorter, extra) => {
    if (extra.action === 'sort') {
      const { order, field } = sorter;
      setCondition((d) => {
        d.sortKey = order ? field : '';
        d.sortRule = order ? SortMap[order] : '';
      });
    }
  });

  const onPageChange = useMemoizedFn((p) => {
    handleChangePage(p);
    run({ ...condition, from: (p - 1) * 50 });
  });
  // 初始化
  useEffect(
    function () {
      if (visible && defaultCondition) {
        setCondition(() => Object.assign(omit(defaultCondition, 'areaType')));
      }
    },
    [defaultCondition, setCondition, visible],
  );

  // 筛选条件发生变化
  useEffect(() => {
    if (condition && Object.keys(condition).length) {
      run({ ...condition, from: 0 });
      setPage(1);
    }
  }, [condition, run, setPage]);

  return {
    dataSource,
    count,
    loading,
    condition,
    onPageChange,
    page,
    run,
    handleTableSortChange,
    setPage,
    handleReset,
    error,
  };
}
