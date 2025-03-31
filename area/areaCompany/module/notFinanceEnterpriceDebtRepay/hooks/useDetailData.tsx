import { useState, useEffect, useMemo } from 'react';

import { useRequest, useMemoizedFn } from 'ahooks';

import {
  BondFicancialParams,
  getStockBondDetailList,
  getBondRepayDetailList,
} from '@/pages/area/areaCompany/api/regionFinancingApi';
import { getSortKey, getDetailTitle } from '@/pages/area/areaCompany/components/financeModuleTemplate/config';
import { REGIONAL_PAGE } from '@/pages/area/areaCompany/configs';
import { PAGESIZE, sortMap } from '@/pages/area/areaCompany/const';
import { useImmer } from '@/utils/hooks';

const defaultCondition = {
  from: 0,
  size: PAGESIZE,
  sortRule: 'desc',
  sortKey: 'changeDate',
};

export default () => {
  const [visible, setVisible] = useState(false);
  // 弹窗类型：存量明细、偿还明细
  const [pageType, setPageType] = useState(REGIONAL_PAGE.FINANCING_NOTFINANCIAL_BOND_STOCK);
  /** 是否是城投 */
  const [isUrbanBond, setIsUrbanBond] = useState(true);
  const [modalType, setModalType] = useState('');
  const [title, setTitle] = useState('');
  const [curPage, setCurPage] = useState(1);
  const [count, setCount] = useState(0);
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [condition, updateCondition] = useImmer<BondFicancialParams>(defaultCondition);

  const apiFunction = useMemo(
    () =>
      pageType === REGIONAL_PAGE.FINANCING_NOTFINANCIAL_BOND_STOCK ? getStockBondDetailList : getBondRepayDetailList,
    [pageType],
  );

  const { run, loading } = useRequest(apiFunction, {
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
    if (condition.itCode) run(condition);
  }, [run, condition]);

  const handleOpenModal = useMemoizedFn((row: Record<string, any>, pageParams: BondFicancialParams, modalType: REGIONAL_PAGE) => {
    const { name, code, changeDate, tags } = row;

    // 明细弹窗的标题后缀
    const suffixTitle = getDetailTitle(modalType);
    setVisible(true);
    setPageType(modalType);
    setTitle(`${name}债券${suffixTitle}`);
    // 判断是否要显示带城投标识的字段列
    const isUrban = tags.includes('城投');
    // 明细导出时需要区分是否是城投，是存量明细还是偿还明细
    const stockModalType = isUrban ? 'non_financing_bond_stock_detail' : 'non_financing_bond_stock_nourban_detail';
    const repayModalType = isUrban ? 'bond_not_financing_repay_detail' : 'bond_not_financing_repay_nourban_detail';
    const newModalType = modalType === REGIONAL_PAGE.FINANCING_NOTFINANCIAL_BOND_STOCK ? stockModalType : repayModalType;

    setIsUrbanBond(isUrban);
    setModalType(newModalType);

    updateCondition(() => ({
      ...pageParams,
      ...defaultCondition,
      sortKey: getSortKey(modalType),
      tabType: undefined,
      frequency: undefined,
      changeDate,
      itCode: code
    })
    );
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
    pageType,
    title,
    condition,
    visible,
    loading,
    count,
    curPage,
    dataSource: data,
    isUrbanBond,
    modalType,
    setVisible,
    handleOpenModal,
    handleTableChange,
    handlePageChange,
  };
};
