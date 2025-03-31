import { useState, useEffect, useMemo } from 'react';

import { useRequest, useMemoizedFn } from 'ahooks';

import { PAGESIZE, sortMap } from '@/pages/area/areaCompany/const';
import { getLevel } from '@/pages/area/areaEconomy/common';
import { Level } from '@/pages/area/areaEconomy/config';
import { useSelector } from '@/pages/area/areaF9/context';
import { formatDetailModalData } from '@/pages/area/areaFinancing/utils';
import type { ModuleDetailProps } from '@/pages/area/areaFinancingBoard/types';
import { useImmer } from '@/utils/hooks';

const defaultCondition = {
  from: 0,
  sort: '',
};

const useBankDetailData = ({ detailListApiFunction }: ModuleDetailProps) => {
  const { regionCode } = useSelector((store) => store.areaInfo) || {};
  const [visible, setVisible] = useState(false);
  const [curPage, setCurPage] = useState(1);
  const [count, setCount] = useState(0);
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [condition, updateCondition] = useImmer(defaultCondition);
  const [itemType, setItemType] = useState('');

  const { run, loading } = useRequest(detailListApiFunction, {
    manual: true,
    onSuccess: (res: any, params: Record<string, any>[]) => {
      if (res.data?.length) {
        setData(formatDetailModalData(res.data, params[0].from || 0));
        setCount(res.length);
      } else {
        setData([]);
        setCount(0);
      }
    },
    onError() {
      setData([]);
      setCount(0);
    },
  });

  useEffect(() => {
    if (visible) run(condition);
  }, [run, condition, visible]);

  const region = useMemo(() => {
    if (regionCode) {
      const level = getLevel(`${regionCode}`);
      const region = { regionLevel: level };
      switch (level) {
        case Level.PROVINCE:
          return { ...region, regionCode };
        case Level.CITY:
          return { ...region, cityCode: regionCode };
        case Level.COUNTY:
          return { ...region, countyCode: regionCode };
        default:
          return null;
      }
    }
    return null;
  }, [regionCode]);

  const handleOpenModal = useMemoizedFn((row: any, extraParams?: any) => {
    setItemType(row?.itemType);

    setVisible(true);

    setData([]);

    updateCondition(() => ({
      ...region,
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
      const sortKey = sorter.order ? sorter.columnKey : '';
      const sortRule = sortMap.get(sorter.order) || '';
      d.sort = `${sortKey}:${sortRule}`;
      d.from = 0;
    });
  });

  return {
    itemType,
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

export default useBankDetailData;
