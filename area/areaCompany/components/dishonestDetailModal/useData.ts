import { useState } from 'react';

import { getDishonestExecutorDetail, getCaseOverview } from '@/pages/area/areaCompany/api/regionFinancingApi';
import useRequest from '@/utils/ahooks/useRequest';

export default () => {
  const [dataDetails, setList] = useState<any>({});

  const {
    // data: dataDetails,
    run: getDetails,
    loading: loadingDetails,
  } = useRequest(getDishonestExecutorDetail, {
    manual: true,
    formatResult: (res: any) => res?.data || {},
    onSuccess: (res: any) => {
      setList(res);
    },
    onError: () => {
      setList({});
    },
  });

  const {
    run: getCaseDetails,
    loading: loadingCase,
    data: caseInfo,
  } = useRequest(getCaseOverview, {
    manual: true,
    onSuccess: (res) => {
      // setDataCase(res);
    },
  });

  return { getDetails, getCaseDetails, dataDetails, caseInfo, loadingDetails, loadingCase, setList };
};
