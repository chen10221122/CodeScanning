import { useEffect, useState, useMemo } from 'react';

import { useMemoizedFn } from 'ahooks';
import cloneDeep from 'lodash/cloneDeep';

import { useCtx } from '@/pages/area/areaEconomy/provider/getContext';
import { getAreaOpinionData } from '@/pages/detail/modules/bond/areaCastleThrow/api';
import useRequest from '@/utils/ahooks/useRequest';
const PAGESIZE = 12;
const useDatas = () => {
  const { state } = useCtx();

  const [firstLoading, setFirstLoading] = useState(true);
  const [skip, setSkip] = useState(1);
  // const [HeightIsAuto, setHeightIsAuto] = useState(false); // 是否重置高度
  // 分页的加载状态
  const [pageLoading, setPageLoading] = useState(false);
  const [params, updateParams] = useState({
    areaCode: state.code,
    areaFlag: true, // 是否为地区查询
    ratingDateStart: '', // 评级时间
    ratingDateEnd: '', // 评级时间
    viewpointNature: '', // 观点性质 1正面；2负面；3关注；4主要观点；5展望
    viewpointSource: '0', // 观点来源 0 不限；1 评级机构；2 第三方机构
    skip: 0,
    pageSize: 9999,
  });
  const {
    data: opinionData,
    loading: opinionLoading,
    run,
    error,
  } = useRequest(getAreaOpinionData, {
    manual: true,
    formatResult: (res) => res?.data || {},
    onSuccess: () => {
      setFirstLoading(false);
    },
    onError: () => {
      setFirstLoading(false);
    },
  });

  useEffect(() => {
    run({ ...params, areaCode: state.code });
  }, [run, params, state.code]);

  /** 分页数据 */
  const dataList = useMemo(() => {
    if (opinionData?.viewpointOrganList?.length) {
      if (skip * PAGESIZE >= opinionData?.viewpointOrganList?.length) {
        return opinionData?.viewpointOrganList;
      }
      const cloneData = cloneDeep(opinionData?.viewpointOrganList);
      return cloneData.splice(0, skip * PAGESIZE);
    } else return [];
  }, [skip, opinionData]);

  /** 滚动加载 */
  const handleLoadMore = useMemoizedFn(() => {
    setPageLoading(true);
    // setHeightIsAuto && setHeightIsAuto(true);
    const timer = setTimeout(() => {
      setPageLoading(false);
      if (Math.ceil(opinionData?.viewpointOrganList?.length / PAGESIZE) > skip) setSkip(skip + 1);
    }, 300);
    return () => {
      if (timer) clearTimeout(timer);
    };
  });

  /** 筛选 */
  const onScreenChange = (v1, v2) => {
    // console.log('v1==', v1, 'v2==', v2);
    // 观点来源入参处理成只有一个选项，不选或全选传空字符串
    const sourceArr = v2.filter((d) => d.key === 'viewpointSource');
    const viewpointSource = sourceArr.length === 1 ? sourceArr[0].value : '0';
    // 观点年份
    const yearArr = v2.filter((d) => d.key === 'yearDate');
    const yearDate = yearArr[0]?.value || '';
    const obj = {
      ...params,
      viewpointSource,
      ratingDateStart: yearDate ? yearDate + '-01-01' : '', // 评级时间
      ratingDateEnd: yearDate ? yearDate + '-12-31' : '', // 评级时间
    };
    updateParams(obj);
  };

  const resetChange = useMemoizedFn(() => {
    onScreenChange(null, []);
  });

  // 判断是否有搜索条件
  const hasCondition = useMemo(() => !!params.ratingDateStart || !!+params.viewpointSource, [params]);

  return {
    opinionData,
    dataList,
    firstLoading,
    opinionLoading,
    pageLoading,
    error,
    onScreenChange,
    handleLoadMore,
    hasCondition,
    resetChange,
  };
};
export default useDatas;
