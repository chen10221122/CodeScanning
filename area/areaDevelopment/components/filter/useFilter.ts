import { useState, useEffect } from 'react';

import { getInitYear } from '@/apis/area/areaDevelopment';
import useRequest from '@/utils/ahooks/useRequest';

const useFilter = () => {
  const [pending, setPending] = useState(true);
  const { loading, data, error } = useRequest(getInitYear, { defaultParams: [{ isHomePage: true }] });

  useEffect(() => {
    setPending(loading);
  }, [loading, setPending]);

  return {
    loading: pending,
    data,
    error,
  };
};

export default useFilter;
