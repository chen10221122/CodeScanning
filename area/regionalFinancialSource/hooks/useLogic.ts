import { useEffect, useMemo, useRef, useState } from 'react';

import { useDeepCompareEffect, useMemoizedFn, useRequest } from 'ahooks';
import { isEmpty } from 'lodash';

import { RowItem } from '@/components/screen';
import { isCity, isCounty, isProvince } from '@/pages/area/areaEconomy/common';
import { useSelector } from '@/pages/area/areaF9/context';
import { useCtx } from '@/pages/area/financialResources/context';
import { Pager } from '@/pages/area/financialResources/module/common/type';
import {
  IBondAndInsureStat,
  getBondAndInsureStat,
  IBondAndInsureFinancialResourceList,
  getBondAndInsureFinancialResourceList,
} from '@/pages/area/regionalFinancialSource/api';
import { useImmer } from '@/utils/hooks';

import { FilterKey, filterDefaultParams, listDefaultParams, resetExceptField } from '../common/const';
import { PageFlag } from '../common/type';
import { joinPrefix } from '../common/utils';
import useMenu from './useMenu';

const useLogic = (pageFlag: PageFlag, scrollRef?: React.RefObject<HTMLDivElement>) => {
  const { update } = useCtx();
  const [renderScreen, setRenderScreen] = useState(true);
  const areaInfo = useSelector((store) => store.areaInfo);
  const { regionCode, regionName } = areaInfo || {};
  const [filterCondition, setFilterCondition] = useImmer({ ...filterDefaultParams, pageFlag });
  const [listCondition, setListCondition] = useImmer({ ...listDefaultParams, pageFlag });
  const [listData, setListData] = useState([]);
  const [firstLoaded, setFirstLoaded] = useState(false);
  const skipRef = useRef(0);
  const [pager, updatePager] = useImmer<Pager>({
    current: 1,
    total: 0,
    pageSize: 50,
  });
  const [menuConfig, setMenuConfig] = useState({
    // 基金管理规模
    fundManageScale: [],
    // 保险公司类型
    insureCompanyType: [],
    // 上市发债信息
    listAndBondIssueInfo: [],
    // 净利润
    netProfit: [],
    // 营业收入
    operatingRevenue: [],
    // 评级
    rate: [],
    // 注册资本
    registerCapital: [],
    // 股东类型
    stockholder: [],
    // 总资产
    totalAsset: [],
  });

  // 筛选选中的值
  const [selected, setSelected] = useImmer<Record<string, string[]>>({
    fundManageScale: [],
    insureCompanyType: [],
    listAndBondIssueInfo: [],
    netProfit: [],
    operatingRevenue: [],
    rate: [],
    registerCapital: [],
    stockholder: [],
    totalAsset: [],
  });

  // 筛选受控
  // const [value, setValue] = useState<ScreenValues>([]);

  const {
    run: getFilter,
    loading: filterLoading,
    data: filterData,
  } = useRequest<any, IBondAndInsureStat[]>(getBondAndInsureStat, {
    manual: true,
  });

  const {
    run: getList,
    loading: listLoading,
    data,
  } = useRequest<any, IBondAndInsureFinancialResourceList[]>(getBondAndInsureFinancialResourceList, {
    manual: true,
    onSuccess() {
      if (firstLoaded) {
        scrollRef?.current?.scrollIntoView({ block: 'nearest' });
      }
      if (!firstLoaded) setFirstLoaded(true);
    },
    onError() {
      setListData([]);
      updatePager((pager) => {
        pager.total = 0;
        pager.current = 1;
      });
    },
    onFinally() {
      update((d) => {
        d.firstLoading = false;
        d.noData = !data?.data && !firstLoaded;
      });
    },
  });

  // 筛选数据处理
  useEffect(() => {
    if (filterData?.data) {
      const {
        fundManageScale,
        insureCompanyType,
        listAndBondIssueInfo,
        netProfit,
        operatingRevenue,
        rate,
        registerCapital,
        stockholder,
        totalAsset,
      } = filterData.data;
      setMenuConfig({
        fundManageScale: fundManageScale || [],
        insureCompanyType: insureCompanyType || [],
        listAndBondIssueInfo: listAndBondIssueInfo || [],
        netProfit: netProfit || [],
        operatingRevenue: operatingRevenue || [],
        rate: rate || [],
        registerCapital: registerCapital || [],
        stockholder: stockholder || [],
        totalAsset: totalAsset || [],
      });
      update((d) => {
        d.noData = !firstLoaded && Object.values(filterData.data).every((item) => !item || isEmpty(item));
      });
    }
  }, [filterData, setMenuConfig, update, firstLoaded]);

  // 列表数据处理
  useEffect(() => {
    if (data?.data) {
      const { total, data: finalData } = data.data;
      setListData(finalData);
      updatePager((pager) => {
        pager.total = total;
        pager.current = skipRef.current + 1;
      });
    }
  }, [data, setListData, updatePager]);

  // 筛选
  const handleMenuChange = useMemoizedFn((_, allSelectedRows: RowItem[]) => {
    skipRef.current = 0;
    const params: Record<string, string[]> = {
      fundManageScale: [],
      insureCompanyType: [],
      listAndBondIssueInfo: [],
      netProfit: [],
      operatingRevenue: [],
      rate: [],
      registerCapital: [],
      stockholder: [],
      totalAsset: [],
    };

    allSelectedRows.forEach((selected) => {
      switch (selected.key) {
        case FilterKey.fundManageScale:
          params.fundManageScale.push(selected.value);
          break;
        case FilterKey.insureCompanyType:
          params.insureCompanyType.push(selected.value);
          break;
        case FilterKey.listAndBondIssueInfo:
          params.listAndBondIssueInfo.push(selected.value);
          break;
        case FilterKey.netProfit:
          params.netProfit.push(selected.value);
          break;
        case FilterKey.operatingRevenue:
          params.operatingRevenue.push(selected.value);
          break;
        case FilterKey.rate:
          params.rate.push(selected.value);
          break;
        case FilterKey.registerCapital:
          params.registerCapital.push(selected.value);
          break;
        case FilterKey.stockholder:
          params.stockholder.push(selected.value);
          break;
        case FilterKey.totalAsset:
          params.totalAsset.push(selected.value);
          break;
        default:
          return {};
      }
    });

    setSelected((d) => {
      d.fundManageScale = params.fundManageScale;
      d.insureCompanyType = params.insureCompanyType;
      d.listAndBondIssueInfo = params.listAndBondIssueInfo;
      d.netProfit = params.netProfit;
      d.operatingRevenue = params.operatingRevenue;
      d.rate = params.rate;
      d.registerCapital = params.registerCapital;
      d.stockholder = params.stockholder;
      d.totalAsset = params.totalAsset;
    });
  });

  // 更新筛选受控值
  // useEffect(() => {
  //   if (selected) {
  //     const config = filterConfig[pageFlag];
  //     const rebuildValues: ScreenValues = [];
  //     const moreValues: any[] = [];
  //     for (const { key, type } of config) {
  //       if (type !== ScreenType.MULTIPLE_TILING) {
  //         rebuildValues.push(selected[key]);
  //       } else {
  //         moreValues.push(...selected[key]);
  //       }
  //     }
  //     setValue(() => [...rebuildValues, moreValues]);
  //   }
  // }, [selected, pageFlag]);

  // 选中的筛选参数
  const selectParams = useMemo(() => {
    let obj = {};
    Object.entries(selected).forEach((item, index) => {
      const [key, value] = item;
      const rebuildValue = value.map((item) =>
        item.includes(`${key}${joinPrefix}`) ? item.split(`${key}${joinPrefix}`)[1] : item,
      );
      obj = { ...obj, [key]: rebuildValue.join(','), skip: 0 };
    });
    return obj;
  }, [selected]);

  // 地区参数处理
  const region = useMemo(() => {
    const rebuildRegionCode = regionCode && String(regionCode);
    if (rebuildRegionCode) {
      if (isProvince(rebuildRegionCode)) return { regionCode: rebuildRegionCode };
      if (isCity(rebuildRegionCode)) return { regionCode: rebuildRegionCode };
      if (isCounty(rebuildRegionCode)) return { regionCode: rebuildRegionCode };
    }
  }, [regionCode]);

  // 更新筛选请求参数
  useDeepCompareEffect(() => {
    if (region) {
      setFilterCondition((d) => ({
        ...d,
        ...region,
      }));
    }
  }, [region, setFilterCondition]);

  // 更新列表请求参数
  useDeepCompareEffect(() => {
    if (region && !isEmpty(selectParams)) {
      setListCondition((d) => ({
        ...d,
        ...region,
        ...selectParams,
      }));
    }
  }, [region, selectParams, setListCondition]);

  // 筛选请求发起
  useEffect(() => {
    const { regionCode } = filterCondition as IBondAndInsureStat;
    if (regionCode) {
      getFilter(filterCondition);
    }
  }, [filterCondition, getFilter]);

  // 列表请求发起
  useDeepCompareEffect(() => {
    const { regionCode } = listCondition as IBondAndInsureFinancialResourceList;
    if (regionCode) {
      getList(listCondition);
    }
  }, [listCondition, getList]);

  // 获取筛选组件配置项
  const { menuOption } = useMenu(menuConfig, pageFlag);

  const handleSearch = useMemoizedFn((keyWord: string) => {
    skipRef.current = 0;
    setFilterCondition((originState) => ({
      ...originState,
      text: keyWord,
    }));
    setListCondition((originState) => ({
      ...originState,
      skip: 0,
      text: keyWord,
    }));
  });

  const handleSort = useMemoizedFn((pagination, filters, sorter) => {
    if (isEmpty(sorter)) return;
    const { order: originOrder, field: originField } = sorter;
    skipRef.current = 0;
    const field = originField === 'enterpriseInfo' ? 'itName' : originField;
    const order = originOrder === 'ascend' ? 'asc' : originOrder === 'descend' ? 'desc' : '';
    const sort = field && order ? `${field}:${order}` : '';
    setListCondition((originState) => ({
      ...originState,
      skip: 0,
      sort,
    }));
    const containerRect = document.querySelector('.main-container')?.getBoundingClientRect(),
      elementRect = document.querySelector('.main-content-header')?.getBoundingClientRect();
    if (containerRect && elementRect) {
      // 判断标题是否在滚动容器的可视范围内
      const containerTop = containerRect.top;
      const containerBottom = containerRect.bottom;
      const elementTop = elementRect.top;
      const elementBottom = elementRect.bottom;

      const isElementVisible = elementTop >= containerTop && elementBottom <= containerBottom;
      if (isElementVisible) {
        (document.querySelector('.main-container') as HTMLElement).scrollTop = 0;
      } else {
        (document.querySelector('.main-container') as HTMLElement).scrollTop = 32;
      }
    }
  });

  const onPageChange = useMemoizedFn((current) => {
    skipRef.current = current - 1;
    setListCondition((con) => ({
      ...con,
      skip: skipRef.current * pager.pageSize,
    }));
  });

  const handleReset = useMemoizedFn(() => {
    setRenderScreen(false);
    skipRef.current = 0;
    setListCondition((originState) => {
      for (let key in originState) {
        if (resetExceptField.includes(key)) {
          continue;
        }
        if (key === 'skip') {
          originState[key] = 0;
        } else {
          // @ts-ignore
          originState[key] = '';
        }
      }
    });
    setFilterCondition((originState) => {
      for (let key in originState) {
        if (resetExceptField.includes(key)) {
          continue;
        } else {
          // @ts-ignore
          originState[key] = '';
        }
      }
    });
    requestAnimationFrame(() => {
      setRenderScreen(true);
    });
    // setValue([]);
  });

  return {
    renderScreen,
    loading: listLoading || filterLoading,
    menuOption,
    handleMenuChange,
    handleSort,
    handleSearch,
    listCondition,
    listData,
    pager,
    onPageChange,
    handleReset,
    regionName,
  };
};

export default useLogic;
