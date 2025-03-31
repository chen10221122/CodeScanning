import { useEffect, useState, useRef } from 'react';

import { useMemoizedFn, useSize, useSafeState, useCreation } from 'ahooks';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';

import { useParams } from '@/pages/area/areaF9/hooks/useParams';
import { getCensusAnalyseTabData /**clearValue */ } from '@/pages/finance/financingLeaseNew/modules/censusAnalyse/api';
import { ChangeFilter, isMac } from '@/pages/finance/financingLeaseNew/modules/censusAnalyse/config';
import { useDispatch, useSelector } from '@/pages/finance/financingLeaseNew/modules/censusAnalyse/context';
import {
  AreaKeyMap,
  IndustryKeyMap,
} from '@/pages/finance/financingLeaseNew/modules/censusAnalyse/hooks/useGetAllScreenOption';
import useRequest from '@/utils/ahooks/useRequest';
import { scrollTo } from '@/utils/animate';
import { useImmer } from '@/utils/hooks';

interface Props {
  /** 接口初始化请求参数 */
  initParams: Record<string, any>;
}

/** 头部高度 */
const HEADER_HEIGHT = 36;

export default function useHandleTableData({ initParams }: Props) {
  const { regionCode } = useParams();
  /** 筛选ref */
  const screenRef = useRef();
  /** 当前搜索关键词*/
  const keywordRef = useRef('');
  /** 表格请求参数 */
  const [tableParamsData, update] = useImmer({ requestParams: initParams });
  /** 表格数据总量*/
  const [total, setTotal] = useState(0);
  /** 当前页码数*/
  const [curentPage, setCurentPage] = useState(1);
  /** 是否首次加载 */
  const [firstLoading, setFirstLoading] = useState(true);
  const [renderFilter, setRenderFilter] = useSafeState(true);
  /** 当前排序的信息 */
  const [currentSort, setCurrentSort] = useState<{ key: string; rule: string; value: string }>({
    key: '',
    value: '',
    rule: '',
  });

  const dispatch = useDispatch();

  const {
    run,
    data: tableResultData,
    loading,
    // error,
  } = useRequest<any>(getCensusAnalyseTabData, {
    manual: true,
    onSuccess(res) {
      setFirstLoading(false);
      setTotal(res?.data?.total);
    },
    onError(err: any) {
      setTotal(0);
      setFirstLoading(false);
    },
  });

  useEffect(() => {
    if (regionCode) {
      run({ ...tableParamsData.requestParams });
    }
  }, [regionCode, run, tableParamsData]);

  /** 筛选表头动态高度，将此传给table的headFixedPosition */
  const { height: _debounceScreenHeadHeight } = useSize(screenRef) || {};

  const debounceScreenHeadHeight = useCreation(() => {
    if (_debounceScreenHeadHeight) {
      return isMac() ? _debounceScreenHeadHeight - 1 : _debounceScreenHeadHeight;
    } else {
      return undefined;
    }
  }, [_debounceScreenHeadHeight]);

  /** 更新表格入参公用方法 */
  const updateIntegration = (com: any) => {
    scrollToTop();
    setCurentPage(1);
    update?.((data: any) => {
      data.requestParams = { ...data.requestParams, ...com, from: 0 };
    });
  };

  /** 滚动到头部事件 */
  const scrollToTop = useMemoizedFn(() => {
    scrollTo(HEADER_HEIGHT, {
      getContainer: () => document.querySelector('#areaF9censusAnalyseMountedId') as HTMLElement,
      duration: 0, //滚动直接变，不要动画
    });
  });

  /** 去除末尾逗号或者分号 */
  const trimComma = (o: Record<string, string>) => {
    const obj = cloneDeep(o);
    Object.keys(obj).forEach((i) => {
      // 使用正则表达式匹配末尾的逗号和分号，直接替换为空字符串
      obj[i] = obj[i].replace(/[,;]*$/, '');
    });
    return obj;
  };

  /** 递归地区和行业树，转化成接口需要的格式 */
  const recursion = useMemoizedFn((data: Record<string, any>[], type: ChangeFilter) => {
    // 初始化返回的对象
    const result: Record<string, any> =
      type === ChangeFilter.AREA
        ? {
            regionCode: '',
            cityCode: '',
            countryCode: '',
          }
        : {
            industryCode: '',
            secondIndustryCode: '',
          };

    // 循环处理每一级节点
    data.forEach((item) => {
      const key = (type === ChangeFilter.AREA ? AreaKeyMap : IndustryKeyMap)[item?.areaLevel || item?.level];
      result[key] = (result[key] ?? '') + `${item.value},`;
      if (item?.children?.length) {
        // 递归处理子节点
        recursion(item.children, type);
      }
    });

    return result;
  });

  const setKeyword = useMemoizedFn((value) => {
    keywordRef.current = value;
    updateIntegration({ text: keywordRef.current });
  });

  const updateIntegrationWithKey = useMemoizedFn((key, currentValue) => {
    const values = { [key]: currentValue.map((o: Record<string, any>) => o?.value).toString() };
    updateIntegration(values);
  });

  const updateIntegrationWithDateRange = useMemoizedFn((keys, value) => {
    const [start, end] = value;
    const pickerFormat = 'YYYY-MM-DD';
    const dateRange = {
      [`${keys[0]}From`]: dayjs(start).format(pickerFormat),
      [`${keys[0]}To`]: dayjs(end).format(pickerFormat),
    };
    updateIntegration(dateRange);
  });

  /** 各类事件汇总 */
  const handleFilterChange = useMemoizedFn((type, currentValue) => {
    /** 各类事件对应的筛选改变，更新当前筛选的高亮状态 */
    dispatch((d) => {
      d.activeAll[type] = !!currentValue?.length;
    });

    const updateAreaOrIndustry = (value: Array<any>) => {
      const result = trimComma(recursion(value, type));
      updateIntegration(result);
    };

    const handlers: Record<number, () => void> = {
      [ChangeFilter.SEARCH]: () => setKeyword(currentValue),
      [ChangeFilter.SEARCH_CLEAR]: () => setKeyword(''),
      [ChangeFilter.LESSEE_TYPE]: () => updateIntegrationWithKey('lesseeType', currentValue),
      [ChangeFilter.LESSOR_TYPE]: () => updateIntegrationWithKey('leaserType', currentValue),
      [ChangeFilter.LESSOR_NATURE]: () => updateIntegrationWithKey('leaserProperty', currentValue),
      [ChangeFilter.LISTING_BONDISSUANCE]: () => updateIntegrationWithKey('enterpriseType', currentValue),
      [ChangeFilter.AREA]: () => updateAreaOrIndustry(currentValue),
      [ChangeFilter.INDUSTRY]: () => updateAreaOrIndustry(currentValue),
      [ChangeFilter.DISCLOSURE_DATE]: () => updateIntegrationWithDateRange(['registerStartDate'], currentValue),
      [ChangeFilter.REGISTRATE_DUE_DATE]: () => updateIntegrationWithDateRange(['endDate'], currentValue),
      [ChangeFilter.EXPIRATION_EVENT]: () => {
        const containExpire = currentValue?.target?.checked ? '1' : '0';
        updateIntegration({ containExpire });
      },
      [ChangeFilter.PAGE_CHANGE]: () => {
        setCurentPage(currentValue);
        scrollToTop();
        update?.((data: any) => {
          data.requestParams = {
            ...data.requestParams,
            from: String(currentValue ? (currentValue - 1) * 50 : 0),
          };
        });
      },
      [ChangeFilter.SORT]: () =>
        updateIntegration({
          sortKey: currentValue?.key,
          sortType: currentValue?.rule,
        }),
    };

    handlers[type]?.();
  });

  const handleFilterChangeMemo = useMemoizedFn((filterType: ChangeFilter) => (value: any) => {
    handleFilterChange(filterType, value);
  });

  const activeAllStates = useSelector((state) => state.activeAll);

  /** 清除筛选项事件 */
  const clearCurrentFilter = useMemoizedFn(() => {
    setRenderFilter(false);
    /** 清除筛选高亮状态 */
    dispatch((d) => {
      const activeAllCopy = cloneDeep(activeAllStates);
      Object.keys(activeAllCopy).forEach((key) => {
        activeAllCopy[key] = false;
      });
      d.activeAll = activeAllCopy;
    });

    /** 清除筛选入参，注意：需要排除某些入参，'dimension', 'statisticType'是必须要的 */
    // const paramsCopy = cloneDeep(tableParamsData);
    // clearValue(paramsCopy?.requestParams, ['dimension', 'statisticType']);

    requestAnimationFrame(() => {
      setRenderFilter(true);
      update((data: any) => {
        data.requestParams = {
          ...initParams,
          from: 0,
          size: 50,
        };
      });
    });
  });

  return {
    total,
    loading,
    screenRef,
    keywordRef,
    curentPage,
    currentSort,
    firstLoading,
    renderFilter,
    tableParamsData,
    tableResultData,
    setCurrentSort,
    updateIntegration,
    clearCurrentFilter,
    handleFilterChangeMemo,
    debounceScreenHeadHeight: debounceScreenHeadHeight ? debounceScreenHeadHeight + 43 : 0,
  };
}
