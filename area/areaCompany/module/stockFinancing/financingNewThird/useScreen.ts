import { useMemo } from 'react';

import { useMemoizedFn } from 'ahooks';

import { ScreenType } from '@/components/screen';
import { FilterEnum } from '@/layouts/filterTableTemplate/config';

/** 市场分层 */
const marketLayer = {
  type: FilterEnum.CommonScreen,
  options: {
    title: '全部',
    key: 'listingSector',
    label: '市场分层',
    option: {
      type: ScreenType.MULTIPLE,
      cancelable: false,
      children: [
        { name: '创新层', key: 'listingSector', value: '1' },
        { name: '基础层', key: 'listingSector', value: '2' },
      ],
    },
  },
};

export default function useScreen(setCondition: any) {
  // 筛选配置
  const screenConfig = useMemo(() => {
    return [marketLayer];
  }, []);
  /** 统计列表筛选变化逻辑 */
  const handleMenuChange = useMemoizedFn((changeType: FilterEnum, allData: Record<string, any>[]) => {
    switch (changeType) {
      case FilterEnum.CommonScreen: {
        if (!allData.length) {
          setCondition((d: any) => {
            d.listingSector = '';
          });
          return;
        }
        setCondition((d: any) => {
          d.listingSector = allData.map((o) => o.value).join(',');
          d.sortKey = 'issueDate';
          d.sortRule = 'desc';
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
