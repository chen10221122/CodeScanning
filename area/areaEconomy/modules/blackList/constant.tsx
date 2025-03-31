import dayJs from 'dayjs';

import { SearchType } from '@/components/advanceSearch';
import DateRangePicker from '@/components/antd/rangePicker';

const curDate = dayJs().format('YYYYMMDD');
const oneMonth = dayJs().subtract(1, 'month').format('YYYYMMDD');
const threeMonth = dayJs().subtract(3, 'month').format('YYYYMMDD');
const oneYear = dayJs().subtract(1, 'year').format('YYYYMMDD');
const fiveYear = dayJs().subtract(5, 'year').format('YYYYMMDD');
const tenYear = dayJs().subtract(10, 'year').format('YYYYMMDD');
const fiftenYear = dayJs().subtract(15, 'year').format('YYYYMMDD');

// 前端写死的筛选项
// 日期筛选
export const dateScreenData: Record<string, any> = {
  name: '公告日期',
  value: 'declareDate',
  singleSelect: true,
  children: [
    // {
    //   name: '不限',
    //   value: `${oneMonth},${threeMonth},${oneYear}`,
    // },
    {
      name: '近一个月',
      value: `[${oneMonth},${curDate}]`,
    },
    {
      name: '近三个月',
      value: `[${threeMonth},${curDate}]`,
    },
    {
      name: '近一年',
      value: `[${oneYear},${curDate}]`,
    },
    {
      name: '自定义',
      value: 'customDate',
      type: SearchType.DATE,
    },
  ],
};
// 主体筛选
export const mainBodyScreenData: Record<string, any> = {
  name: '主体',
  value: 'mainBody',
  children: [
    {
      name: '登记状态',
      value: 'registrationStatus',
      // option: {
      //   type: ScreenType.MULTIPLE_THIRD,
      //   // hasSelectAll: false,
      // },
      children: [
        {
          name: '在营',
          value: '1',
        },
        {
          name: '吊销',
          value: '2',
        },
        {
          name: '注销',
          value: '3',
        },
        {
          name: '迁出',
          value: '4',
        },
        {
          name: '其他',
          value: '5',
        },
      ],
    },
    {
      name: '成立时间',
      value: 'establishmentTime',
      // option: {
      //   // type: ScreenType.MULTIPLE_THIRD,
      //   hasSelectAll: false,
      // },
      children: [
        {
          name: '1年内',
          value: `[${oneYear},${curDate})`,
        },
        {
          name: '1-5年',
          value: `[${fiveYear},${oneYear})`,
        },
        {
          name: '5-10年',
          value: `[${tenYear},${fiveYear})`,
        },
        {
          name: '10-15年',
          value: `[${fiftenYear},${tenYear})`,
        },
        {
          name: '15年以上',
          value: `[*,${fiftenYear})`,
        },
        {
          name: '自定义',
          value: '',
          render: () => <DateRangePicker size="small" />,
          customScreen: true,
        },
      ],
    },
    {
      name: '注册资本',
      value: 'registeredCapital',
      // option: {
      //   type: ScreenType.MULTIPLE_THIRD,
      //   // hasSelectAll: false,
      // },
      children: [
        {
          name: '5000万及以上',
          value: '[50000000,*)',
        },
        {
          name: '1000万-5000万',
          value: '[10000000,50000000)',
        },
        {
          name: '500-1000万',
          value: '[5000000,10000000)',
        },
        {
          name: '100-500万',
          value: '[1000000,5000000)',
        },
        {
          name: '0-100万',
          value: '[0,1000000)',
        },
      ],
    },
    {
      name: '上市/发债',
      value: 'companyType',
      // option: {
      //   type: ScreenType.MULTIPLE_THIRD,
      // },
      children: [
        {
          name: '沪深京上市',
          value: '沪深京上市',
        },
        {
          name: '新三板',
          value: '新三板',
        },
        {
          name: '香港上市',
          value: '香港上市',
        },
        {
          name: '发债',
          value: '发债人',
        },
      ],
    },
  ],
};

// 筛选项-新增组合
export const originCombination = {
  name: '新增组合',
  value: 'custom_new_combination',
  type: SearchType.OPTIONAL_COMBINATION,
  props: {
    requireAuth: true,
  },
};

export enum TabEnum {
  /** 列表 */
  List = '黑名单列表',
  /** 图形分析 */
  Graph = '图形分析',
}

// 一页显示数据量
export const PAGESIZE = 50;

export const color = ['#F26279', '#3986FE', '#F9D237', '#35CACA', '#73E6BF'];

export const DEFAULTAREACODE = '100000';

// 页面底部高度固定
export const FooterHeight = 26;
// 表头高度
export const TABLEHEADERHEIGHT = 32;
// 页面最顶部导航栏高度
export const NavBarHeight = 54;
// tab以及间距的总高度
export const TableBarHeight = 40;
