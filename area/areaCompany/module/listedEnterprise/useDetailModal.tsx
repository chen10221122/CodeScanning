import { useState, useEffect } from 'react';

import { useRequest, useMemoizedFn } from 'ahooks';

import { getListedOrIssueOrgDetailList } from '@/pages/area/areaCompany/api/regionFinancingApi';
import { PAGESIZE } from '@/pages/area/areaCompany/const';
import { useImmer, useTableSort } from '@/utils/hooks';

import useDetailColumns from './useDetailColumns';

const defaultCondition = {
  itCode: '',
  from: 0,
  size: PAGESIZE,
  sort: 'enterpriseLevel:asc,shareholdingRatio:desc',
  treeNode: '900841',
};

export default () => {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [exportTitle, setExportTitle] = useState('');
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [condition, updateCondition] = useImmer<Record<string, any>>(defaultCondition);

  const noSortColumns = useDetailColumns({ curPage: page });

  const {
    columns,
    handelTableSort: handleTableChange,
    handleResetTable,
  } = useTableSort({
    defaultSortKey: 'enterpriseLevel',
    defaultSortRule: 'asc',
    noSortColumns,
    defaultCondition,
    updateCondition,
    conditionSort: 'sort',
  });

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
      });
    }
  }, [run, condition]);

  const handleOpenModal = useMemoizedFn((condition: Record<string, any>) => {
    setVisible(true);
    setTitle(`${condition.itName}-下属企业明细`);
    setExportTitle(`${condition.itName}下属企业明细`);
    updateCondition((d) => {
      d.from = defaultCondition.from;
      d.sort = defaultCondition.sort;
      d.itCode = condition.itCode;
    });
    handleResetTable();
  });

  const handlePageChange = useMemoizedFn((page: number) => {
    setPage(page);
    updateCondition((d) => {
      d.from = (page - 1) * PAGESIZE;
    });
  });

  return {
    columns,
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
