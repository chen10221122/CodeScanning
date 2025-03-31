import { useState, useEffect, useMemo } from 'react';

import { useRequest, useMemoizedFn } from 'ahooks';

import { PAGESIZE, sortMap } from '@/pages/area/areaCompany/const';
import { getLevel } from '@/pages/area/areaEconomy/common';
import { Level } from '@/pages/area/areaEconomy/config';
import { useSelector } from '@/pages/area/areaF9/context';
import type { ModuleDetailProps } from '@/pages/area/areaFinancingBoard/types';
import { useImmer } from '@/utils/hooks';

const defaultCondition = {
  skip: 0,
  sort: '',
};

//银行资源，企业授信分布详情
const useBankDetailData = ({ detailListApiFunction }: ModuleDetailProps) => {
  const { regionCode } = useSelector((store) => store.areaInfo) || {};
  const [visible, setVisible] = useState(false);
  const [curPage, setCurPage] = useState(1);
  const [count, setCount] = useState(0);
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [condition, updateCondition] = useImmer(defaultCondition);

  const { run, loading } = useRequest(detailListApiFunction, {
    manual: true,
    onSuccess: (res: Record<string, any>) => {
      setData(res && res.data ? res.data.data : []);
      setCount(res && res.data ? res.data.total : 0);
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
      switch (level) {
        case Level.PROVINCE:
          return { provinceCode: regionCode };
        case Level.CITY:
          return { cityCode: regionCode };
        case Level.COUNTY:
          return { countyCode: regionCode };
        default:
          return null;
      }
    }
    return null;
  }, [regionCode]);

  const handleOpenModal = useMemoizedFn((row: any, extraParams?: any) => {
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
      d.skip = (page - 1) * PAGESIZE;
    });
  });

  const handleTableChange = useMemoizedFn((_: any, __: any, sorter: any) => {
    setCurPage(1);
    updateCondition((d) => {
      const sortKey = sorter.order ? sorter.columnKey : '';
      const sortRule = sortMap.get(sorter.order) || '';
      d.sort = `${sortKey}:${sortRule}`;
      d.skip = 0;
    });
  });

  return {
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
