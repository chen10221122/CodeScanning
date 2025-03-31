import dayjs from 'dayjs';
import { isEmpty } from 'lodash';

import { ScreenType, Options } from '@/components/screen';

const getRecentTimeFromNow = (yearCount: number | number[]) => {
  const now: Date = new Date();
  const nowATime: string = dayjs(now).format('YYYY-MM-DD');
  const nowMonth: string = dayjs(now).format('MM-DD');
  if (Array.isArray(yearCount) && !isEmpty(yearCount)) {
    const bigNum = Math.max(...yearCount);
    const smallNum = Math.min(...yearCount);
    return [now.getFullYear() - bigNum + nowMonth, now.getFullYear() - smallNum + nowMonth];
  }
  return [now.getFullYear() - (yearCount as number) + nowMonth, nowATime];
};

export default [
  {
    title: '下属辖区',
    option: {
      type: ScreenType.MULTIPLE_THIRD,
      children: [],
    },
  },
  {
    title: '国标行业',
    option: {
      type: ScreenType.MULTIPLE_THIRD_AREA,
      children: [],
    },
  },
  {
    title: '注册资本',
    option: {
      type: ScreenType.MULTIPLE,
      children: [
        { name: '10亿及以上', value: '[1000000000,)', filed: 'amount' },
        { name: '1-10亿', value: '[100000000,1000000000)', filed: 'amount' },
        { name: '5000万-1亿', value: '[50000000,100000000)', filed: 'amount' },
        { name: '1000-5000万', value: '[10000000,50000000)', filed: 'amount' },
        { name: '1000万以下', value: '(,10000000)', filed: 'amount' },
      ],
    },
  },
  {
    title: '更多筛选',
    option: {
      type: ScreenType.MULTIPLE_TILING,
      ellipsis: 8,
      children: [
        {
          title: '企业类型',
          hasSelectAll: true,
          multiple: true,
          data: [
            { name: '国企', value: 'b', filed: 'coType' },
            { name: '央企', value: 'a', filed: 'coType' },
            { name: '沪深京上市', value: 'c', filed: 'coType' },
            { name: '香港上市', value: 'd', filed: 'coType' },
            { name: '新三板', value: 'e', filed: 'coType' },
            { name: '发债人', value: 'f', filed: 'coType' },
            { name: '城投', value: 'g', filed: 'coType' },
          ],
        },
        {
          title: '变动日期',
          cancelable: false,
          calendar: {
            filed: 'date',
          },
          ranges: [
            {
              name: `3年内`,
              value: `[${getRecentTimeFromNow(3)?.[0]},${getRecentTimeFromNow(3)?.[1]}]`,
              filed: 'date',
            },
            {
              name: `3-10年`,
              value: `[${getRecentTimeFromNow([3, 10])?.[0]},${getRecentTimeFromNow([3, 10])?.[1]})`,
              filed: 'date',
            },
            {
              name: `10年以上`,
              value: `[,${getRecentTimeFromNow([3, 10])?.[0]})`,
              filed: 'date',
            },
          ],
          customPicker: {
            // defaultValue: [dayjs().subtract(1, 'year'), dayjs()],
            disabledDate: () => false,
          },
        },
        {
          title: '公布日期',
          cancelable: false,
          calendar: {
            filed: 'date',
          },
          ranges: [
            {
              name: `1年内`,
              value: `[${getRecentTimeFromNow(1)?.[0]},${getRecentTimeFromNow(1)?.[1]}]`,
              filed: 'date',
            },
            {
              name: `1-3年`,
              value: `[${getRecentTimeFromNow([1, 3])?.[0]},${getRecentTimeFromNow([1, 3])?.[1]})`,
              filed: 'date',
            },
            {
              name: `3-5年`,
              value: `[${getRecentTimeFromNow([3, 5])?.[0]},${getRecentTimeFromNow([3, 5])?.[1]})`,
              filed: 'date',
            },
          ],
          customPicker: {
            // defaultValue: [dayjs().subtract(1, 'year'), dayjs()],
            disabledDate: () => false,
          },
        },
      ],
    },
  },
] as unknown as Options[];
