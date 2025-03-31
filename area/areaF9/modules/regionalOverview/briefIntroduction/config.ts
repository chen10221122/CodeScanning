/** 指标配置，ignoreYear为true时不拼接年份 */

import dayjs from 'dayjs';

export const MainIndicList = [
  [
    {
      indicName: 'GDP',
      value: '',
    },
    {
      indicName: '城镇居民人均可支配收入',
      value: '',
    },
    {
      indicName: '地方政府债务余额',
      value: '',
    },
  ],
  [
    {
      indicName: 'GDP增速',
      value: '',
    },
    {
      indicName: '一般公共预算收入',
      value: '',
    },
    {
      indicName: '财政自给率',
      value: '',
    },
  ],
  [
    {
      indicName: '人口',
      value: '',
      // ignoreYear: true,
    },
    {
      indicName: '政府性基金收入',
      value: '',
    },
    {
      indicName: '债务率(宽口径)',
      value: '',
    },
  ],
];

/**
 * indicData
 * indicYear 需要使用接口返回的年份信息展示
 */
export const formatIndic = (indicData: any[], indicYear?: string) => {
  return MainIndicList.map((indicGroup: any[]) => {
    return indicGroup.map((indicItem: any) => {
      const cur = indicData?.find((dataItem: any) => dataItem?.indicName === indicItem.indicName);
      return {
        indicName: `${(indicYear ?? dayjs().get('year') - 1) + '年'}${cur?.indicName}`,
        value: cur?.indicValue,
        unit: cur?.displayCUnit,
      };
    });
  });
};
