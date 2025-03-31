import { useEffect, useState, useRef } from 'react';

import { isUndefined } from 'lodash';

import { isCity, isProvince, isCounty } from '@/pages/area/areaEconomy/common';
import { getListData } from '@/pages/area/areaEconomy/modules/blackList/apis';
import { PAGESIZE, TabEnum } from '@/pages/area/areaEconomy/modules/blackList/constant';
import { useCtx } from '@/pages/area/areaEconomy/provider/getContext';
import useRequest from '@/utils/ahooks/useRequest';

export { PAGESIZE } from '@/pages/area/areaEconomy/modules/blackList/constant';

export const defaultParams: ConditionProps = {
  pageSize: PAGESIZE,
  skip: 0,
  sort: 'DeclareDate:desc,ITNamePinyinInitial:asc',
};

export interface ConditionProps {
  pageSize: number;
  skip: number;
  sort: string;
  [key: string]: any;
}

export const useGetListData = (params: ConditionProps, activeTab: TabEnum, isTableDetail?: boolean) => {
  const [listTotalCount, setListTotalCount] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [hasData, setHasData] = useState(true);
  const paramsRef = useRef<Record<string, any>>();
  const regionCodeRef = useRef<{
    regionCode1: string;
    regionCode2: string;
    regionCode3: string;
  }>();
  const {
    state: { code: regionCode },
  } = useCtx();

  // 获取列表数据
  const {
    data: tableData,
    run,
    loading,
    error,
  } = useRequest(getListData, {
    manual: true,
    formatResult(res: any) {
      setLoadingStatus(true);
      const data = res.data ? res.data : {};
      setHasData(!!data?.list?.length);
      if (!isUndefined(data.totalSize)) {
        setListTotalCount(data.totalSize);
      }
      return data;
    },
    onError(err) {
      setLoadingStatus(true);
    },
  });

  // 地区变化
  useEffect(() => {
    const region = {
      regionCode1: '',
      regionCode2: '',
      regionCode3: '',
    };
    switch (true) {
      case isProvince(regionCode):
        region.regionCode1 = regionCode;
        break;
      case isCity(regionCode):
        region.regionCode2 = regionCode;
        break;
      case isCounty(regionCode):
        region.regionCode3 = regionCode;
        break;
      default:
    }
    if (regionCode && JSON.stringify(region) !== JSON.stringify(regionCodeRef.current)) {
      regionCodeRef.current = region;
      setLoadingStatus(false);
      // 如果是弹窗详情，就不需要 region 的信息
      const paramsInfo = isTableDetail ? params : { ...params, ...region };
      run(paramsInfo);
    }
  }, [params, regionCode, run, isTableDetail]);

  // 参数变化发送请求
  useEffect(() => {
    if (params && JSON.stringify(paramsRef.current) !== JSON.stringify(params) && activeTab === TabEnum.List) {
      paramsRef.current = params;

      setLoadingStatus(false);
      // 如果是弹窗详情，就不需要 region 的信息
      const paramsInfo = isTableDetail ? params : { ...params, ...regionCodeRef.current };
      run(paramsInfo);
    }
  }, [run, params, activeTab, isTableDetail]);

  return {
    tableData,
    listTotalCount,
    loading,
    error,
    run,
    loadingStatus,
    hasData,
  };
};
