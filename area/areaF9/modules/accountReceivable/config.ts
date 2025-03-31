import { useMemo } from 'react';

import { toNumber } from 'lodash';

import { ScreenType } from '@/components/screen';

export enum PageType {
  /** 融资规模统计页面 */
  STATIC = 'STATIC',
  /** 按出质人/出让人统计页面 */
  TRANSFEROR = 'transferor',
  /** 按质权人/受让人统计页面 */
  PLEDGEE = 'pledgee',
  /** 应收账款融资列表 */
  LIST = 'list',
}

export interface FilterProps {
  options: any[];
  picker?: 'date' | 'time' | 'month' | 'week' | 'quarter' | 'year' | undefined;
  screenChange: Function;
  total: number;
  date: any;
  dateChange: any;
  condition: any;
  filename: string;
  keywordRef?: any;
  handleSearch?: Function;
  dataKey?: any;
  reFresh?: any;
  handleCheck?: Function;
  usePost?: any;
  screenRef?: any;
  withoutSearch?: boolean;
  onChange?: Function;
}

const registerType = {
  type: '',
  key: 'registerType',
  screenOption: {
    title: '融资类型',
    option: {
      type: ScreenType.SINGLE,
      formatTitle(rows: any) {
        if (rows.length) {
          const [{ name }] = rows;
          if (name === '全部') return '融资类型';
          return name;
        }
      },
      children: [
        {
          name: '全部',
          value: '',
          key: 'registerType',
          unlimited: true,
        },
        {
          name: '应收账款质押',
          value: '1',
          key: 'registerType',
        },
        {
          name: '应收账款转让',
          value: '2',
          key: 'registerType',
        },
      ],
    },
  },
};

const registerLimit = {
  type: '',
  key: 'registerLimit',
  screenOption: {
    title: '融资期限',
    option: {
      type: ScreenType.SINGLE,
      formatTitle(rows: any) {
        if (rows.length) {
          const [{ name }] = rows;
          if (name === '全部') return '融资期限';
          return name;
        }
      },
      children: [
        {
          name: '全部',
          value: '',
          key: 'registerLimit',
          unlimited: true,
        },
        {
          name: '1年之内',
          value: '[*, 1)',
          key: 'registerLimit',
        },
        {
          name: '1-3年',
          value: '[1, 3)',
          key: 'registerLimit',
        },
        {
          name: '3-5年',
          value: '[3, 5)',
          key: 'registerLimit',
        },
        {
          name: '5年以上',
          value: '[5, *]',
          key: 'registerLimit',
        },
      ],
    },
  },
};

const pledgorBusinessType = {
  type: '',
  key: 'pledgorBusinessType',
  screenOption: {
    title: '融资企业分类',
    option: {
      type: ScreenType.MULTIPLE,
      formatTitle(rows: any) {
        if (rows.length) {
          const [{ name }] = rows;
          if (name === '全部') return '融资期限';
          return rows.map((row: any) => row.name).join(',');
        }
      },
      children: [
        {
          name: '全部',
          value: '',
          key: 'pledgorBusinessType',
          unlimited: true,
        },
        {
          name: '央企',
          value: '3',
          key: 'pledgorBusinessType',
        },
        {
          name: '央企子公司',
          value: '13',
          key: 'pledgorBusinessType',
        },
        {
          name: '国企',
          value: '1',
          key: 'pledgorBusinessType',
        },
        {
          name: '民企',
          value: '2',
          key: 'pledgorBusinessType',
        },

        {
          name: '城投',
          value: '4',
          key: 'pledgorBusinessType',
        },
        {
          name: '城投子公司',
          value: '12',
          key: 'pledgorBusinessType',
        },
        {
          name: '上市',
          value: '5',
          key: 'pledgorBusinessType',
        },
        {
          name: '发债人',
          value: '6',
          key: 'pledgorBusinessType',
        },
        {
          name: '高新技术企业',
          value: '7',
          key: 'pledgorBusinessType',
        },
        {
          name: '科技型中小企业',
          value: '11',
          key: 'pledgorBusinessType',
        },
        {
          name: '创新型中小企业',
          value: '10',
          key: 'pledgorBusinessType',
        },
        {
          name: '专精特新“小巨人”',
          value: '8',
          key: 'pledgorBusinessType',
        },
        {
          name: '专精特新中小企业',
          value: '9',
          key: 'pledgorBusinessType',
        },
      ],
    },
  },
};

const rangPicker = {
  type: 'rangPickerPre',
  label: '统计周期',
  key: 'frequency',
  screenOption: {
    title: '',
    option: {
      type: ScreenType.SINGLE,
      children: [
        { name: '按月', value: 'm', key: 'frequency', active: true },
        { name: '按季', value: 'q', key: 'frequency' },
        { name: '按年', value: 'y', key: 'frequency' },
      ],
    },
  },
};

const registerStatus = {
  type: '',
  key: 'registerStatus',
  screenOption: {
    title: '最新登记状态',
    option: {
      type: ScreenType.SINGLE,
      children: [
        {
          name: '初始登记',
          value: '3',
          key: 'registerStatus',
        },
        {
          name: '变更登记',
          value: '2',
          key: 'registerStatus',
        },
        {
          name: '展期登记',
          value: '1',
          key: 'registerStatus',
        },

        {
          name: '注销登记',
          value: '7',
          key: 'registerStatus',
        },
      ],
    },
  },
};

const pledgeeBusinessType = {
  type: '',
  key: 'pledgeeBusinessType',
  screenOption: {
    title: '融资企业分类',
    option: {
      type: ScreenType.MULTIPLE,
      formatTitle(rows: any) {
        if (rows.length) {
          const [{ name }] = rows;
          if (name === '全部') return '融资期限';
          return rows.map((row: any) => row.name).join(',');
        }
      },
      children: [
        {
          name: '全部',
          value: '',
          key: 'pledgeeBusinessType',
          unlimited: true,
        },
        {
          name: '国企',
          value: '1',
          key: 'pledgeeBusinessType',
        },
        {
          name: '民企',
          value: '2',
          key: 'pledgeeBusinessType',
        },
        {
          name: '上市',
          value: '5',
          key: 'pledgeeBusinessType',
        },
        {
          name: '发债人',
          value: '6',
          key: 'pledgeeBusinessType',
        },
      ],
    },
  },
};

/**
 * 根据不同的页面返回对应的静态筛选项数据
 * @param type 页面类型
 */
export function useStaticOptions(type: PageType) {
  const StaticOptions = useMemo(() => {
    switch (type) {
      case PageType.STATIC:
        return [
          pledgorBusinessType,
          registerType,
          registerLimit,
          rangPicker,
          {
            type: 'rangePick',
            width: 160,
          },
        ];
      case PageType.TRANSFEROR:
        return [
          pledgorBusinessType,
          registerType,
          registerLimit,
          {
            label: '登记起始日',
            type: 'rangePick',
          },
          {
            type: 'searchNode',
          },
        ];
      case PageType.PLEDGEE:
        return [
          pledgeeBusinessType,
          registerType,
          registerLimit,
          {
            label: '登记起始日',
            type: 'rangePick',
          },
          {
            type: 'searchNode',
          },
        ];
      case PageType.LIST:
        return [
          pledgorBusinessType,
          registerType,
          registerLimit,
          registerStatus,
          {
            label: '登记起始日',
            type: 'rangePick',
          },
          {
            type: 'searchNode',
          },
        ];
      default:
        return [];
    }
  }, [type]);

  return {
    StaticOptions,
  };
}

export const sortMap = new Map<string, string>([
  ['ascend', 'asc'],
  ['descend', 'desc'],
]);

export function ContentDetection(text: string, replace = '-') {
  return text ? text : replace;
}

// 字符串类型的数值表达
export function validateAndReturnText(text: string, replace = '-') {
  // text 为空，null, undefined, 0, 不能转成数字的, 都返回 '-'
  const rebuildText = text ? text.replace(/,/g, '') : text;
  const number = toNumber(rebuildText);
  if (!rebuildText || isNaN(number) || number === 0) return replace;
  return text;
}
