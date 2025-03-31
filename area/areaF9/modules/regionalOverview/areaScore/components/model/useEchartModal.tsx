import { useEffect } from 'react';

import { getModalDetail } from '@/apis/area/areaEconomy';
import useRequest from '@/utils/ahooks/useRequest';

const defaultParams = {
  from: 0,
  size: 50,
};

export default function useScore(params: any) {
  const { code, indicatorCode } = params;

  const {
    data: modelInfoData,
    run,
    loading,
  } = useRequest(getModalDetail, {
    manual: true,
  });

  useEffect(() => {
    run({ ...defaultParams, indicatorCode, regionCode: code });
  }, [code, indicatorCode, run]);

  return {
    data: modelInfoData?.data,
    loading,
  };
}
