import { useState, useEffect, useRef } from 'react';

import { getMySchemeList, setMySchemeList } from '@/apis/area/areaDebt';
import { getInitYear } from '@/pages/area/monthlyEconomy/api';
import useRequest from '@/utils/ahooks/useRequest';

export type AreaItem = {
  /**地区名称 */
  name: string;
  /**地区code */
  value: string;
  key: string;
  children?: AreaItem[];
};
export type SelectItems = {
  label: string;
  value: string;
  key: string;
};
const useFilter = () => {
  const { loading, data, error } = useRequest(getInitYear);
  return {
    loading,
    data,
    error,
  };
};

export const useSetMyScheme = (content: any, planId: string, needSend: boolean = true) => {
  const { data, run } = useRequest(setMySchemeList, { manual: true });
  const needSendRef = useRef(needSend);
  const planIdRef = useRef(planId);

  useEffect(() => {
    planIdRef.current = planId;
  }, [planId]);

  useEffect(() => {
    needSendRef.current = needSend;
  }, [needSend]);

  useEffect(() => {
    if (content && needSendRef.current) run(content, planIdRef.current);
  }, [content, run]);

  return {
    saveResult: data,
  };
};

export const useGetMyScheme = () => {
  const { data, loading } = useRequest(getMySchemeList);
  const [result, setResult] = useState<null | { [a: string]: any }>(null);

  useEffect(() => {
    if (data?.data) setResult(data.data);
  }, [data, setResult]);

  return {
    initScheme: result,
    initSchemeLoading: loading,
  };
};

export default useFilter;
