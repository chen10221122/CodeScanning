import { useState, useEffect } from 'react';

import { useRequest, useMemoizedFn } from 'ahooks';

import { getHistoryList } from '@/apis/f9/enterprise';
import { PAGESIZE } from '@/pages/area/areaCompany/const';
import { useImmer, useTableSort } from '@/utils/hooks';

import useDetailColumns from './useDetailColumns';

const defaultCondition = {
  code: '',
  dataSource: '',
  from: 0,
  size: PAGESIZE,
  sortKey: 'noticeDate',
  sortRule: 'desc',
  source: 'web',
  type: 'company',
  customerCodes: 1,
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
    defaultSortKey: 'noticeDate',
    defaultSortRule: 'desc',
    noSortColumns,
    defaultCondition,
    updateCondition,
    conditionSortKey: 'sortKey',
    conditionSortRule: 'sortRule',
  });

  const { run, loading } = useRequest(getHistoryList, {
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
    if (condition.code) {
      run({
        ...condition,
      });
    }
  }, [run, condition]);

  const handleOpenModal = useMemoizedFn((condition: Record<string, any>) => {
    setVisible(true);
    setTitle(`${condition.itName}-客户历史明细`);
    setExportTitle(`${condition.itName}客户历史明细`);
    updateCondition((d) => {
      d.from = defaultCondition.from;
      d.sortKey = defaultCondition.sortKey;
      d.sortRule = defaultCondition.sortRule;
      d.treeNode = condition.treeNode;
      d.code = condition.itCode;
      d.dataSource = condition.dataSource;
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
