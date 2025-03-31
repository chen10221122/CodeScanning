import { useEffect, useRef, useState, useMemo } from 'react';

import { useMemoizedFn } from 'ahooks';

import { useSelector } from '@pages/area/areaF9/context';
import { useParams } from '@pages/area/areaF9/hooks';

// import { getAreaModel } from '@/apis/area/areaEconomy';
import { getComprehensiveScore, getHistoryScore, getDetailMsg, getAreaScoreInitYear } from '@/apis/area/areaEconomy';
import useRequest from '@/utils/ahooks/useRequest';

// const defaultCondition = {
//   regionRange: 0,
//   year: currentYearString,
// };

export default function useScore() {
  const [modelInfo, setModelInfo] = useState({});
  // const [year, setYear] = useState(null);
  // const [rankType, setRankType] = useState(0);
  const cloneParamsCondition = useRef(null);

  const { code } = useParams();
  const codeRef = useRef(code);
  const areaInfo = useSelector((store) => store.areaInfo);

  const {
    data: initYear,
    loading: yearLoading,
    run: getYear,
  } = useRequest(() => getAreaScoreInitYear(code), {
    manual: true,
    onFinally() {},
  });

  const haveDataYear = useMemo(() => {
    return initYear?.data;
  }, [initYear?.data]);

  const defaultCondition = useMemo(() => {
    return { regionRange: 0, year: haveDataYear };
  }, [haveDataYear]);

  const [condition, setCondition] = useState(defaultCondition);

  const paramsCondition = useMemo(() => {
    return {
      regionCode: codeRef.current,
      ...condition,
    };
  }, [condition]);

  useEffect(() => {
    if (haveDataYear) {
      setCondition((d) => ({
        ...d,
        year: haveDataYear,
      }));
      // 更新筛选项
    }
  }, [haveDataYear]);

  const {
    data: modelInfoData,
    run: getModelInfo,
    loading: modelInfoPending,
  } = useRequest(getComprehensiveScore, {
    manual: true,
  });

  const screenRankChange = useMemoizedFn((cur) => {
    // console.log('cur[0].value===', cur);
    setCondition((d) => ({
      ...d,
      regionRange: cur.length === 0 ? 0 : cur[0].value,
    }));
  });

  const screenYearChange = useMemoizedFn((cur) => {
    if (haveDataYear) {
      setCondition((d) => ({
        ...d,
        year: cur.length === 0 ? haveDataYear : cur[0].value,
      }));
    }
  });

  useEffect(() => {
    codeRef.current = code;
    if (code) {
      getYear();
    }
  }, [code, getYear]);

  useEffect(() => {
    // 当 code 存在的时候才去请求，否则就会请求到默认上海的数据，是有问题的
    if (
      codeRef.current &&
      JSON.stringify(cloneParamsCondition.current) !== JSON.stringify(paramsCondition) &&
      paramsCondition.year
    ) {
      getModelInfo(paramsCondition);
      cloneParamsCondition.current = paramsCondition;
    }
  }, [getModelInfo, haveDataYear, paramsCondition]);

  useEffect(() => {
    if (modelInfoData?.data) {
      setModelInfo(modelInfoData.data);
    }
  }, [modelInfoData]);

  const {
    data: historyData,
    run: getHistoryInfo,
    loading: historyLoading,
  } = useRequest(getHistoryScore, {
    manual: true,
  });

  useEffect(() => {
    if (codeRef.current) {
      getHistoryInfo({ regionCode: codeRef.current });
    }
  }, [getHistoryInfo]);

  const {
    error: detailError,
    data: detailData,
    run: getDetail,
    loading: detailLoading,
  } = useRequest(getDetailMsg, {
    manual: true,
  });

  useEffect(() => {
    if (codeRef.current && condition.year) {
      getDetail({ regionCode: codeRef.current, year: condition.year });
    }
  }, [condition.year, getDetail]);

  return {
    modelInfo,
    modelInfoPending,
    regionName: areaInfo?.regionName || '',
    // setYear,
    screenRankChange,
    screenYearChange,
    historyLoading,
    historyData,
    code: codeRef.current,
    detailData,
    detailLoading,
    detailError,
    condition,
    haveDataYear,
    yearLoading,
  };
}
