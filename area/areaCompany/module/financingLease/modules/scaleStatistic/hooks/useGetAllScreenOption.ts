import { useEffect } from 'react';

import { useMemoizedFn } from 'ahooks';

import { ScreenType } from '@/components/screen';
import { getCensusAnalyseScreenData } from '@/pages/finance/financingLeaseNew/modules/censusAnalyse/api';
import useRequest from '@/utils/ahooks/useRequest';

/** 地区层级对应的接口入参,一级是regionCode，二级是cityCode，三级是countryCode */
export enum AreaKeyMap {
  regionCode = 1,
  cityCode = 2,
  countryCode = 3,
}

/** 行业层级对应的接口入参 */
export enum IndustryKeyMap {
  industryCode = 1,
  secondIndustryCode = 2,
}

const useGetAllScreenOption = (areaLv?: number) => {
  /** 根据树层级，添加level */
  const addLevel = useMemoizedFn((data, level = 1) => {
    return (
      data?.map((item: Record<string, any>) => {
        item.level = level;
        if (item?.children) {
          item.children = addLevel(item.children, level + 1);
        }
        return item;
      }) ?? []
    );
  });

  const {
    data: screenAllData,
    run,
    loading,
  } = useRequest(getCensusAnalyseScreenData, {
    cacheKey: 'censusAnalyse-screen-data',
    formatResult(res) {
      const { area, industryGB } = res.data;
      const areaData = [
        {
          title: '全部',
          option: {
            type: ScreenType.MULTIPLE_THIRD,
            hasSelectAll: false,
            hasAreaSelectAll: false,
            cascade: true,
            children: area?.children,
          },
          formatTitle: (rows: any) => rows.map((d: Record<string, any>) => d.name).toString(),
        },
      ];
      const industryData = [
        {
          title: '全部',
          option: {
            type: ScreenType.MULTIPLE_THIRD,
            hasSelectAll: false,
            cascade: true,
            ellipsis: 9,
            children: addLevel(industryGB?.children),
          },
          formatTitle: (rows: any) => rows.map((d: Record<string, any>) => d.name).toString(),
        },
      ];

      return { ...res.data, area: areaData, industryGB: industryData };
    },
  });

  useEffect(() => {
    run({ areaLv: areaLv ?? 3 });
  }, [run, areaLv]);

  // console.log('screenAllData', screenAllData);

  return { screenAllData, loading };
};

export default useGetAllScreenOption;
