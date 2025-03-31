import { useState, useEffect, useRef } from 'react';

import { getInitYear, getMySchemeList, setMySchemeList } from '@/apis/area/areaDebt';
import useRequest from '@/utils/ahooks/useRequest';

export type areaItem = {
  name: string;
  value: string;
  key: string;
  children?: areaItem[];
};
export type selectItems = {
  label: string;
  value: string;
  key: string;
};
const useFilter = () => {
  const [pending, setPending] = useState(true);
  const { loading, data, error } = useRequest(getInitYear);

  useEffect(() => {
    setPending(loading);
  }, [loading, setPending]);

  return {
    loading: pending,
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
