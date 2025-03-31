import { useEffect } from 'react';

import { cloneDeep } from 'lodash';

import { getUpdateDataInfo } from '@/apis/area/areaDebt';
import { InfoType } from '@/pages/area/areaDebt/config';
import { conditionType } from '@/pages/area/areaDebt/getContext';
import useRequest from '@/utils/ahooks/useRequest';

interface Props {
  condition: conditionType;
  updateInfo: InfoType;
}
export default function UseUpdateTipInfo({ condition, updateInfo }: Props) {
  const { params, visible } = updateInfo;

  const { loading, data, run } = useRequest(getUpdateDataInfo, {
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
  }, [condition, params, run, visible]);

  return { loading, data };
}
