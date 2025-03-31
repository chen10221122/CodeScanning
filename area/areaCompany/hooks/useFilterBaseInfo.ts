import { useEffect, useMemo, useRef, useState } from 'react';

import { useMemoizedFn } from 'ahooks';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { WritableDraft } from 'immer';
import { isArray, omit, cloneDeep } from 'lodash';

import { ScreenValues, Options } from '@/components/screen';
import {
  ScreenParamsType,
  REGIONAL_PAGE,
  HasDefaultParamsPageMap,
  CompanyScreenParamsType,
  CompanyFilterResultType,
  IndustryCodeLevelList,
  initScreenParams,
  initCompanyFilter,
  TreeNodeMap,
  CodekeyMap,
  DateRangeSelectPage,
  NeedFormatDatePage,
  IPOEnterpriseTabTypeMap,
  InfiniteIntervalIsEmpty,
  // any,
} from '@/pages/area/areaCompany/configs';
import { useFilterData } from '@/pages/area/areaCompany/hooks/useFilterData';
import {
  trimComma,
  formatToNormalDate,
  replaceFilterItem,
  getRecentRange,
  handleAmountOrRadioRange,
} from '@/pages/area/areaCompany/utils/filter';
import { isMunicipality } from '@/pages/area/areaEconomy/common';
import { useImmer } from '@/utils/hooks';
import { shortId } from '@/utils/share';

/**
 *
 * @param tagCode 科创企业的标签类型
 * @returns
 */
export const useFilterBaseInfo = ({
  pageType,
  tagCode,
  regionCode,
  regionLevel,
  branchId,
  onChangeFilterStatus,
}: {
  pageType: REGIONAL_PAGE;
  tagCode?: string;
  regionCode: string;
  regionLevel: number;
  branchId: string;
  onChangeFilterStatus: (
    f: (
      draft: WritableDraft<{
        loading: boolean;
        error: boolean;
      }>,
    ) => void | {
      loading: boolean;
      error: boolean;
    },
  ) => void;
}) => {
  /** 区域融资-请求筛选项的参数 */
  const [filterCondition, setFilterCondition] = useImmer<ScreenParamsType>(initScreenParams);
  /** 区域企业-请求更多筛选项的参数 */
  const companyFilterCdt: CompanyScreenParamsType = useMemo(
    () => ({
      regionCode,
      tagCode: tagCode || '',
      treeNode: TreeNodeMap.get(pageType) || branchId,
      tabType: IPOEnterpriseTabTypeMap.get(pageType) || '',
    }),
    [regionCode, pageType, tagCode, branchId],
  );

  /** 区域企业-选中的筛选项，用于请求列表 */
  const [companyFilterValues, setCompanyFilterValues] = useImmer<CompanyFilterResultType>({
    ...initCompanyFilter,
  });
  /** 区域融资-选中的筛选项，作为受控组件的values传参 */
  const [screenValues, setScreenValues] = useImmer<ScreenValues>([]);
  /** 关键词搜索 */
  const [keyword, setKeyword] = useState('');
  /** 筛选项配置 */
  const [option, setOption] = useState<Options[]>([]);
  /** 选中的筛选项的key值集合，用于区域融资重置筛选 */
  const keysRef = useRef<string[]>([]);
  const firstRenderRef = useRef(true);
  /** 保存上一次的筛选项配置，用于处理区域融资筛选联动 */
  const storeFinancingOptRef = useRef<Options[]>([]);
  /** 改变的筛选项key值，用于处理区域融资筛选联动 */
  const changeKeyRef = useRef<string>('');
  /** 保存全部的筛选项, 用于筛选项重置 */
  const firstFinancingScreenOptRef = useRef<Options[]>([]);
  /** 清除筛选时需重置 */
  const [screenKey, setScreenKey] = useState(shortId());
  /** 发行方式是否选中不限 */
  const financingTypeIsDefault = useRef(false);

  const infiniteIntervalVal = useMemo(() => (InfiniteIntervalIsEmpty.includes(pageType) ? '' : '*'), [pageType]);
  const needFormatDate = useMemo(() => NeedFormatDatePage.includes(pageType), [pageType]);
  /** 是否是区域企业和债券融资页面 */
  const isCompanyPage = useMemo(() => pageType > REGIONAL_PAGE.FINANCING_LEASING_EXPIRATION_EVENT, [pageType]);

  const { screenMenu, getFinancingFilterData, moreRun } = useFilterData(pageType, onChangeFilterStatus);

  /** 区分区域融资/企业 调用筛选项接口 */
  useEffect(() => {
    if (isCompanyPage) {
      /** 吊销/注销企业 更多筛选项不走接口 */
      if (pageType !== REGIONAL_PAGE.COMPANY_REVODE) {
        companyFilterCdt.regionCode && companyFilterCdt.treeNode && moreRun(companyFilterCdt);
      }
    } else {
      filterCondition.regionCode && getFinancingFilterData({ pageId: pageType, params: filterCondition });
    }
    // switch (true) {
    //   case (isCompanyPage && pageType !== REGIONAL_PAGE.COMPANY_REVODE):
    //   /** 吊销/注销企业 更多筛选项不走接口 */
    //     companyFilterCdt.regionCode && companyFilterCdt.treeNode && moreRun(companyFilterCdt);
    //     break;
    //   case (!isCompanyPage && pageType <= REGIONAL_PAGE.FINANCING_LEASING_EXPIRATION_EVENT):
    //     // 区域融资
    //     filterCondition.regionCode && getFinancingFilterData({ pageId: pageType, params: filterCondition });
    //     break;
    //   case (!isCompanyPage && pageType >= REGIONAL_PAGE.FINANCING_NOTFINANCIAL_BOND_STOCK):
    //     // 区域融资-债券融资
    //     // runBondFinancial(pageType);
    //     break;
    // }
  }, [isCompanyPage, pageType, filterCondition, companyFilterCdt, moreRun, getFinancingFilterData]);

  /** 区域融资-处理联动筛选项 */
  useEffect(() => {
    if (
      !isCompanyPage &&
      screenMenu.length &&
      JSON.stringify(storeFinancingOptRef.current) !== JSON.stringify(screenMenu)
    ) {
      if (!storeFinancingOptRef.current.length) {
        if (firstFinancingScreenOptRef.current.length) {
          /** 清空筛选项 */
          setOption(firstFinancingScreenOptRef.current);
          storeFinancingOptRef.current = firstFinancingScreenOptRef.current;
        } else {
          /** 首次渲染 */
          setOption(screenMenu);
          storeFinancingOptRef.current = screenMenu;
          firstFinancingScreenOptRef.current = screenMenu;
        }
      } else {
        const isChangeItem = storeFinancingOptRef.current.find(
          (item: any) => item.option?.children?.[0]?.key === changeKeyRef.current,
        );
        if (isChangeItem) {
          let newOption: Options[] = cloneDeep(screenMenu).map((menuItem: Options) => {
            if (menuItem.title === isChangeItem.title) {
              return isChangeItem;
            } else {
              return menuItem;
            }
          });
          const allSelected = omit(filterCondition, [
            'regionCode',
            'disclosureDate',
            'registrationProvinceCode',
            'registrationCityCode',
            'registrationDistrictCode',
            'txt',
            'financingType',
          ]);
          const isIssue = pageType === REGIONAL_PAGE.FINANCING_ADDITIONAL_ISSUE;
          /** 有几组筛选被选中 */
          const selectedGroup = Object.keys(allSelected).filter(
            (selectedItem: any) => !!allSelected[selectedItem as keyof ScreenParamsType],
          );
          /** 所有筛选恢复默认 */
          if (!selectedGroup.length) {
            if (isIssue && !financingTypeIsDefault.current) {
              /** 只筛选发行方式 */
              newOption = replaceFilterItem(firstFinancingScreenOptRef.current, 'financingType', screenMenu);
            } else {
              newOption = screenMenu;
            }
          } else if (selectedGroup.length === 1 && (isIssue ? financingTypeIsDefault.current : true)) {
            /** 只筛选一组选项时，这一组要恢复全部的筛选项 */
            newOption = replaceFilterItem(firstFinancingScreenOptRef.current, selectedGroup[0], screenMenu);
          }

          /** 有搜索条件时, 直接用接口返回的筛选项 */
          if (filterCondition.text !== '') {
            newOption = screenMenu;
            setOption(newOption);
            return;
          }
          setOption(newOption);
          storeFinancingOptRef.current = newOption;
        }
      }
    }
  }, [isCompanyPage, screenMenu, filterCondition, screenKey, pageType]);

  useEffect(() => {
    if (isCompanyPage) {
      setOption(screenMenu);
    }
  }, [isCompanyPage, screenMenu]);

  const handleDefaultRange = useMemoizedFn(() => {
    const { rangeKey, rangeSelectInfo } = DateRangeSelectPage.get(pageType) || {};
    const { defaultRange } = rangeSelectInfo || {};
    const obj: Record<any, string> = {
      registerStartDateFrom: '',
      endDateFrom: '',
      registerStartDateTo: '',
      endDateTo: '',
      disclosureDate: '',
    };
    if (defaultRange && isArray(rangeKey)) {
      const [s, e] = defaultRange;
      const [start, end] = rangeKey;
      obj[start] = formatToNormalDate(s as any, 'YYYY-MM-DD');
      obj[end] = formatToNormalDate(e as any, 'YYYY-MM-DD');
    } else if (defaultRange && rangeKey === 'disclosureDate') {
      obj.disclosureDate = getRecentRange(1, 'year');
    }
    return obj;
  });

  /**
   * 区域融资 修改默认传参
   * 区域企业 修改默认地区传参
   * */
  useEffect(() => {
    if (firstRenderRef.current && regionCode && regionLevel) {
      if (isCompanyPage) {
        setCompanyFilterValues((lastFilterList: CompanyFilterResultType) => {
          lastFilterList[CodekeyMap.get(regionLevel) as string] = regionCode;
          lastFilterList.regionCode = regionCode;
        });
      } else {
        const obj = handleDefaultRange();
        const valKeys = Object.keys(obj).filter((key: string) => obj[key as any]);
        setFilterCondition((initCdt: ScreenParamsType) => {
          /**直辖区县 regionLevel为2 特殊处理为3 */
          initCdt[CodekeyMap.get(isMunicipality(regionCode) ? 3 : regionLevel) as string] = regionCode;
          initCdt.financingType = HasDefaultParamsPageMap.get(pageType) || '';
          initCdt.regionCode = regionCode;
          initCdt.containExpire = DateRangeSelectPage.get(pageType)?.isSwitch ? '1' : undefined;
          if (valKeys?.length === 2) {
            const [start, end] = valKeys;
            initCdt[start] = obj[start as any];
            initCdt[end] = obj[end as any];
          } else if (valKeys?.length === 1) {
            initCdt[valKeys[0]] = obj[valKeys[0] as any];
          }
        });
        financingTypeIsDefault.current = !!HasDefaultParamsPageMap.get(pageType);
      }
      firstRenderRef.current = false;
    }
  }, [
    pageType,
    setFilterCondition,
    regionCode,
    regionLevel,
    setCompanyFilterValues,
    isCompanyPage,
    handleDefaultRange,
  ]);

  /** 区域融资-处理筛选 */
  const onFilterChange = useMemoizedFn((filterInfo: any, isSelected: any, idx: number) => {
    const keys: string[] = Array.from(new Set(isSelected?.map((select: any) => select.key)));
    if (filterInfo.length) {
      const key = filterInfo[0].key;
      if (key) {
        /** 只有再融资-增发模块有发行方式筛选 */
        const isFinancingType = key === 'financingType' && filterInfo[0].name === '不限';
        const curVals = isFinancingType ? ['公开增发', '定向增发'] : filterInfo.map((item: any) => item.value);
        setFilterCondition((lastCdt: any) => {
          lastCdt[key] = curVals.join(',');
        });
        setScreenValues((lastVals: ScreenValues) => {
          lastVals[idx] = isFinancingType ? [''] : curVals;
        });
      }
      changeKeyRef.current = key;
      keysRef.current = keys;
    } else {
      /** 重置 */
      /** 被重置的选项的key */
      const isEmptyKey = keysRef.current.filter((item: string) => !keys.includes(item))?.[0];
      setFilterCondition((lastCdt: any) => {
        lastCdt[isEmptyKey] = '';
      });
      setScreenValues((lastVals: ScreenValues) => {
        lastVals[idx] = [''];
      });
      changeKeyRef.current = isEmptyKey;
      keysRef.current = keys;
    }
    const isDefault = isSelected.findIndex((item: any) => item.key === 'financingType' && item.name === '不限') > -1;
    financingTypeIsDefault.current = isDefault;
  });

  /** 清除搜索 */
  const onClearSearch = useMemoizedFn(() => {
    setKeyword('');
    if (isCompanyPage) {
      setCompanyFilterValues((lastFilterList: CompanyFilterResultType) => {
        lastFilterList.text = '';
      });
    } else {
      setFilterCondition((initCdt: ScreenParamsType) => {
        initCdt.text = '';
      });
    }
  });

  /** 搜索 */
  const onSearch = useMemoizedFn((txt: string) => {
    setKeyword(txt);
    if (isCompanyPage) {
      setCompanyFilterValues((lastFilterList: CompanyFilterResultType) => {
        lastFilterList.text = txt;
      });
    } else {
      setFilterCondition((initCdt: ScreenParamsType) => {
        initCdt.text = txt;
      });
    }
  });

  /** 日期区间筛选 */
  const onRangeChange = useMemoizedFn((dateRange: [Date, Date]) => {
    if (isArray(dateRange) && dateRange.length) {
      const rangeKey = DateRangeSelectPage.get(pageType)?.rangeKey;
      const [s, e] = dateRange;
      if (rangeKey) {
        if (isArray(rangeKey)) {
          // 租赁融资
          const [start, end] = rangeKey;
          setFilterCondition((initCdt: ScreenParamsType) => {
            initCdt[start] = formatToNormalDate(s, 'YYYY-MM-DD');
            initCdt[end] = formatToNormalDate(e, 'YYYY-MM-DD');
          });
        } else {
          // pevc
          setFilterCondition((initCdt: ScreenParamsType) => {
            initCdt.disclosureDate = `[${formatToNormalDate(s)},${formatToNormalDate(e)}]`;
          });
        }
      }
    }
  });

  /** 区域企业-处理筛选 */
  const onChangeCompanyFilter = useMemoizedFn((filterInfo: any, isSelected: any, idx: number) => {
    const initRes: CompanyFilterResultType = { ...initCompanyFilter };
    const filterArea = isSelected.filter((selectItem: any) => selectItem?._key === 'area');
    if (!filterArea.length) {
      /** 未筛选下属辖区时，取头部的地区code */
      initRes[CodekeyMap.get(regionLevel) as string] = regionCode;
      initRes.regionCode = regionCode;
    }

    isSelected.forEach((selectItem: any) => {
      if (selectItem?._key === 'area') {
        /**  ------------------- 下属辖区筛选 ---------------------- */
        if (selectItem.key === 1 && selectItem.value !== '100000') {
          initRes.registrationProvinceCode = (initRes.registrationProvinceCode ?? '') + `${selectItem.value},`;
        } else if (selectItem.key === 2) {
          initRes.registrationCityCode = (initRes.registrationCityCode ?? '') + `${selectItem.value},`;
        } else if (selectItem.key === 3) {
          initRes.registrationDistrictCode = (initRes.registrationDistrictCode ?? '') + `${selectItem.value},`;
        }
        initRes.regionCode += `${selectItem.value},`;
      }
      if (IndustryCodeLevelList.includes(selectItem.key)) {
        /**  ------------------- 国标行业筛选 ---------------------- */
        initRes[selectItem.key] = (initRes[selectItem.key] ?? '') + `${selectItem.value},`;
      }
      if (selectItem?.key === 'amount') {
        /**  ------------------- 注册资本筛选 ---------------------- */
        if (isArray(selectItem.value)) {
          const res = handleAmountOrRadioRange(selectItem.value, infiniteIntervalVal, true);
          initRes.registeredCapital += res;
        } else {
          initRes.registeredCapital += `${
            selectItem.value && selectItem.value !== 'null' ? selectItem.value + ';' : ''
          }`;
        }
      }
      if (selectItem?.inMore) {
        /**  ------------------- 更多筛选 ---------------------- */
        const key = selectItem?._key || selectItem?.key;
        switch (key) {
          case 'organizationalForm': // 新成立企业 -》 组织形式
          case 'ipoType': // 上市/发债
          case 'listingOrIssuance': // 评级 | 上市公司供应商-上市/发债
          case 'registrationAggs': //登记状态
          case 'registrationStatus': // 黑名单 -》登记状态
          case 'blackType': // 黑名单类型
          case 'ratingItCodes': //评级公司
          case 'mainRating': //主体评级
          case 'dataSource': //数据来源
          case 'enterpriseNature': //供应商类型
          case 'enterpriseLevel': //企业层级
          case 'marketLevel': //市场分层
          case 'newStatus': //最新状态
          case 'enterpriseType': // 企业类型
          case 'entType': // 科创企业 | 黑名单企业 -》企业类型
          case 'businessTypes': // 新成立企业 -》 企业类型
          case 'registerCapital': // 注销/吊销 | 新成立企业 -》 注册资本
          case 'intendListingBlock': // ipo储备企业 -》拟上市板块
          case 'financialOrgType': // 参控金融机构企业-》参控金融机构类型
            if (Array.isArray(selectItem.value)) {
              const res = handleAmountOrRadioRange(selectItem.value, infiniteIntervalVal, true);
              initRes[key] = (initRes[key] ?? '') + res;
            } else {
              const val =
                selectItem.value && selectItem.value !== 'null' && selectItem.value !== '不限' ? selectItem.value : '';
              initRes[key] = (initRes[key] ?? '') + `${val ? val + ',' : ''}`;
            }
            break;
          case 'indirectControllerRatio': //所属央企控制比例 ,所属发债企业控制比例,所属城投控制比例,所属上市公司控制比例,所属国企控制比例,参控上市比例
          case 'firstShareholderRatio': //第一大股东持股比例
          case 'actualControllerRatio': //实控人控制比例
          case 'status': //企业状态
          case 'hasTelNo': // 新成立企业 -》 联系电话
          case 'establishmentDate': // 成立日期
          case 'revocationAndCancelledDate': // 吊销/注销日期
          case 'publishDate': // 公布日期
          case 'declareDate': // 科创企业 -》 公布日期
          case 'registerDate': // 新成立企业-成立日期
          case 'ratingDate': // 评级日期
          case 'bondStartDate': // 首次发债日期
            if (Array.isArray(selectItem.value)) {
              if (key.includes('Ratio')) {
                const res = handleAmountOrRadioRange(selectItem.value, infiniteIntervalVal, false);
                initRes[key] = res;
                return;
              }
              const rule = needFormatDate ? 'YYYY-MM-DD' : 'YYYYMMDD';
              const [s, e] = [
                formatToNormalDate(selectItem.value?.[0], rule),
                formatToNormalDate(selectItem.value?.[1], rule),
              ];
              initRes[key] = `[${s},${e})`;
            } else {
              initRes[key] = `${(selectItem.value || '') === '不限' ? '' : selectItem.value}`;
            }
            break;
        }
      }
    });

    const res = trimComma(initRes);
    res.text = keyword;
    setCompanyFilterValues(() => res as CompanyFilterResultType);
  });

  /** 清除筛选 */
  const onClearFilter = useMemoizedFn(() => {
    if (isCompanyPage) {
      setCompanyFilterValues(() => ({
        ...initCompanyFilter,
        regionCode,
        [CodekeyMap.get(regionLevel) as string]: regionCode,
      }));
    } else {
      const obj = handleDefaultRange();
      setFilterCondition(() => ({
        ...initScreenParams,
        regionCode,
        [CodekeyMap.get(regionLevel) as string]: regionCode,
        financingType: HasDefaultParamsPageMap.get(pageType) || '',
        containExpire: DateRangeSelectPage.get(pageType)?.isSwitch ? '1' : undefined,
        ...obj,
      }));
      setScreenValues(() => []);
      storeFinancingOptRef.current = [];
      changeKeyRef.current = '';
      setOption([]);
    }
    setKeyword('');
    setScreenKey(shortId());
  });

  /** 切换【含到期租赁】 */
  const onSwitchChange = useMemoizedFn((e: CheckboxChangeEvent) => {
    setFilterCondition((initCdt: ScreenParamsType) => {
      initCdt.containExpire = e.target.checked ? '1' : '0';
    });
  });

  return {
    screenKey,
    isCompanyPage,
    screenValues,
    onClearSearch,
    onSearch,
    keyword,
    onRangeChange,
    onFilterChange: isCompanyPage ? onChangeCompanyFilter : onFilterChange,
    filterResult: isCompanyPage ? companyFilterValues : filterCondition,
    filterMenu: option,
    onClearFilter,
    onSwitchChange,
  };
};
