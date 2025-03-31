import { useEffect, useMemo, useRef, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { useRequest } from 'ahooks';

import { useParams } from '@pages/area/areaF9/hooks';

import { getSimilarScore } from '@/apis/area/areaEconomy';
import useAnchor from '@/pages/detail/hooks/useAnchor';
import useLoading from '@/pages/detail/hooks/useLoading';

import { useCtx2 } from '../context2';

export default function useSimilar2() {
  const [tableData, setTableData] = useState<any>([]);
  const [tableLoading, setTableLoading] = useState(true);
  const administrationLevelRef = useRef(null);
  const provinceCodeRef = useRef(null);

  const scoreRef = useRef(null);

  const { code } = useParams();
  const {
    state: { params, yearLoading },
    update,
  } = useCtx2();
  const { deviationRange, year, sameRegionLevel, onlyProvince } = params;

  const scoreParams = useMemo(() => {
    let tempScoreParams: any = {
      deviationRange,
      regionCode: code,
      year,
    };
    if (administrationLevelRef.current && sameRegionLevel) {
      tempScoreParams.administrationLevel = administrationLevelRef.current;
    }
    if (provinceCodeRef.current && onlyProvince) {
      tempScoreParams.provinceCode = provinceCodeRef.current;
    }
    return tempScoreParams;
  }, [code, deviationRange, onlyProvince, sameRegionLevel, year]);

  const {
    data,
    run: getDataFromServer,
    error,
  } = useRequest(getSimilarScore, {
    manual: true,
    onBefore() {
      setTableLoading(true);
    },
    onSuccess(res) {
      if (res.returncode !== 0) {
        setTableData([]);
      } else {
        const renderable = data?.data?.indicList || [];
        administrationLevelRef.current = data?.data?.administrationLevel || null;
        provinceCodeRef.current = data?.data?.provinceCode || null;
        setTableData(renderable);
      }
    },
    onError(error) {
      setTableData([]);
    },
    onFinally() {
      setTableLoading(false);
    },
  });

  // console.log('data-----', data)
  const selectedData = useSelector((store: any) => store?.user?.info, shallowEqual);

  /**初次请求loading
   * defaultIndicatorLoading 默认指标接口加载Loading
   * yearLoading 默认年份加载loading
   */
  const firstLoading = useLoading(tableLoading, Boolean(yearLoading));
  useAnchor(firstLoading);

  // 获取会员权限判断
  useEffect(() => {
    update((draft) => {
      draft.hasPay = selectedData.havePay;
    });
  }, [selectedData.havePay, update]);

  // 更新code
  useEffect(() => {
    update((draft) => {
      draft.params.code = code;
    });
  }, [code, update]);

  // 执行请求
  useEffect(() => {
    // console.log("defaultIndicatorLoading,yearLoading,params.code", defaultIndicatorLoading, yearLoading, params.code)
    if (
      !yearLoading &&
      scoreParams.regionCode &&
      scoreParams.year &&
      JSON.stringify(scoreRef.current) !== JSON.stringify(scoreParams)
    ) {
      // console.log('scoreParams', scoreParams)
      scoreRef.current = scoreParams;
      getDataFromServer(scoreParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, getDataFromServer, yearLoading]);

  return {
    pending: Boolean(tableLoading),
    data: tableData,
    getDataFromServer,
    firstLoading,
    error,
    sameRegionLevel,
    onlyProvince,
    administrationLevel: administrationLevelRef.current,
    provinceCode: provinceCodeRef.current,
  };
}
