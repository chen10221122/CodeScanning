import dayjs from 'dayjs';

import RangeInput from '@/components/antd/rangeInput';
import { MultipleTilingLineRow, CalendarLineRow, Options, WithExpand, ScreenType } from '@/components/screen';
import { PrivateListProps } from '@/pages/area/areaCompany/api/regionFinancingApi';
import { formatInMoreTitle } from '@/pages/area/areaCompany/utils/filter';

/** 更多筛选-注册资本 */
export const registeredCapital = {
  title: '注册资本',
  cancelable: true,
  multiple: true,
  hasSelectAll: true,
  data: [
    { name: '1亿以上', value: '[100000000,*)', key: 'regCapital', inMore: true },
    { name: '5000万-1亿', value: '[50000000,100000000)', key: 'regCapital', inMore: true },
    { name: '1000万-5000万', value: '[10000000,50000000)', key: 'regCapital', inMore: true },
    { name: '1000万以下', value: '(*,10000000)', key: 'regCapital', inMore: true },
    {
      name: '自定义',
      key: 'regCapital',
      inMore: true,
      value: null,
      render: () => {
        return (
          <WithExpand<[start: string, end: string]>
            formatTitle={(value: any) => <div>{formatInMoreTitle(value, '万')}</div>}
          >
            <RangeInput unit="万" />
          </WithExpand>
        );
      },
    },
  ],
} as MultipleTilingLineRow;

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
/** 更多筛选-成立日期 */
export const dateOfEstablishment = {
  title: '成立日期',
  cancelable: true,
  calendar: {
    inMore: true,
    key: 'establishDate',
  },
  ranges: [
    { name: '不限', value: '', unlimited: true, key: 'establishDate', inMore: true },
    { name: '一年内', value: '1', key: 'establishDate', inMore: true },
    { name: '1-5年', value: '2', key: 'establishDate', inMore: true },
    { name: '5-10年', value: '3', key: 'establishDate', inMore: true },
    { name: '10-15年', value: '4', key: 'establishDate', inMore: true },
    { name: '15年以上', value: '5', key: 'establishDate', inMore: true },
  ],
  customPicker: {
    disabledDate: () => false,
  },
} as unknown as CalendarLineRow;

/** 入榜榜单筛选配置 */
export const rangOption = {
  title: '入选榜单',
  option: {
    type: ScreenType.MULTIPLE,
    multiple: true,
    children: [
      {
        name: '不限',
        value: '',
        key: 'tagCode',
      },
    ],
    // cascade: true,
  },
} as Options;

export const moreScreen = {
  title: '更多筛选',
  option: {
    type: ScreenType.MULTIPLE_TILING,
    ellipsis: 15,
    children: [],
  },
  overlayClassName: 'area-company-revoke-filter-more',
} as Options;

/** 更多筛选-接口返回的name */
export const moreScreenNamesMap = new Map([
  ['登记状态', 'regStatus'],
  ['企业类型', 'enterpriseNature'],
  ['上市发债', 'listingOrIssuance'],
]);
/** 入选榜单 */
export const rangNameMap = new Map([['入选榜单', 'tagCode']]);

export const initDefaultFilter: Partial<PrivateListProps> = {
  isUnRepeated: false,
};
