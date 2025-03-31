
import { useEffect, useState } from 'react';

import { useRequest, useMemoizedFn } from 'ahooks';

import { ScreenValues } from '@/components/screen';
import { REGIONAL_PAGE, } from '@/pages/area/areaCompany/configs';
import { PAGESIZE, sortMap } from '@/pages/area/areaCompany/const';
import { useImmer } from '@/utils/hooks';
import { shortId } from '@/utils/share';

import { ModuleTemplateProps } from '..';
import { getFilterDefault, } from '../config';

interface IProps {
  initCondition: Record<string, any>;
}

const useTableData = ({ pageType, listApiFunction, initCondition, pageSize = PAGESIZE }: IProps & Pick<ModuleTemplateProps, 'pageType' | 'listApiFunction' | 'pageSize'>) => {
  const [tableData, setTableData] = useState<Record<string, any>[]>([]);
  const [screenValues, updateScreenValues] = useImmer<ScreenValues>(getFilterDefault(pageType));
  const [screenKey, updateScreenKey] = useState(shortId());
  /** 关键词搜索 */
  const [keyword, setKeyword] = useState('');
  const [param, updateParam] = useImmer(initCondition);
  const [pageInfo, updatePageInfo] = useImmer({
    // 当前页数
    curPage: 1,
    totalCount: 0,
  });

  const { run, loading, error } = useRequest(listApiFunction, {
    manual: true,
    onSuccess(res: Record<string, any>) {
      const { data = [], total = 0 } = res.data;

      const flatData = data.reduce((arr: Record<string, any>[], list: Record<string, any>) => {
        list.valueList.forEach((item: Record<string, any>) => {
          switch (pageType) {
            case REGIONAL_PAGE.FINANCING_NOTFINANCIAL_NET_FINANCE:
            case REGIONAL_PAGE.FINANCING_FINANCIAL_NET_FINANCE:
              list[`${item.name}_netFinancingAmount`] = item.netFinancingAmount;
              list[`${item.name}_issueAmount`] = item.issueAmount;
              list[`${item.name}_repayAmount`] = item.repayAmount;
              break;
            default:
              list[`${item.name}_quantity`] = item.quantity;
              list[`${item.name}_amount`] = item.amount;
          }
        })
        return [...arr, list];
      }, [])

      updatePageInfo(d => { d.totalCount = total; });
      setTableData(flatData);
    },
    onError() {
      setTableData([]);
      updatePageInfo(() => ({
        curPage: 1,
        totalCount: 0
      }));
    },
  });

  useEffect(() => {
    run(param)
  }, [run, param])

  const resetDefalut = useMemoizedFn(() => {
    updatePageInfo((d) => { d.curPage = 1 })
  })

  /** 筛选项操作 */
  const handleMenuChange = useMemoizedFn((curMenu: Record<string, any>[], all: Record<string, any>[], index: number) => {
    const keyValueObj = all.reduce((pre: Record<string, any>, cur: Record<string, any>,) => {
      const value = pre[cur.key] ? ',' + cur.code : cur.code;
      return {
        ...pre,
        [cur.key]: `${pre[cur.key] || ''}${value}`
      }
    }, {})
    // commercialBankBonds和nonBankFinancialBonds是金融企业表头筛选参数，需保留
    updateParam((d) => ({
      ...initCondition,
      ...keyValueObj,
      text: d.text,
      commercialBankBonds: d.commercialBankBonds,
      nonBankFinancialBonds: d.nonBankFinancialBonds,
    }))

    updateScreenValues((draft: any) => {
      draft[index] = curMenu;
    });
    resetDefalut();
  });


  // 表格排序
  const handleChange = useMemoizedFn((_: any, __: any, sorter: any) => {
    updatePageInfo((d) => { d.curPage = 1 })
    updateParam((d) => {
      d.sortKey = sorter.order ? sorter.columnKey : '';
      d.sortRule = sortMap.get(sorter.order) || '';
      d.from = 0;
    });
  });

  // 翻页
  const handlePageChange = useMemoizedFn((page: number) => {
    updatePageInfo((d) => { d.curPage = page })
    updateParam(d => { d.from = (page - 1) * pageSize })
  });

  // 关键字搜索
  const handleSearch = useMemoizedFn((text?: string) => {
    setKeyword(text || '');
    updateParam(d => { d.text = text })
  });

  // 重新加载
  const handleReload = useMemoizedFn(() => {
    run({ ...param });
  });

  // 重置筛选
  const handleClear = useMemoizedFn(() => {
    resetDefalut();
    setKeyword('');
    updateParam(() => ({ ...initCondition }));
    updateScreenValues(() => getFilterDefault(pageType) as ScreenValues);
    updateScreenKey(shortId());
  });


  return {
    param,
    updateParam,
    loading,
    tableData,
    error,
    pageInfo,
    screenKey,
    screenValues,
    keyword,
    handleSearch,
    handleMenuChange,
    handleChange,
    handlePageChange,
    handleClear,
    handleReload
  }
}
export default useTableData;