import dayjs from 'dayjs';

import { RangePicker } from '@/components/antd';
import { Options, ScreenType, RowItem } from '@/components/screen';

/** 注册资本 */
export const registeredCapital = {
  title: '注册资本',
  option: {
    type: ScreenType.MULTIPLE,
    children: [
      { name: '10亿以上', value: '[1000000000,*)', key: 'regCapital' },
      { name: '1亿-10亿', value: '[100000000,1000000000)', key: 'regCapital' },
      { name: '5000万-1亿', value: '[50000000,100000000)', key: 'regCapital' },
      { name: '1000万-5000万', value: '[10000000,50000000)', key: 'regCapital' },
      { name: '1000万以下', value: '(*,10000000)', key: 'regCapital' },
    ],
  },
} as Options;

export const getEstablishDateValue = (val: string) => {
  const curDay = dayjs();
  switch (val) {
    case '1':
      return `[${curDay.subtract(1, 'year').format('YYYY-MM-DD')},${curDay.format('YYYY-MM-DD')})`;
    case '2':
      return `[${curDay.subtract(6, 'year').format('YYYY-MM-DD')},${curDay.subtract(1, 'year').format('YYYY-MM-DD')})`;
    case '3':
      return `[${curDay.subtract(11, 'year').format('YYYY-MM-DD')},${curDay.subtract(6, 'year').format('YYYY-MM-DD')})`;
    case '4':
      return `[${curDay.subtract(16, 'year').format('YYYY-MM-DD')},${curDay
        .subtract(11, 'year')
        .format('YYYY-MM-DD')})`;
    case '5':
      return `(*,${curDay.subtract(16, 'year').format('YYYY-MM-DD')})`;
  }
};
/** 成立日期 */
export const dateOfEstablishment = {
  title: '成立日期',
  option: {
    type: ScreenType.MULTIPLE,
    children: [
      { name: '一年内', value: '1', key: 'establishDate' },
      { name: '1-5年', value: '2', key: 'establishDate' },
      { name: '5-10年', value: '3', key: 'establishDate' },
      { name: '10-15年', value: '4', key: 'establishDate' },
      { name: '15年以上', value: '5', key: 'establishDate' },
      {
        name: '自定义',
        key: 'establishDate',
        render: () => <RangePicker size="small" disabledDate={() => false} />,
      },
    ],
  },
} as Options;

export const getDropScreenConfig: (info: { title: string; config: Record<string, any>[]; key: string }) => Options = ({
  title,
  config,
  key,
}) => ({
  title,
  option: {
    type: ScreenType.MULTIPLE,
    children: config.map((item) => ({ ...(item as RowItem), key })),
  },
});
