import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useRequest } from 'ahooks';
import { isEmpty } from 'lodash';

import { getLevel } from '@/pages/area/areaEconomy/common';
import { Level } from '@/pages/area/areaEconomy/config';
import { useImmer } from '@/utils/hooks';

import { getAShareStatistic } from '../../apis';
import { useConditionCtx } from '../../context';
import { TabType } from './useTab';

const typeConfig = {
  ipoPlate: 'ipoPlate',
  entType: 'entType',
  industryType: 'industryType',
};

const typeMap = new Map([
  [
    'ipoPlate',
    {
      type1: '主板',
      type2: '创业板',
      type3: '科创板',
      type4: '北交所',
      type5: '总计',
    },
  ],
  [
    'entType',
    {
      type1: '国有企业',
      type2: '民企',
      type3: '其他',
      type4: '总计',
    },
  ],
  [
    'industryType',
    {
      type1: '第一产业',
      type2: '第二产业',
      type3: '第三产业',
      type4: '总计',
    },
  ],
]);

const useLogic = (type: TabType) => {
  const { update } = useConditionCtx();
  const { code } = useParams<any>();
  const typeObj = typeMap.get(type);
  const [tableData, setTableData] = useState<any[]>([]);
  const [tableCondition, setTableCondition] = useImmer({
    regionCode: '',
    cityCode: '',
    countryCode: '',
    regionLevel: 0,
    from: 0,
    statType: typeConfig[type],
  });

  useEffect(() => {
    if (code) {
      const level = getLevel(code);
      switch (level) {
        case Level.PROVINCE:
          setTableCondition((draft) => {
            draft.regionCode = code;
            draft.regionLevel = level;
          });
          break;
        case Level.CITY:
          setTableCondition((draft) => {
            draft.cityCode = code;
            draft.regionLevel = level;
          });
          break;
        case Level.COUNTY:
          setTableCondition((draft) => {
            draft.countryCode = code;
            draft.regionLevel = level;
          });
          break;
      }
    }
  }, [code, setTableCondition]);

  useEffect(() => {
    setTableCondition((draft) => {
      draft.statType = type;
    });
  }, [type, setTableCondition]);

  // 列表数据获取
  const { loading } = useRequest(() => getAShareStatistic(tableCondition), {
    refreshDeps: [tableCondition],
    ready:
      !!(tableCondition.regionCode || tableCondition.cityCode || tableCondition.countryCode) &&
      !!tableCondition.regionLevel,
    onSuccess: (res: any) => {
      if (res?.data?.length) {
        const raw = res?.data[0];
        const typeArr = Object.values(typeObj!);
        const rebuild = typeArr.map((item: string, index) => {
          if (index !== typeArr.length - 1) {
            return {
              name: item,
              type: item,
              value: raw[`count${index + 1}`],
              count: raw[`count${index + 1}`],
              amount: raw[`amount${index + 1}`],
            };
          } else {
            return {
              name: item,
              type: item,
              value: raw?.totalCount,
              count: raw?.totalCount,
              amount: raw?.totalAmount,
            };
          }
        });
        setTableData(rebuild);
      }
    },
    onError: () => {
      setTableData([]);
    },
    onFinally: (params, res, error) => {
      if (isEmpty(res?.data)) {
        update((draft) => {
          draft.hideModule.listedCompanyDistribution = true;
        });
      }
    },
  });

  return {
    loading,
    tableData,
  };
};

export default useLogic;
