import { useEffect, useRef } from 'react';

import { cloneDeep } from 'lodash';

import { getUpdateData } from '@/apis/area/areaDebt';
import { conditionType } from '@/pages/area/areaDebt/getContext';
import useRequest from '@/utils/ahooks/useRequest';

interface Props {
  condition: conditionType;
  searchRegionCode: string;
  updateDate: { days: number };
  updateRegionCode: string;
}
export default function UseUpdateTip({ condition, searchRegionCode, updateDate, updateRegionCode }: Props) {
  const paramsRef = useRef({});
  const { loading, data, run } = useRequest(getUpdateData, {
    manual: true,
    formatResult: (res) => {
      return res.data;
    },
  });

  useEffect(() => {
    if (condition && Object.keys(condition).length && updateRegionCode) {
      let copyCondition = cloneDeep(condition);
      delete copyCondition.regionName;
      const { regionCode, indicName, endDate } = condition;
      if (indicName) {
        copyCondition.regionCode = regionCode?.join(',');
        copyCondition.indicName = indicName?.join(',');
        copyCondition.endDate = endDate?.join(',');
        // if (keyword && searchRegionCode) {
        //   copyCondition.regionCode = searchRegionCode;
        // } else {
        copyCondition.regionCode = updateRegionCode;
        // }
        const param = {
          ...copyCondition,
          ...updateDate,
          keyword: '',
          sort: '',
          size: 10000,
          pageCode: 'regionalEconomyAll',
        };
        if (JSON.stringify(paramsRef.current) !== JSON.stringify(param)) {
          paramsRef.current = param;
          run(param);
        }
      }
    }
  }, [condition, run, searchRegionCode, updateDate, updateRegionCode]);

  return { loading, data, run };
}
