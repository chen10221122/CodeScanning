import { useState, useEffect } from 'react';

import { useRequest, useMemoizedFn } from 'ahooks';

import { PAGESIZE, sortMap } from '@/pages/area/areaCompany/const';
import { useSelector } from '@/pages/area/areaF9/context';
import { dateFormat } from '@/pages/area/areaFinancingBoard/config';
import type { ModuleDetailProps } from '@/pages/area/areaFinancingBoard/types';
import { useImmer } from '@/utils/hooks';

const defaultCondition = {
  from: 0,
  size: PAGESIZE,
  sortRule: '',
  sortKey: '',
};

export enum Type {
  //债券融资
  BOND = 'bond',
  // 信托融资
  TRUST = 'trust',
  // 租赁融资
  LEASE = 'lease',
  // 应收账款融资明细
  RECEIVE = 'receive',
}

const useDetailData = ({ detailListApiFunction }: ModuleDetailProps) => {
  const { areaInfo } = useSelector((store) => ({ areaInfo: store.areaInfo }));
  const [visible, setVisible] = useState(false);
  const [curPage, setCurPage] = useState(1);
  const [count, setCount] = useState(0);
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [condition, updateCondition] = useImmer<any>({});
  const [date, setDate] = useState('');

  const { run, loading } = useRequest(detailListApiFunction, {
    manual: true,
    onSuccess: (res: Record<string, any>) => {
      setData(res && res.data ? res.data.list || res.data.data : []);
      setCount(res && res.data ? res.data.total : 0);
      /* 解决双滚动条问题 */
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      });
    },
    onError() {
      setData([]);
      setCount(0);
    },
  });

  useEffect(() => {
    if (visible) run(condition);
  }, [run, condition, visible]);

  const handleOpenModal = useMemoizedFn((row: any, extraParams?: any) => {
    const { dataType, date, year, registStartDate, ignoreCurDay } = row;

    setVisible(true);

    setData([]);

    updateCondition(() => ({
      regionCode: areaInfo?.regionCode,
      dataType,
      year,
      changeDate: dateFormat(date, ignoreCurDay),
      ...defaultCondition,
      ...extraParams,
    }));

    if (registStartDate && registStartDate.includes('-')) {
      const [year, month] = registStartDate.split('-');
      setDate(`${year}年${month}月`);
    }
  });

  const handlePageChange = useMemoizedFn((page: number) => {
    setCurPage(page);
    updateCondition((d) => {
      d.from = (page - 1) * PAGESIZE;
    });
  });

  const handleTableChange = useMemoizedFn((_: any, __: any, sorter: any) => {
    setCurPage(1);
    updateCondition((d) => {
      d.sortKey = sorter.order ? sorter.columnKey : '';
      d.sortRule = sortMap.get(sorter.order) || '';
      d.from = 0;
    });
  });

  return {
    date,
    condition,
    visible,
    loading,
    count,
    curPage,
    dataSource: data,
    setVisible,
    handleOpenModal,
    handleTableChange,
    handlePageChange,
  };
};

export default useDetailData;
