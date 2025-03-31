import { useEffect } from 'react';

import { cloneDeep } from 'lodash';

import { getListTipInfo } from '@/apis/area/areaDebt';
import { InfoType } from '@/pages/area/areaDebt/config';
import { conditionType } from '@/pages/area/areaDebt/getContext';
import useRequest from '@/utils/ahooks/useRequest';

interface Props {
  condition: conditionType;
  listInfo: InfoType;
}

export default function UseListTipInfo({ condition, listInfo }: Props) {
  const { params, visible } = listInfo;
  const { loading, data, run } = useRequest(getListTipInfo, {
    manual: true,
    formatResult: (res) => {
      return res.data;
    },
  });

  useEffect(() => {
    if (visible && condition && params.regionCode && params.indicName) {
      let copyCondition = cloneDeep(condition);
      delete copyCondition.regionName;

      const totalParams = {
        ...copyCondition,
        ...params,
        sort: '',
        size: 10000,
        pageCode: 'regionalEconomyAll',
      };
      run(totalParams);
    }
  }, [condition, run, listInfo, params, visible]);

  return { loading, data };
}
