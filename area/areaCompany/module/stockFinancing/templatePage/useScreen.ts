import { useMemo } from 'react';

import { useMemoizedFn } from 'ahooks';

import { Options } from '@/components/screen';

import { useConditionCtx } from './context';
import { currentYear, FilterEnum, TableInfoMap } from './type';

export default function useScreen({ type, setTabFilterCache }: any) {
  const { update } = useConditionCtx();
  // 筛选配置
  const screenConfig: Options[] = useMemo(() => {
    return TableInfoMap.get(type).screenOptions;
  }, [type]);
  /** 统计列表筛选变化逻辑 */
  const handleMenuChange = useMemoizedFn((changeType: FilterEnum, allData: Record<string, any>[]) => {
    switch (changeType) {
      case FilterEnum.Year: {
        const yearArr = allData?.[0].value;
        if (yearArr?.length) {
          const startYear = yearArr[0]?.substring(0, 4);
          const endYear = yearArr[1]?.substring(0, 4);
          update((d) => {
            d.condition!.startYear = startYear;
            d.condition!.endYear = endYear;
          });
          setTabFilterCache?.((d: any) => {
            d.endYear = endYear;
            d.startYear = startYear;
            return { ...d };
          });
        } else {
          // 未选中任何值，返回默认值(点击了清空)
          update((d) => {
            d.condition!.startYear = currentYear - 19;
            d.condition!.endYear = currentYear;
          });
          setTabFilterCache?.((d: any) => {
            d.startYear = currentYear - 19;
            d.endYear = currentYear;
            return { ...d };
          });
        }
        break;
      }
      case FilterEnum.YearSort: {
        update((d) => {
          d.condition!.sort = allData[0] ? 'asc' : 'desc';
        });
        break;
      }
      case FilterEnum.DateSort: {
        update((d) => {
          d.condition!.sort = allData[0] ? 'asc' : 'desc';
        });
        break;
      }
      case FilterEnum.EnterpriseNature: {
        update((d) => {
          d.condition!.companyType = allData.map((o) => o.value).join(',');
        });
        break;
      }
    }
  });

  return {
    screenConfig,
    handleMenuChange,
  };
}
