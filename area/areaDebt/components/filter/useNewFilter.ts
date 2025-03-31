import { useState, useEffect } from 'react';

import { useRequest } from 'ahooks';

import { getNewInitYear } from '@/apis/area/areaDebt';

import { getCacheYear, setCacheYear } from './cacheData';

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

export const useNewFilter = () => {
  const [pending, setPending] = useState(true);
  const [data, setData] = useState<string>('');
  const cacheYear = getCacheYear();
  const { loading, error, run } = useRequest(getNewInitYear, {
    manual: true,
    onSuccess: (res: any) => {
      const date = res.data.split('-')[0];
      setData(date);
      setCacheYear(date);
    },
    onError: (err: any) => {
      console.error(err);
    },
    onFinally: () => {
      setPending(loading);
    },
  });
  useEffect(() => {
    if (cacheYear) {
      setData(cacheYear);
      setPending(false);
    } else {
      run();
    }
  }, [cacheYear, run]);

  return {
    loading: pending,
    data,
    error,
  };
};

export default useNewFilter;
