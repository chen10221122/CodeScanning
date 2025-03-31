import { Options, ScreenType } from '@/components/screen';
import { getYears } from '@/pages/area/areaCompare/common';

export const defaultArea = [
  {
    label: '全国',
    parent: '',
    value: '',
  },
  {
    value: '110000',
    label: '北京市',
    parent: '100007',
  },
];

export const defaultAreas = [
  [
    {
      value: '110000',
      label: '北京市',
    },
  ],
  [
    {
      value: '310000',
      label: '上海市',
    },
  ],
  [
    {
      value: '120000',
      label: '天津市',
    },
  ],
  [
    {
      value: '500000',
      label: '重庆市',
    },
  ],
];

export enum LIMIT_SELECT {
  VIP = 1000,
  NORMAL = 8,
}

export const YearConfig: Options[] = [
  {
    title: '时间选择',
    option: {
      type: ScreenType.SINGLE,
      children: getYears(),
      cancelable: false,
    },
    formatTitle: (selectedRows) => selectedRows[0]?.name + '年',
  },
];
