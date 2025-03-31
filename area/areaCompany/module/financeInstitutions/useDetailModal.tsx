import { useState, useEffect } from 'react';

import { useRequest, useMemoizedFn } from 'ahooks';

import { getListedOrIssueOrgDetailList } from '@/pages/area/areaCompany/api/regionFinancingApi';
import { PAGESIZE, sortMap } from '@/pages/area/areaCompany/const';
import { useImmer } from '@/utils/hooks';

const defaultCondition = {
  itCode: '',
  from: 0,
  size: PAGESIZE,
  sort: 'shareholdingRatio:desc,enterpriseInfo.itName:asc',
  treeNode: '900849',
};

export default () => {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [exportTitle, setExportTitle] = useState('');
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [condition, updateCondition] = useImmer<Record<string, any>>(defaultCondition);

  const { run, loading } = useRequest(getListedOrIssueOrgDetailList, {
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
    if (condition.itCode) {
      run({
        ...condition,
        sort: condition.sort + ',RN:asc',
      });
    }
  }, [run, condition]);

  const handleOpenModal = useMemoizedFn((condition: Record<string, any>) => {
    setVisible(true);
    setTitle(`${condition.itName}参控的金融机构`);
    setExportTitle(`${condition.itName}参控的金融机构`);
    updateCondition((d) => {
      d.from = defaultCondition.from;
      d.sort = defaultCondition.sort;
      d.itCode = condition.itCode;
    });
  });

  const handlePageChange = useMemoizedFn((page: number) => {
    setPage(page);
    updateCondition((d) => {
      d.from = (page - 1) * PAGESIZE;
    });
  });

  const handleTableChange = useMemoizedFn((_: any, __: any, sorter: any) => {
    const key = sorter.column?.sortKey ?? sorter.columnKey ?? sorter.field;
    const order = sortMap.get(sorter.order);
    updateCondition((d) => {
      if (order) {
        // chg sort rule
        d.sort = `${key}:${order}`;
      } else {
        // reset to default
        d.sort = `shareholdingRatio:desc,enterpriseInfo.itName:asc`;
      }
    });
  });

  return {
    exportTitle,
    title,
    condition,
    visible,
    loading,
    count,
    page,
    dataSource: data,
    setVisible,
    handleOpenModal,
    handleTableChange,
    handlePageChange,
  };
};
