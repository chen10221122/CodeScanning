import { useEffect, useMemo, useRef } from 'react';

import { pick } from 'lodash';

import { isCity, isCounty, isProvince } from '@pages/area/areaF9/utils';

import { useSelector } from '@/pages/area/areaF9/context';
import { useConditionCtx } from '@/pages/area/areaFinancingBoard/context';
import { TableColumnType, TableInfoMap } from '@/pages/area/areaFinancingBoard/modules/stockMarket/type';

const useCondition = (condition: any) => {
  const isInitRef = useRef(false);
  const currentYear = new Date().getFullYear();
  const tabFilterCache = useMemo(() => {
    return {
      startYear: currentYear - 19,
      endYear: currentYear,
    };
  }, [currentYear]);
  const { areaInfo } = useSelector((store) => ({ areaInfo: store.areaInfo }));
  const { update } = useConditionCtx();

  // 各表格不同配置信息
  const { defaultCondition } = TableInfoMap.get(TableColumnType.Scale) || {
    apiName: '',
    exportInfo: { filename: '' },
    defaultCondition: {},
  };

  useEffect(
    function initCondition() {
      if (defaultCondition && !condition && !isInitRef.current && areaInfo?.regionCode) {
        const regionCode = `${areaInfo.regionCode}`;
        isInitRef.current = true;
        update((d) => {
          d.isFirstLoad = true;
          let provinceCode = '',
            cityCode = '',
            countyCode = '';
          if (isProvince(regionCode)) {
            provinceCode = regionCode;
          }
          if (isCity(regionCode)) {
            cityCode = regionCode;
          }
          if (isCounty(regionCode)) {
            countyCode = regionCode;
          }

          d.condition = {
            ...defaultCondition,
            ...pick(tabFilterCache || {}, ['startYear', 'endYear']),
            provinceCode,
            cityCode,
            countyCode,
          };
        });
      }
    },
    [condition, defaultCondition, areaInfo?.regionCode, update, tabFilterCache],
  );
};

export default useCondition;
