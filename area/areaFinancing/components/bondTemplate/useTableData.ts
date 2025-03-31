import { useEffect, useRef, useState } from 'react';

import { useMemoizedFn, useRequest } from 'ahooks';
import { isArray, omit } from 'lodash';

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
export enum TableColumnName {
  /** 合计 */
  Total = '合计',
  /** 城投债 */
  UrbanInvestment = '城投债',
  /** 产业债 */
  IndustrialBonds = '产业债',
  /** ABS */
  ABS = 'ABS',
  /** 可转换债券 */
  ConvertibleBond = '可转换债券',
  /** 可交换债券 */
  ExchangeableBonds = '可交换债券',
}
export enum TableColumnKey {
  /** 合计 */
  Total = '-1',
  /** 城投债 */
  UrbanInvestment = '9',
  /** 产业债 */
  IndustrialBonds = '10',
  /** ABS */
  ABS = '6',
  /** 可转换债券 */
  ConvertibleBond = '7',
  /** 可交换债券 */
  ExchangeableBonds = '8',
  /** 商业银行债 */
  CommercialBankBonds = '2',
  /** 同业存单 */
  Ncd = '3',
  /** 大额存单 */
  CertificateOfDeposit = '4',
  /** 非银行金融债 */
  NonBankFinancialBonds = '5',
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
    onSuccess({ data }: { data: any }) {
      if (isArray(data?.data) && data.data.length) {
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
      setTotal(0);
      setTableData([]);
      update((d) => {
        d.error = err;
      });
    },
    onFinally() {
      setTimeout(() => {
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
      run({ ...omit(condition, 'areaType'), from: 0 });
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
  };
};
export default useStatisticTableData;
