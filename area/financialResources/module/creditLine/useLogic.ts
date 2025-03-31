import { useEffect, useMemo, useRef, useState } from 'react';

import { useMemoizedFn, useRequest, useDeepCompareEffect } from 'ahooks';
import { isEmpty } from 'lodash';

import { RowItem } from '@/components/screen';
import { isCity, isCounty, isProvince } from '@/pages/area/areaEconomy/common';
import { useSelector } from '@/pages/area/areaF9/context';
import {
  getBankRegionalCreditScaleList,
  getCreditEnterpriseStat,
  ICreditEnterpriseStat,
  ICreditEnterpriseList,
} from '@/pages/area/financialResources/api';
import { Pager, detailType } from '@/pages/area/financialResources/module/common/type';
import { useImmer } from '@/utils/hooks';

import { useCtx } from '../../context';
import useMenu from './useMenu';

// 筛选默认参数，列表入参的子集
const filterDefaultParams = {
  bankType: '',
  regionCode: '',
  enterpriseType: '',
  pageFlag: 2,
  rate: '',
  sortKey: '',
  sortRule: '',
  text: '',
  year: '',
};

const listDefaultParams = {
  bankType: '',
  enterpriseType: '',
  regionCode: '',
  pageSize: 50,
  skip: 0,
  sortKey: '',
  sortRule: '',
  text: '',
  year: '',
};

const useLogic = (scrollRef?: React.RefObject<HTMLDivElement>) => {
  const { update } = useCtx();
  const [renderScreen, setRenderScreen] = useState(true);
  const [detailData, setDetailData] = useState({} as detailType);
  const [firstDataLoaded, setFirstDataLoaded] = useState(false);
  const [modalVisable, setModalVisable] = useState(false);
  const areaInfo = useSelector((store) => store.areaInfo);
  const [lastYear, setLastYear] = useState<string>(''); // 最近一年
  const [firstLoaded, setFirstLoaded] = useState(false);
  const { regionCode, regionName } = areaInfo || {};
  const skipRef = useRef(0);
  const [pager, updatePager] = useImmer<Pager>({
    current: 1,
    total: 0,
    pageSize: 50,
  });
  const [menuConfig, setMenuConfig] = useState({
    bankType: [],
    enterpriseType: [],
    reportPeriod: [],
  });
  const [listData, setListData] = useState([]);
  const [dataBanner, setDataBanner] = useState({
    creditLineNotUsed: '0.00',
    creditLineTotal: '0.00',
    creditLineUsed: '0.00',
  });
  const [filterCondition, setFilterCondition] = useState(filterDefaultParams);
  const [listCondition, setListCondition] = useImmer(listDefaultParams);
  // 筛选选中的值
  const [selected, setSelected] = useImmer<Record<string, string[]>>({
    bankType: [],
    enterpriseType: [],
    reportPeriod: [],
  });
  // 筛选受控
  // const [value, setValue] = useState<ScreenValues>([]);

  const { run: getList, loading: listLoading } = useRequest<any, ICreditEnterpriseList[]>(
    getBankRegionalCreditScaleList,
    {
      manual: true,
      onSuccess(data: any) {
        if (data?.data) {
          const { total, data: finalData, creditLineNotUsed, creditLineTotal, creditLineUsed } = data?.data || {};
          setListData(finalData || []);
          setDataBanner({
            creditLineNotUsed,
            creditLineTotal,
            creditLineUsed,
          });
          updatePager((pager) => {
            pager.total = total;
            pager.current = skipRef.current + 1;
          });
          update((d) => {
            d.noData = !firstDataLoaded && isEmpty(finalData);
          });
        }
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
    },
  );

  const {
    run: getFilter,
    loading: filterLoading,
    data: filterData,
  } = useRequest<any, ICreditEnterpriseStat[]>(getCreditEnterpriseStat, {
    manual: true,
    onSuccess() {
      if (!firstLoaded) setFirstLoaded(true);
    },
  });

  // 筛选数据处理
  useEffect(() => {
    if (filterData?.data) {
      const { bankType, reportPeriod, enterpriseType } = filterData.data;
      if (reportPeriod && reportPeriod.length > 0 && !firstLoaded) setLastYear(reportPeriod[0]?.value);
      setMenuConfig({
        bankType: bankType || [],
        enterpriseType: enterpriseType || [],
        reportPeriod: reportPeriod || [],
      });
    }
  }, [filterData, firstLoaded, setLastYear]);

  useEffect(() => {
    if (lastYear) {
      setSelected((d) => ({
        ...d,
        reportPeriod: [lastYear],
      }));
    }
  }, [lastYear, setSelected]);

  // 筛选
  const handleMenuChange = useMemoizedFn((_, allSelectedRows: RowItem[]) => {
    skipRef.current = 0;
    const params: Record<string, string[]> = {
      reportPeriod: [],
      bankType: [],
      enterpriseType: [],
    };

    allSelectedRows.forEach((selectd) => {
      switch (selectd.key) {
        case 'reportPeriod':
          params.reportPeriod.push(selectd.value);
          break;
        case 'bankType':
          params.bankType.push(selectd.value);
          break;
        case 'enterpriseType':
          params.enterpriseType.push(selectd.value);
          break;
        default:
          return {};
      }
    });

    setSelected((d) => {
      d.bankType = params.bankType;
      d.enterpriseType = params.enterpriseType;
      d.reportPeriod = isEmpty(params.reportPeriod) ? [lastYear] : params.reportPeriod;
    });
  });

  // 更新筛选受控值
  // useEffect(() => {
  //   if (selected) {
  //     const { reportPeriod, bankType } = selected;
  //     setValue(() => [reportPeriod, bankType]);
  //   }
  // }, [selected, setValue]);

  // 选中的筛选参数
  const selectParams = useMemo(() => {
    let obj = {};
    Object.entries(selected).forEach((item) => {
      const [key, value] = item;
      const rebuildKey = key === 'reportPeriod' ? 'year' : key;
      obj = { ...obj, [rebuildKey]: value.join(','), skip: 0 };
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
  useEffect(() => {
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
    const { regionCode } = filterCondition;
    if (regionCode) {
      getFilter(filterCondition);
    }
  }, [filterCondition, getFilter]);

  // 列表请求发起
  useEffect(() => {
    const { regionCode, year } = listCondition;
    if (regionCode && year) {
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

  const handleSort = useMemoizedFn((sorter) => {
    if (isEmpty(sorter)) return;
    const { key, rule } = sorter;
    skipRef.current = 0;
    setListCondition((originState) => ({
      ...originState,
      skip: 0,
      sortKey: rule ? key : '',
      sortRule: rule,
    }));
  });

  const onPageChange = useMemoizedFn((current) => {
    skipRef.current = current - 1;
    setListCondition((con) => ({
      ...con,
      skip: skipRef.current * pager.pageSize,
    }));
  });

  const handleDetail = useMemoizedFn((item: detailType) => {
    setDetailData({ ...item });
    setModalVisable(true);
  });

  const handleReset = useMemoizedFn(() => {
    setRenderScreen(false);
    skipRef.current = 0;
    setListCondition((originState) => {
      for (let key in originState) {
        if (['text', 'sortKey', 'sortRule', 'bankType'].includes(key)) {
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
    listData,
    dataBanner,
    pager,
    onPageChange,
    handleReset,
    regionName,
    modalVisable,
    detailData,
    setModalVisable,
    handleDetail,
  };
};

export default useLogic;
