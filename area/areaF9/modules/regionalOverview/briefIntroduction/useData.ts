import { useState } from 'react';

import { getAreaIntroduction } from '@/apis/area/areaEconomy';
import useRequest from '@/utils/ahooks/useRequest';

export default () => {
  const [loading, setLoading] = useState(true);
  const { data, run, error } = useRequest(getAreaIntroduction, {
    manual: true,
    onSuccess: () => setLoading(false),
    onError: () => setLoading(false),
  });

  return {
    data,
    run,
    loading,
    error,
  };
};
