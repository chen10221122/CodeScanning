import { useState, useEffect, useMemo } from 'react';

import { useRequest, useMemoizedFn } from 'ahooks';

import { PAGESIZE, sortMap } from '@/pages/area/areaCompany/const';
import { getLevel } from '@/pages/area/areaEconomy/common';
import { Level } from '@/pages/area/areaEconomy/config';
import { useSelector } from '@/pages/area/areaF9/context';
import type { ModuleDetailProps } from '@/pages/area/areaFinancingBoard/types';
import { useImmer } from '@/utils/hooks';

const defaultCondition = {
  popKey: 'leaseEventDetail',
  from: 0,
  size: 50,
  dimension: 'scale',
  statisticType: 'total',
};

const useDetailData = ({ detailListApiFunction }: ModuleDetailProps) => {
  const { areaInfo } = useSelector((store) => ({ areaInfo: store.areaInfo }));
  const [title, setTitle] = useState('');
  const [visible, setVisible] = useState(false);
  const [curPage, setCurPage] = useState(1);
  const [count, setCount] = useState(0);
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [condition, updateCondition] = useImmer<any>(defaultCondition);

  const region = useMemo(() => {
    const { regionCode } = areaInfo || {};
    if (regionCode) {
      const level = getLevel(`${regionCode}`);
      switch (level) {
        case Level.PROVINCE:
          return { regionCode };
        case Level.CITY:
          return { cityCode: regionCode };
        case Level.COUNTY:
          return { countryCode: regionCode };
        default:
          return null;
      }
    }
    return null;
  }, [areaInfo]);

  const { run, loading } = useRequest(detailListApiFunction, {
    manual: true,
    onSuccess: (res: Record<string, any>) => {
      setData(res && res.data ? res.data.list || res.data.data : []);
      setCount(res && res.data ? res.data.total : 0);
    },
    onError() {
      setData([]);
      setCount(0);
    },
  });

  useEffect(() => {
    if (visible && region) run({ ...condition, ...region });
  }, [run, condition, visible, region]);

  const handleOpenModal = useMemoizedFn((row: any, extraParams?: any) => {
    const { registStartDate } = row;
    const [y, m] = registStartDate && registStartDate.split('-');
    const title = `${y}年${m}租赁融资事件明细`;
    setTitle(title);

    setVisible(true);

    setData([]);

    updateCondition(() => ({
      ...defaultCondition,
      ...extraParams,
    }));
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

  const closeModal = useMemoizedFn(() => {
    setVisible(false);
    setCurPage(1);
  });

  return {
    title,
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
    closeModal,
  };
};

export default useDetailData;
