/**
 * 区域融资-债券融资的筛选项数据
 */
import { useEffect, useState, useMemo } from 'react';

import { useRequest, useMemoizedFn } from 'ahooks';

import { ScreenType, Options } from '@/components/screen';
import { getBondFilterData } from '@/pages/area/areaCompany/api/screenApi';
import {
  getBondOption,
  notFinancialFilter,
  financialFilter,
  moreNotFinancialFilter,
  moreFinancialFilter,
  getItems,
  moreDebtRepayFilter,
} from '@/pages/area/areaCompany/components/filterInfo/menuConf';
import { isFinancialEnterprice } from '@/pages/area/areaCompany/components/financeModuleTemplate/config';
import { REGIONAL_PAGE, BondParamMap } from '@/pages/area/areaCompany/configs';

const useFinancialFilterData = (pageType: REGIONAL_PAGE) => {
  const [menuOption, setMenuOption] = useState<Options[]>([]);

  const params = useMemo(() => {
    const initParams = BondParamMap.get(pageType);
    if (initParams) {
      return { tabType: '3', ...initParams };
    }
  }, [pageType]);

  const { run, loading, error } = useRequest(getBondFilterData, {
    manual: true,
    onSuccess(res: any) {
      const data = res?.data || [];

      /** 是否是金融企业模块的页面 */
      const isFinancialPage = isFinancialEnterprice(pageType);

      /** 金融企业和非金融企业筛选配置 */
      let baseTitles: { title: string; formatTitle?: boolean, cascade?: boolean }[] = isFinancialPage
        ? financialFilter
        : notFinancialFilter,
        moreTitles = isFinancialPage ? moreFinancialFilter : moreNotFinancialFilter;

      if (data?.length) {
        switch (pageType) {
          case REGIONAL_PAGE.FINANCING_NOTFINANCIAL_BOND_REPAY:
          case REGIONAL_PAGE.FINANCING_FINANCIAL_BOND_REPAY:
            moreTitles = [moreDebtRepayFilter[0], ...moreTitles];
            break;
          case REGIONAL_PAGE.FINANCING_NOTFINANCIAL_DEBT_REPAY:
            moreTitles = [...moreDebtRepayFilter, ...moreTitles];
            break;
        }

        // 单个筛选项
        const baseList = baseTitles
          .map(({ title, formatTitle = false, cascade = false }) => {
            const multiple = cascade ? ScreenType.MULTIPLE_THIRD : ScreenType.MULTIPLE;
            const curItem = data.find((item: Record<string, string>) => item.name === title);
            if (curItem) {
              return {
                title,
                formatTitle: (row: any) => {
                  if (formatTitle) {
                    return (
                      <>
                        <span className="why-icon">{title}：</span>
                        {row[0].name}
                      </>
                    );
                  }
                  return row.map((d: Record<string, any>) => d.name).join(',');
                },
                option: {
                  type: curItem.multiple ? multiple : ScreenType.SINGLE,
                  hasSelectAll: curItem.hasSelectAll,
                  hideSearch: false,
                  cancelable: false,
                  cascade,
                  children: getItems(curItem.children, curItem.value),
                },
              };
            }
            return undefined;
          })
          .filter((d) => d);
        // 更多筛选
        const moreList = moreTitles
          .map(({ title, explain }) => {
            const curItem = data.find((item: Record<string, string>) => item.name === title);
            // const popoverTitle = (<span className='popover-title'>
            //   <span>{title}</span>
            //   <TableTooltip
            //     title={explain}
            //     getPopupContainer={() => document.getElementById('filterWrap') || document.body}
            //     placement="bottomLeft"
            //   />
            // </span>)
            if (curItem) {
              return {
                title,
                explain,
                multiple: curItem.multiple,
                hasSelectAll: curItem.hasSelectAll,
                data: getItems(curItem.children, curItem.value),
              };
            }
            return undefined;
          })
          .filter((d) => d);
        setMenuOption(getBondOption({ baseList, moreList }) as Options[]);
      }
    },
    onError() {
      setMenuOption([]);
    },
  });

  useEffect(() => {
    if (params) run(params);
  }, [run, params]);

  // 重新加载
  const handleReload = useMemoizedFn(() => {
    if (params) run({ ...params });
  });

  return {
    screenError: error,
    screenLoading: loading,
    menuOption,
    screenReload: handleReload,
  };
};
export default useFinancialFilterData;
