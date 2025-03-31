import { useEffect, useState } from 'react';

import { useRequest } from 'ahooks';

import { getParkFilters } from '@/apis/f9/enterprise/park';

import type { screenApiResult } from './type';

interface Props {
  isOpenEnterprise: boolean;
  enterpriseParams: { devZoneCode: string; devZoneName: string };
}

const initalState = {
  enterpriseNature: [],
  industryCodeAgg: [],
  capitalMapAgg: [],
  enterpriseStatus: [],
  havePhone: [],
};

const useFilter = ({ isOpenEnterprise, enterpriseParams }: Props) => {
  const [option, setOption] = useState<screenApiResult>(initalState);

  const { run } = useRequest(getParkFilters, {
    manual: true,
    onSuccess(res: { data: screenApiResult }) {
      setOption(res?.data ? res.data : initalState);
    },
    onError() {
      setOption(initalState);
    },
  });

  useEffect(() => {
    if (isOpenEnterprise && enterpriseParams.devZoneCode) {
      run({ devCode: enterpriseParams.devZoneCode });
    }
  }, [enterpriseParams.devZoneCode, isOpenEnterprise, run]);

  return option;
};

export default useFilter;
