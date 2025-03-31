import { useEffect, useMemo, useRef, useState } from 'react';

import { useDeepCompareEffect, useMemoizedFn, useRequest } from 'ahooks';
import { isEmpty } from 'lodash';

import { RowItem } from '@/components/screen';
import {
  getCreditEnterpriseStat,
  ICreditEnterpriseStat,
  getDebtIssuerDetail,
  IDebtIssuerDetail,
} from '@/pages/area/financialResources/api';
import { Pager, detailType } from '@/pages/area/financialResources/module/common/type';
import { useImmer } from '@/utils/hooks';

import useMenu from './useMenu';

// 筛选默认参数，列表入参的子集
const filterDefaultParams = {
  regionCode: '',
  enterpriseType: '',
  pageFlag: 3,
  rate: '',
  sortKey: '',
  sortRule: '',
  text: '',
  year: '',
};

const listDefaultParams = {
  enterpriseType: '',
  regionCode: '',
  creditLimit: '',
  itCode2: '',
  pageSize: 50,
  rate: '',
  sortKey: '',
  sortRule: '',
  skip: 0,
  text: '',
  year: '',
};

const useLogic = (region: any, itCode: string, year: string, enterpriseType: string) => {
  const ref = useRef<HTMLDivElement>(null);
  const [renderScreen, setRenderScreen] = useState(true);
  const [filterNoData, setFilterNoData] = useState(false);
  const [detailData, setDetailData] = useState({} as detailType);
  const [modalVisable, setModalVisable] = useState(false);
  const [firstLoaded, setFirstLoaded] = useState(false);
  const skipRef = useRef(0);
  const [pager, updatePager] = useImmer<Pager>({
    current: 1,
    total: 0,
    pageSize: 50,
  });
  const sortInfo = useRef<{ key: string; order: string }>({ key: '', order: '' });
  const [menuConfig, setMenuConfig] = useState({
    creditLimit: [],
    rate: [],
  });
  const [listData, setListData] = useState([]);
  const [filterCondition, setFilterCondition] = useState({ ...filterDefaultParams, enterpriseType });
  const [listCondition, setListCondition] = useState({ ...listDefaultParams, enterpriseType });
  // 筛选选中的值
  const [selected, setSelected] = useImmer<Record<string, string[]>>({
    creditLimit: [],
    rate: [],
  });
  // 筛选受控
  // const [value, setValue] = useState<ScreenValues>([]);

  const { run: getList, loading: listLoading } = useRequest<any, IDebtIssuerDetail[]>(getDebtIssuerDetail, {
    manual: true,
    // debounceWait: 300,
    onSuccess(data: any) {
      if (data?.data) {
        const { total, data: finalData } = data.data;
        setListData(finalData || []);
        updatePager((pager) => {
          pager.total = total;
          pager.current = skipRef.current + 1;
        });
        setFilterNoData(firstLoaded && isEmpty(finalData));
      }
    },
    onFinally() {
      if (!firstLoaded) setFirstLoaded(true);
    },
  });

  const { run: getFilter } = useRequest<any, ICreditEnterpriseStat[]>(getCreditEnterpriseStat, {
    manual: true,
    onSuccess(data: any) {
      if (data?.data) {
        const { creditLimit, rate } = data.data;
        setMenuConfig({
          creditLimit: creditLimit || [],
          rate: rate || [],
        });
      }
    },
  });

  // 筛选
  const handleMenuChange = useMemoizedFn((_, allSelectedRows: RowItem[]) => {
    skipRef.current = 0;
    const params: Record<string, string[]> = {
      creditLimit: [],
      rate: [],
    };

    allSelectedRows.forEach((selectd) => {
      switch (selectd.key) {
        case 'creditLimit':
          params.creditLimit.push(selectd.value);
          break;
        case 'rate':
          params.rate.push(selectd.value);
          break;
        default:
          return {};
      }
    });

    setSelected((d) => {
      d.creditLimit = params.creditLimit;
      d.rate = params.rate;
    });
  });

  // 更新筛选受控值
  // useDeepCompareEffect(() => {
  //   if (selected) {
  //     const { creditLimit, rate } = selected;
  //     setValue(() => [creditLimit, rate]);
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

  // 更新筛选请求参数
  useDeepCompareEffect(() => {
    if (region && year && itCode) {
      setFilterCondition((d) => ({
        ...d,
        ...region,
        itCode2: itCode,
        year,
      }));
    }
  }, [itCode, region, setFilterCondition]);

  // 更新列表请求参数
  useDeepCompareEffect(() => {
    if (region && itCode && year) {
      setListCondition((d) => ({
        ...d,
        ...region,
        itCode2: itCode,
        ...selectParams,
        year,
      }));
    }
  }, [itCode, region, selectParams, year, setListCondition]);

  // 筛选请求发起
  useEffect(() => {
    const { regionCode } = filterCondition;
    if (regionCode) {
      getFilter(filterCondition);
    }
  }, [filterCondition, getFilter]);

  // 列表请求发起
  useDeepCompareEffect(() => {
    const { regionCode, itCode2 } = listCondition;
    if (regionCode && itCode2) {
      getList(listCondition);
    }
  }, [listCondition, getList]);

  // 获取筛选组件配置项
  const { menuOption } = useMenu(menuConfig);

  const handleSearch = useMemoizedFn((keyWord: string) => {
    skipRef.current = 0;
    setListCondition((originState) => ({
      ...originState,
      skip: 0,
      text: keyWord,
    }));
  });

  const onPageChange = useMemoizedFn((current) => {
    if (ref.current) {
      ref.current.scrollTop = 0;
    }
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

  const handleChange = useMemoizedFn((pagination, filters, sorter) => {
    if (isEmpty(sorter)) return;
    const { order: originOrder, columnKey } = sorter;
    if (sortInfo.current.order !== originOrder || sortInfo.current.key !== columnKey) {
      sortInfo.current.key = columnKey;
      sortInfo.current.order = originOrder;
      skipRef.current = 0;
    }
    const order = originOrder === 'ascend' ? 'asc' : originOrder === 'descend' ? 'desc' : '';
    setListCondition((originState) => ({
      ...originState,
      skip: skipRef.current * pager.pageSize,
      sortKey: order ? columnKey : '',
      sortRule: order,
    }));
  });

  const handleReset = useMemoizedFn(() => {
    setRenderScreen(false);
    skipRef.current = 0;
    setListCondition((d) => ({ ...d, skip: 0, text: '', sortKey: '', sortRule: '', creditLimit: '', rate: '' }));
    requestAnimationFrame(() => {
      setRenderScreen(true);
    });
  });

  return {
    renderScreen,
    filterNoData,
    loading: listLoading,
    firstLoaded,
    menuOption,
    handleMenuChange,
    handleSearch,
    condition: listCondition,
    listData,
    pager,
    onPageChange,
    handleChange,
    handleDetail,
    detailData,
    modalVisable,
    setModalVisable,
    handleReset,
    ref,
  };
};

export default useLogic;
