import { useState, useEffect } from 'react';

import { useRequest, useMemoizedFn } from 'ahooks';

import { BondFicancialParams } from '@/pages/area/areaCompany/api/regionFinancingApi';
import { REGIONAL_PAGE } from '@/pages/area/areaCompany/configs';
import { PAGESIZE, sortMap } from '@/pages/area/areaCompany/const';
import { useSelector } from '@/pages/area/areaF9/context';
import { useImmer } from '@/utils/hooks';

import { ModuleTemplateProps } from '..';
import { getSortKey, getDetailTitle, dateFormat } from '../config';

const defaultCondition = {
  from: 0,
  size: PAGESIZE,
  sortRule: 'desc',
  sortKey: 'changeDate',
};

export default ({
  pageType,
  detailListApiFunction,
}: Pick<ModuleTemplateProps, 'pageType' | 'detailListApiFunction'>) => {
  const { areaInfo } = useSelector((store) => ({ areaInfo: store.areaInfo }));
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [curPage, setCurPage] = useState(1);
  const [count, setCount] = useState(0);
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [condition, updateCondition] = useImmer<BondFicancialParams>(defaultCondition);

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
    if (condition.bondCategory) run(condition);
  }, [run, condition]);

  const handleOpenModal = useMemoizedFn((row: Record<string, any>, restParams: BondFicancialParams) => {
    // titleCode 就是对应入参 restParams.bondCategory 的值
    const { name, code, title, titleCode } = row;
    /** 是否是合计列 */
    const isTotal = titleCode === '-1';

    // 明细弹窗的标题后缀
    const suffixTitle = getDetailTitle(pageType);
    setVisible(true);
    setTitle(`${areaInfo?.regionName}${isTotal ? '债券' : title}${suffixTitle}`);

    /** 是否债券存量页面 */
    const isBondStock =
      pageType === REGIONAL_PAGE.FINANCING_NOTFINANCIAL_BOND_STOCK ||
      pageType === REGIONAL_PAGE.FINANCING_FINANCIAL_BOND_STOCK;

    /** 日期筛选 name是指第一列日期*/
    const changeDate = isBondStock ? code : dateFormat(name, pageType);

    /** 债券大类筛选 */
    const bondCategory = isTotal ? restParams.bondCategory : titleCode;
    /** 金融企业-商业银行债 表头筛选 */
    const commercialBankBonds = isTotal || titleCode === '2' ? restParams.commercialBankBonds : undefined;
    /** 金融企业-非银行金融债 表头筛选 */
    const nonBankFinancialBonds = isTotal || titleCode === '5' ? restParams.nonBankFinancialBonds : undefined;
    updateCondition(() => ({
      ...restParams,
      ...defaultCondition,
      sortKey: getSortKey(pageType),
      commercialBankBonds,
      nonBankFinancialBonds,
      tabType: undefined,
      frequency: undefined,
      changeDate,
      bondCategory,
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
  };
};
