import { useEffect, useRef, useState } from 'react';

import { useRequest } from 'ahooks';

import { getStockADistributionDetail, transformParams } from './api';
import { DetailModalInfoMap } from './type';
import usePage from './usePage';
export const formatDetailModalData = (data: Record<string, any>[], skip: number) => {
  return data.map((o, i) => {
    return { ...o, rowIndex: skip + i + 1 };
  });
};
export default function useModalData({ visible, detailModalConfig = {} }: any) {
  const isFirstLoadRef = useRef(true);
  const { modalType } = detailModalConfig;
  const { page, setPage, handleChangePage } = usePage();
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [count, setCount] = useState(0);

  const { run, loading, error } = useRequest(
    DetailModalInfoMap.get(modalType)?.apiName || getStockADistributionDetail,
    {
      manual: true,
      onSuccess: (res: any, params: Record<string, any>[]) => {
        if (res.data?.data?.length) {
          setDataSource(formatDetailModalData(res.data.data, params[0].skip || 0));
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
      onFinally() {
        isFirstLoadRef.current = false;
      },
    },
  );
  // 初始化
  useEffect(
    function () {
      if (visible) {
        setPage(1);
        run({ ...transformParams(detailModalConfig.defaultCondition), skip: 0 });
      } else {
        isFirstLoadRef.current = true;
      }
    },
    [detailModalConfig.defaultCondition, run, setPage, visible],
  );

  return {
    isFirstLoadRef: isFirstLoadRef,
    dataSource,
    count,
    loading,
    page,
    run,
    setPage,
    error,
    handleChangePage,
  };
}
