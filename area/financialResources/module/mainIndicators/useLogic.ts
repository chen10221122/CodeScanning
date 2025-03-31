import { useEffect, useMemo, useRef, useState } from 'react';

import { useDeepCompareEffect, useMemoizedFn, useRequest } from 'ahooks';
import { head, isEmpty } from 'lodash';

import { RowItem } from '@/components/screen';
import { isCity, isCounty, isProvince } from '@/pages/area/areaEconomy/common';
import { useSelector } from '@/pages/area/areaF9/context';
import {
  LocalBankMainFIListParams,
  LocalBankMainFIStat,
  getLocalBankMainFinancialIndicList,
  getLocalBankMainFinancialIndicStat,
} from '@/pages/area/financialResources/api';
import { Pager } from '@/pages/area/financialResources/module/common/type';
import { useImmer } from '@/utils/hooks';

import { useCtx } from '../../context';
import useMenu from './useMenu';

// 筛选默认参数，列表入参的子集
const filterDefaultParams = {
  bankType: '',
  cityCode: '',
  countyCode: '',
  provinceCode: '',
  regionCode: '',
  reportDateType: '',
  indicNames: '',
  text: '',
  year: '',
};

const listDefaultParams = {
  hiddenBlankRow: false,
  hiddenRanking: false,
  indicNames: '',
  pageSize: 50,
  skip: 0,
  sort: '',
};

const useLogic = (
  hiddenChecked: { hiddenBlankRow: boolean; hiddenRanking: boolean },
  scrollRef?: React.RefObject<HTMLDivElement>,
) => {
  const [renderScreen, setRenderScreen] = useState(true);
  const { update } = useCtx();
  const [lastYear, setLastYear] = useState('');
  const areaInfo = useSelector((store) => store.areaInfo);
  const [firstDataLoaded, setFirstDataLoaded] = useState(false);
  const [firstLoaded, setFirstLoaded] = useState(false);
  const { regionCode, regionName } = areaInfo || {};
  const skipRef = useRef(0);
  const [pager, updatePager] = useImmer<Pager>({
    current: 1,
    total: 0,
    pageSize: 50,
  });
  const [menuConfig, setMenuConfig] = useState({
    year: [],
    reportDateType: [],
    bankType: [],
  });
  const [listData, setListData] = useState([]);
  const [filterLoading, setFilterLoading] = useState(true);
  const [filterCondition, setFilterCondition] = useImmer(filterDefaultParams);
  const [listCondition, setListCondition] = useImmer({
    ...filterDefaultParams,
    ...listDefaultParams,
    ...hiddenChecked,
  });
  // 筛选选中的值
  const [selected, setSelected] = useImmer<Record<string, string[]>>({
    year: [],
    reportDateType: [],
    bankType: [],
  });
  // 筛选受控
  // const [value, setValue] = useState<ScreenValues>([]);

  const {
    run: getList,
    loading: listLoading,
    data,
  } = useRequest<any, LocalBankMainFIListParams[]>(getLocalBankMainFinancialIndicList, {
    manual: true,
    onSuccess() {
      if (firstDataLoaded) {
        scrollRef?.current?.scrollIntoView({ block: 'nearest' });
      }
      if (!firstDataLoaded) setFirstDataLoaded(true);
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
      });
    },
  });

  const { run: getFilter } = useRequest<any, LocalBankMainFIStat[]>(getLocalBankMainFinancialIndicStat, {
    manual: true,
    onSuccess(data: any) {
      if (data?.data) {
        const { year, reportDateType, bankType } = data.data;
        if (!firstLoaded) {
          setMenuConfig({
            year: year?.map((item: any) => ({ ...item, name: item.key })) || [],
            reportDateType: reportDateType || [],
            bankType: bankType || [],
          });
          setFilterCondition((originState) => ({ ...originState, reportDateType: '4' }));
          setFirstLoaded(true);
        } else {
          const lastYear = year && !isEmpty(year) ? head(year as any[])?.key : '';
          setLastYear(lastYear);
          setFilterLoading(false);
        }
      }
    },
    onFinally(params: any, data: any) {
      update((d) => {
        d.firstLoading = false;
      });
      if (!data?.data || isEmpty(data.data))
        update((d) => {
          d.noData = true;
        });
    },
  });

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
      year: [],
      reportDateType: [],
      bankType: [],
    };

    allSelectedRows.forEach((selectd) => {
      switch (selectd.key) {
        case 'year':
          params.year.push(selectd.value);
          break;
        case 'reportDateType':
          params.reportDateType.push(selectd.value);
          break;
        case 'bankType':
          params.bankType.push(selectd.value);
          break;
        default:
          return {};
      }
    });

    setSelected((d) => {
      d.year = params.year;
      d.reportDateType = params.reportDateType;
      d.bankType = params.bankType;
    });
  });

  // 更新筛选受控值
  // useEffect(() => {
  //   if (selected) {
  //     const { year, reportDateType, bankType } = selected;
  //     setValue(() => [year, reportDateType, bankType]);
  //   }
  // }, [selected, setValue]);

  // 选中的筛选参数
  const selectParams = useMemo(() => {
    let obj = {};
    Object.entries(selected).forEach((item) => {
      const [key, value] = item;
      obj = { ...obj, [key]: value.join(','), skip: 0 };
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
    if (region) {
      setListCondition((d) => ({
        ...d,
        ...region,
        ...hiddenChecked,
        ...selectParams,
      }));
    }
  }, [region, hiddenChecked, selectParams, setListCondition]);

  // 筛选请求发起
  useDeepCompareEffect(() => {
    const { regionCode } = filterCondition;
    if (regionCode) {
      getFilter(filterCondition);
    }
  }, [filterCondition, getFilter]);

  // 列表请求发起
  useDeepCompareEffect(() => {
    const { regionCode, reportDateType } = listCondition;
    if (regionCode && reportDateType) {
      getList(listCondition);
    }
  }, [listCondition, getList]);

  // 获取筛选组件配置项
  const { menuOption } = useMenu(menuConfig, lastYear);

  const handleSearch = useMemoizedFn((keyWord: string) => {
    skipRef.current = 0;
    setListCondition((originState) => ({
      ...originState,
      skip: 0,
      text: keyWord,
    }));
  });

  const handleSort = useMemoizedFn((pagination, filters, sorter) => {
    if (isEmpty(sorter)) return;
    const { order: originOrder, field, columnKey } = sorter;
    const suffix = columnKey === `${field}_rank` ? '_rank' : '';
    skipRef.current = 0;
    const order = originOrder === 'ascend' ? 'asc' : originOrder === 'descend' ? 'desc' : '';
    const sort = order ? `${field === 'enterpriseInfo' ? 'itName' : field}${suffix}:${order}` : '';
    setListCondition((originState) => ({
      ...originState,
      skip: 0,
      sort,
    }));
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
        if (['text', 'sort'].includes(key)) {
          //@ts-ignore
          originState[key] = '';
        }
        if ('skip' === key) {
          originState.skip = 0;
        }
      }
    });
    requestAnimationFrame(() => {
      setRenderScreen(true);
    });
  });

  return {
    renderScreen,
    loading: listLoading || filterLoading,
    menuOption,
    handleMenuChange,
    handleSort,
    handleSearch,
    listCondition,
    getLocalBankMainFinancialIndicList,
    listData,
    pager,
    onPageChange,
    handleReset,
    regionName,
  };
};

export default useLogic;
