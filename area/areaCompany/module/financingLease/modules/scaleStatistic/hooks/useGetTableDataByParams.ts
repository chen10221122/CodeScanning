import { useEffect, useRef, useState } from 'react';

import { useCreation, useMemoizedFn, useRequest, useSize } from 'ahooks';
import { cloneDeep } from 'lodash';

import { scrollTo } from '@/utils/animate';
import { useImmer } from '@/utils/hooks';
import { triggerWindowResize } from '@/utils/share';

import { getCensusAnalyseTabData } from '../api';
import { isMac } from '../config';
import { AreaKeyMap, IndustryKeyMap } from './useGetAllScreenOption';

/** 头部高度 */
const HEADER_HEIGHT = 36;

type Props = {
  initParams: any;
};

export const useTableDataByParams = ({ initParams }: Props) => {
  /** 表格请求参数 */
  const [tableParamsData, update] = useImmer({ requestParams: initParams });
  /** 表格数据总量*/
  const [total, setTotal] = useState(0);
  /** 当前页码数*/
  const [currentPage, setCurrentPage] = useState(1);
  /** 是否首次加载 */
  const [firstLoading, setFirstLoading] = useState(true);
  /** screenKey */
  const [screenKey, setScreenKey] = useState(1);
  /** screenRef */
  const screenRef = useRef();
  /** 筛选表头动态高度，将此传给table的headFixedPosition */
  const { height: _debounceScreenHeadHeight } = useSize(screenRef) || {};

  const debounceScreenHeadHeight = useCreation(() => {
    if (_debounceScreenHeadHeight) {
      return isMac() ? _debounceScreenHeadHeight - 1 : _debounceScreenHeadHeight;
    } else {
      return undefined;
    }
  }, [_debounceScreenHeadHeight]);

  /** 滚动到头部事件 */
  const scrollToTop = useMemoizedFn(() => {
    scrollTo(HEADER_HEIGHT, {
      getContainer: () => document.querySelector('.main-scroll-body') as HTMLElement,
      duration: 0, //滚动直接变，不要动画
    });
  });

  const resetTableParams = useMemoizedFn((params) => {
    scrollToTop();
    setCurrentPage(1);
    update?.((data: any) => {
      data.requestParams = { ...params };
    });
    setScreenKey(screenKey + 1);
  });

  /** 更新表格入参公用方法 */
  const updateIntegration = (com: any) => {
    scrollToTop();
    setCurrentPage(1);
    update?.((data: any) => {
      data.requestParams = { ...data.requestParams, ...com, from: 0 };
    });
  };

  useEffect(() => {
    scrollToTop();
  }, [currentPage, scrollToTop]);

  const { run, data, loading } = useRequest(getCensusAnalyseTabData, {
    manual: true,
    onSuccess(res) {
      setFirstLoading(false);
      setTotal((res as any).data?.total);
      setTimeout(() => {
        triggerWindowResize();
      }, 100);
    },
    onError(err: any) {
      setTotal(0);
      setFirstLoading(false);
    },
  });

  useEffect(() => {
    run({ ...tableParamsData.requestParams, from: String(currentPage ? (currentPage - 1) * 50 : 0) });
  }, [run, tableParamsData, currentPage]);

  return {
    run,
    data,
    tableParamsData,
    loading,
    total,
    currentPage,
    setCurrentPage,
    updateIntegration,
    firstLoading,
    resetTableParams,
    screenKey,
    screenRef,
    debounceScreenHeadHeight,
  };
};

export const trimComma = (o: Record<string, string>) => {
  const obj = cloneDeep(o);
  Object.keys(obj).forEach((i) => {
    // 使用正则表达式匹配末尾的逗号和分号，直接替换为空字符串
    obj[i] = obj[i].replace(/[,;]*$/, '');
  });
  return obj;
};

/** 递归地区和行业树，转化成接口需要的格式 */
export const recursion = (data: Record<string, any>[], type: 'area' | 'industry') => {
  // 初始化返回的对象
  const result: Record<string, any> =
    type === 'area'
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
    const key = (type === 'area' ? AreaKeyMap : IndustryKeyMap)[item?.level ?? item?.areaLevel];
    result[key] = (result[key] ?? '') + `${item.value},`;
    if (item?.children?.length) {
      // 递归处理子节点
      recursion(item.children, type);
    }
  });

  return result;
};
